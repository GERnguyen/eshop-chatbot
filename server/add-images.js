// Script to add image URLs to existing products
const { MongoClient } = require("mongodb")
require("dotenv/config")

// Mapping product IDs to relevant Unsplash images (free to use)
const productImages = {
  "SOFA001": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop",
  "TABLE001": "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400&h=300&fit=crop",
  "CHAIR001": "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400&h=300&fit=crop",
  "BED001": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop",
  "DESK001": "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=400&h=300&fit=crop",
  "BOOK001": "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=400&h=300&fit=crop",
  "LAMP001": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=300&fit=crop",
  "CABINET001": "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&h=300&fit=crop",
  "RUG001": "https://images.unsplash.com/photo-1600166898405-da9535204843?w=400&h=300&fit=crop",
  "MIRROR001": "https://images.unsplash.com/photo-1618220179428-22790b461013?w=400&h=300&fit=crop"
}

async function addImagesToProducts() {
  const client = new MongoClient(process.env.MONGODB_ATLAS_URI)
  
  try {
    await client.connect()
    console.log("Connected to MongoDB!")

    const db = client.db("inventory_database")
    const collection = db.collection("items")

    // Update each product with its image URL
    for (const [itemId, imageUrl] of Object.entries(productImages)) {
      const result = await collection.updateOne(
        { item_id: itemId },
        { $set: { image_url: imageUrl } }
      )
      
      if (result.modifiedCount > 0) {
        console.log(`✓ Updated image for ${itemId}`)
      } else {
        console.log(`⚠ Product ${itemId} not found or already has image`)
      }
    }

    console.log("\n✅ All product images updated!")

  } catch (error) {
    console.error("Error:", error.message)
  } finally {
    await client.close()
  }
}

addImagesToProducts()
