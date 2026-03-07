// Smart Cloudinary Image Rotation Script - FULL VERSION
// Only rotates LANDSCAPE images (horizontal), skips PORTRAIT images (vertical)

import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dgf8ezndj',
  api_key: '563518234842654',
  api_secret: 'Su2W3jmazp56s7_oR6_Q1iEN1mU'
});

// Function to get all images from products folder with dimensions
async function getAllProductImages() {
  try {
    console.log('📦 Fetching all images from products folder...\n');
    
    let allImages = [];
    let nextCursor = null;
    
    do {
      const result = await cloudinary.api.resources({
        type: 'upload',
        prefix: 'products/',
        max_results: 500,
        next_cursor: nextCursor
      });
      
      allImages = allImages.concat(result.resources);
      nextCursor = result.next_cursor;
      
      console.log(`Fetched ${allImages.length} images so far...`);
    } while (nextCursor);
    
    console.log(`\n✅ Total images found: ${allImages.length}\n`);
    return allImages;
  } catch (error) {
    console.error('❌ Error fetching images:', error);
    return [];
  }
}

// Function to check if image is landscape (needs rotation)
function isLandscape(image) {
  // If width > height, it's landscape (horizontal)
  return image.width > image.height;
}

// Function to rotate a single image by 270 degrees
async function rotateImage(publicId) {
  try {
    // Use explicit() to apply transformation and overwrite the original
    const result = await cloudinary.uploader.explicit(publicId, {
      type: 'upload',
      eager: [{ angle: 270 }],
      overwrite: true,
      invalidate: true
    });
    
    return { success: true, publicId };
  } catch (error) {
    return { success: false, publicId, error: error.message };
  }
}

// Main function
async function main() {
  console.log('🚀 Starting Smart Cloudinary Image Rotation Script - FULL MODE\n');
  console.log('=' .repeat(60));
  console.log('⚠️  IMPORTANT: This will rotate ALL LANDSCAPE images');
  console.log('⚠️  Portrait images will be SKIPPED automatically');
  console.log('⚠️  Make sure you have backup before proceeding!');
  console.log('=' .repeat(60));
  console.log('\n');
  
  // Get all images
  let images = await getAllProductImages();
  
  if (images.length === 0) {
    console.log('❌ No images found in products folder!');
    return;
  }
  
  // Filter: Only landscape images (width > height)
  const landscapeImages = images.filter(img => isLandscape(img));
  const portraitImages = images.filter(img => !isLandscape(img));
  
  console.log(`\n📊 Image Analysis:`);
  console.log(`   Total Images: ${images.length}`);
  console.log(`   🔄 Landscape (will rotate): ${landscapeImages.length}`);
  console.log(`   ✅ Portrait (will skip): ${portraitImages.length}\n`);
  
  if (landscapeImages.length === 0) {
    console.log('✅ No landscape images need rotation!');
    return;
  }
  
  console.log(`📝 Will rotate ${landscapeImages.length} landscape images\n`);
  
  // Ask for confirmation
  console.log('⏳ Starting rotation in 5 seconds...');
  console.log('⏳ Press Ctrl+C to cancel if needed!\n');
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // Process images in batches
  const batchSize = 10;
  let processed = 0;
  let successful = 0;
  let failed = 0;
  
  for (let i = 0; i < landscapeImages.length; i += batchSize) {
    const batch = landscapeImages.slice(i, i + batchSize);
    
    console.log(`\n🔄 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(landscapeImages.length / batchSize)}`);
    
    const promises = batch.map(img => {
      console.log(`   📐 ${img.public_id} (${img.width}x${img.height})`);
      return rotateImage(img.public_id);
    });
    
    const results = await Promise.all(promises);
    
    results.forEach(result => {
      processed++;
      if (result.success) {
        successful++;
        console.log(`  ✅ ${result.publicId}`);
      } else {
        failed++;
        console.log(`  ❌ ${result.publicId} - ${result.error}`);
      }
    });
    
    console.log(`  Progress: ${processed}/${landscapeImages.length}`);
    
    // Wait a bit between batches to avoid rate limits
    if (i + batchSize < landscapeImages.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('🎉 ROTATION COMPLETE!');
  console.log('='.repeat(60));
  console.log(`\n📊 Final Summary:`);
  console.log(`   Total Images Scanned: ${images.length}`);
  console.log(`   🔄 Landscape Images Rotated: ${successful}`);
  console.log(`   ✅ Portrait Images Skipped: ${portraitImages.length}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log('\n💡 Note: Images might take a few minutes to update due to CDN caching');
  console.log('   Clear your browser cache (Ctrl+Shift+Delete) to see changes immediately!\n');
}

// Run the script
main().catch(console.error);