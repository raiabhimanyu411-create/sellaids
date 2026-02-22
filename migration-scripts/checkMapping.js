require('dotenv').config();
const mysql = require('mysql2/promise');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Image columns to check
const IMAGE_COLUMNS = [
  'vendor_pic',
  'catalog_pdf',
  'catalog_pic',
  'front_photo',
  'back_photo',
  'neck_photo',
  'sleev_photo',
  'neck_images',
  'wearing_photo',
  'additional_items'
];

async function checkMapping() {
  console.log('🔍 Checking filename mapping between Database and Cloudinary...\n');
  
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    // Get sample products from database
    const [products] = await connection.execute(
      'SELECT id, vendor_pic, catalog_pic, front_photo, back_photo, neck_photo, sleev_photo, wearing_photo FROM products WHERE vendor_pic IS NOT NULL OR front_photo IS NOT NULL LIMIT 5'
    );

    console.log(`📊 Checking ${products.length} sample products...\n`);

    // Get all files from Cloudinary products folder
    console.log('☁️  Fetching files from Cloudinary...');
    const cloudinaryFiles = await getAllCloudinaryFiles();
    console.log(`✅ Found ${cloudinaryFiles.length} files in Cloudinary\n`);

    // Check each product
    let matchCount = 0;
    let mismatchCount = 0;

    for (const product of products) {
      console.log(`\n--- Product ID: ${product.id} ---`);
      
      for (const column of IMAGE_COLUMNS) {
        const dbPath = product[column];
        
        if (!dbPath || dbPath === 'NULL') continue;
        
        // Extract filename from database path
        // Format: uploads/1742467819163_67317ec44c870d4917665284_1742467818987.JPG
        const filename = dbPath.replace('uploads/', '');
        
        // Check if file exists in Cloudinary
        const foundInCloudinary = cloudinaryFiles.find(file => {
          // Cloudinary filename might be: wearing_photo-1769168369906-257131316.JPG.webp
          // Or it might match exactly
          return file.public_id.includes(filename.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '')) ||
                 file.public_id.endsWith(filename);
        });

        if (foundInCloudinary) {
          console.log(`  ✅ ${column}: MATCHED`);
          console.log(`     DB: ${dbPath}`);
          console.log(`     Cloudinary: ${foundInCloudinary.secure_url}`);
          matchCount++;
        } else {
          console.log(`  ❌ ${column}: NOT FOUND`);
          console.log(`     DB: ${dbPath}`);
          mismatchCount++;
        }
      }
    }

    console.log('\n\n=== SUMMARY ===');
    console.log(`✅ Matched: ${matchCount}`);
    console.log(`❌ Not Found: ${mismatchCount}`);
    
    if (matchCount > 0) {
      console.log('\n💡 Files are being found in Cloudinary!');
      console.log('   You can proceed with migration.');
    } else {
      console.log('\n⚠️  Warning: No matches found!');
      console.log('   Please check:');
      console.log('   1. Cloudinary folder name is correct (products)');
      console.log('   2. Files were uploaded with same names');
      console.log('   3. API credentials are correct');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
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

// Run check
checkMapping()
  .then(() => {
    console.log('\n✅ Check completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Check failed:', error);
    process.exit(1);
  });