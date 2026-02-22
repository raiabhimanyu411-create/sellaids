require('dotenv').config();
const mysql = require('mysql2/promise');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Image columns to migrate (exact column names from DB)
const IMAGE_COLUMNS = [
  'front_photo',
  'back_photo',
  'label_photo',
  'inside_photo',
  'button_photo',
  'wearing_photo',
  'more_images',
  'additional_items',
  'invoice_photo',
  'repair_photo'
];

async function migrateUrls() {
  console.log('🚀 Starting URL Migration...\n');
  
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    // Step 1: Create backup first
    console.log('📦 Creating backup before migration...');
    const [allProducts] = await connection.execute('SELECT * FROM products');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = `backup_before_migration_${timestamp}.json`;
    fs.writeFileSync(backupFile, JSON.stringify(allProducts, null, 2));
    console.log(`✅ Backup saved: ${backupFile}\n`);

    // Step 2: Get all Cloudinary files
    console.log('☁️  Fetching all files from Cloudinary...');
    const cloudinaryFiles = await getAllCloudinaryFiles();
    console.log(`✅ Found ${cloudinaryFiles.length} files in Cloudinary\n`);

    // Create a map for faster lookup
    const cloudinaryMap = new Map();
    cloudinaryFiles.forEach(file => {
      // Store by filename without extension
      const fileName = file.public_id.split('/').pop();
      cloudinaryMap.set(fileName, file.secure_url);
    });

    // Step 3: Get all products with local image URLs
    // Note: more_images is longtext/JSON so check separately
    const textImageColumns = [
      'front_photo', 'back_photo', 'label_photo', 'inside_photo',
      'button_photo', 'wearing_photo', 'invoice_photo', 'repair_photo'
    ];

    const whereConditions = textImageColumns.map(col =>
      `${col} LIKE 'uploads/%'`
    ).join(' OR ');

    const [products] = await connection.execute(
      `SELECT * FROM products WHERE ${whereConditions} OR more_images LIKE '%uploads/%'`
    );

    console.log(`📊 Found ${products.length} products to migrate\n`);
    console.log('🔄 Starting migration...\n');

    let successCount = 0;
    let failCount = 0;
    const failedProducts = [];

    // Step 4: Migrate each product
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const updates = {};
      let hasUpdates = false;

      console.log(`[${i + 1}/${products.length}] Product ID: ${product.id}`);

      // Check each image column
      for (const column of IMAGE_COLUMNS) {
        const dbPath = product[column];
        
        if (!dbPath || dbPath === 'NULL' || dbPath === null) {
          continue;
        }

        // ── Special handling for more_images (JSON array) ──────────────────
        if (column === 'more_images') {
          try {
            const parsed = JSON.parse(dbPath);
            if (Array.isArray(parsed)) {
              const updatedArr = parsed.map(imgPath => {
                if (!imgPath.startsWith('uploads/')) return imgPath; // already migrated
                const filename = imgPath.replace('uploads/', '');
                const cloudUrl = findCloudinaryUrl(filename, cloudinaryMap);
                return cloudUrl || imgPath; // keep old if not found
              });
              const hasChange = updatedArr.some((url, i) => url !== parsed[i]);
              if (hasChange) {
                updates[column] = JSON.stringify(updatedArr);
                hasUpdates = true;
                console.log(`  ✅ ${column}: Updated (${parsed.length} images)`);
              }
            }
          } catch (_) {
            // not JSON, treat as plain path
            if (dbPath.startsWith('uploads/')) {
              const filename = dbPath.replace('uploads/', '');
              const cloudUrl = findCloudinaryUrl(filename, cloudinaryMap);
              if (cloudUrl) {
                updates[column] = cloudUrl;
                hasUpdates = true;
                console.log(`  ✅ ${column}: Found`);
              } else {
                console.log(`  ⚠️  ${column}: Not found in Cloudinary`);
              }
            }
          }
          continue;
        }

        // ── Regular image columns ───────────────────────────────────────────
        if (!dbPath.startsWith('uploads/')) {
          continue; // already a Cloudinary URL, skip
        }

        const filename = dbPath.replace('uploads/', '');
        const cloudinaryUrl = findCloudinaryUrl(filename, cloudinaryMap);

        if (cloudinaryUrl) {
          updates[column] = cloudinaryUrl;
          hasUpdates = true;
          console.log(`  ✅ ${column}: Found`);
        } else {
          console.log(`  ⚠️  ${column}: Not found in Cloudinary`);
        }
      }

      // Update database if we have changes
      if (hasUpdates) {
        try {
          const setClause = Object.keys(updates)
            .map(key => `${key} = ?`)
            .join(', ');
          const values = Object.values(updates);
          values.push(product.id);

          await connection.execute(
            `UPDATE products SET ${setClause} WHERE id = ?`,
            values
          );

          successCount++;
          console.log(`  💾 Updated successfully\n`);
        } catch (error) {
          failCount++;
          failedProducts.push({ id: product.id, error: error.message });
          console.log(`  ❌ Update failed: ${error.message}\n`);
        }
      } else {
        console.log(`  ⏭️  No updates needed\n`);
      }
    }

    // Step 5: Summary
    console.log('\n=== MIGRATION SUMMARY ===');
    console.log(`✅ Successfully migrated: ${successCount} products`);
    console.log(`❌ Failed: ${failCount} products`);
    console.log(`📊 Total processed: ${products.length} products`);

    if (failedProducts.length > 0) {
      console.log('\n⚠️  Failed Products:');
      failedProducts.forEach(fp => {
        console.log(`   Product ID ${fp.id}: ${fp.error}`);
      });
    }

    // Save migration log
    const logFile = `migration_log_${timestamp}.json`;
    fs.writeFileSync(logFile, JSON.stringify({
      timestamp,
      totalProducts: products.length,
      successCount,
      failCount,
      failedProducts
    }, null, 2));
    console.log(`\n📝 Migration log saved: ${logFile}`);

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

function findCloudinaryUrl(searchTerm, cloudinaryMap) {
  // Try exact match first
  if (cloudinaryMap.has(searchTerm)) {
    return cloudinaryMap.get(searchTerm);
  }
  
  // Try partial match
  for (const [key, value] of cloudinaryMap.entries()) {
    if (key.includes(searchTerm) || searchTerm.includes(key.split('.')[0])) {
      return value;
    }
  }
  
  return null;
}

async function getAllCloudinaryFiles() {
  let allFiles = [];
  let nextCursor = null;
  
  do {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'products/',
      max_results: 500,
      next_cursor: nextCursor
    });
    
    allFiles = allFiles.concat(result.resources);
    nextCursor = result.next_cursor;
  } while (nextCursor);
  
  return allFiles;
}

// Run migration
migrateUrls()
  .then(() => {
    console.log('\n✅ Migration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  });