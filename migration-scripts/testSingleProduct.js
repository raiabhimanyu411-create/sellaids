require('dotenv').config();
const mysql = require('mysql2/promise');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function testSingleProduct() {
  console.log('🧪 Testing single product migration...\n');

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    // ─── Step 1: Get one product with local images ───────────────────────────
    const [products] = await connection.execute(
      "SELECT * FROM products WHERE front_photo LIKE 'uploads/%' LIMIT 1"
    );

    if (products.length === 0) {
      console.log('❌ No products found with local image URLs');
      return;
    }

    const product = products[0];
    console.log('📦 Product from Database:');
    console.log(`   ID        : ${product.id}`);
    console.log(`   Name      : ${product.model_name || product.product_name || 'N/A'}`);

    const imageColumns = [
      'vendor_pic', 'catalog_pic', 'front_photo', 'back_photo',
      'neck_photo', 'sleev_photo', 'wearing_photo', 'additional_items'
    ];

    console.log('\n📷 Image URLs in Database:');
    for (const col of imageColumns) {
      if (product[col] && product[col] !== 'NULL') {
        console.log(`   ${col}: ${product[col]}`);
      }
    }

    // ─── Step 2: Fetch first 10 files from Cloudinary ────────────────────────
    console.log('\n☁️  Fetching files from Cloudinary (products folder)...\n');

    const cloudinaryResult = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'products/',
      max_results: 10
    });

    console.log(`✅ Found ${cloudinaryResult.resources.length} files in Cloudinary (showing first 10):\n`);
    cloudinaryResult.resources.forEach((file, i) => {
      const parts = file.public_id.split('/');
      const name  = parts[parts.length - 1]; // filename only
      console.log(`  ${i + 1}. public_id : ${file.public_id}`);
      console.log(`      filename  : ${name}`);
      console.log(`      url       : ${file.secure_url}`);
      console.log('');
    });

    // ─── Step 3: Compare DB filename vs Cloudinary filename ──────────────────
    const frontPhoto = product.front_photo;
    if (frontPhoto && frontPhoto.startsWith('uploads/')) {
      const dbFilename = frontPhoto.replace('uploads/', '');
      const dbNameNoExt = dbFilename.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '');

      console.log('─────────────────────────────────────────────');
      console.log('🔎 Comparison:');
      console.log(`   DB filename        : ${dbFilename}`);
      console.log(`   DB name (no ext)   : ${dbNameNoExt}`);
      console.log('');

      // Try to find a match
      const match = cloudinaryResult.resources.find(file => {
        const cloudName = file.public_id.split('/').pop();
        return cloudName.includes(dbNameNoExt) || dbNameNoExt.includes(cloudName.split('.')[0]);
      });

      if (match) {
        console.log('✅ MATCH FOUND!');
        console.log(`   Cloudinary URL: ${match.secure_url}`);
        console.log('\n🎉 Naming pattern matches! Safe to run migration.');
      } else {
        console.log('⚠️  No direct match found in first 10 files.');
        console.log('   Compare the DB filename and Cloudinary filenames above.');
        console.log('   Check if naming pattern is similar or completely different.');
      }
      console.log('─────────────────────────────────────────────');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

// Run
testSingleProduct()
  .then(() => {
    console.log('\n✅ Test completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Test failed:', error);
    process.exit(1);
  });