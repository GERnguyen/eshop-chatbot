// Script to recreate vector index with correct dimensions (384 for HuggingFace)
const { MongoClient } = require("mongodb")
require("dotenv/config")

async function recreateVectorIndex() {
  const client = new MongoClient(process.env.MONGODB_ATLAS_URI)
  
  try {
    await client.connect()
    console.log("Connected to MongoDB!")

    const db = client.db("inventory_database")
    const collection = db.collection("items")

    // List current indexes
    console.log("\nCurrent search indexes:")
    const indexes = await collection.listSearchIndexes().toArray()
    console.log(indexes.map(idx => ({ name: idx.name, type: idx.type })))

    // Drop existing vector_index if exists
    const existingIndex = indexes.find(idx => idx.name === "vector_index")
    if (existingIndex) {
      console.log("\nDropping existing vector_index...")
      await collection.dropSearchIndex("vector_index")
      console.log("Dropped successfully!")
      
      // Wait a bit for index to be dropped
      console.log("Waiting for index deletion to complete...")
      await new Promise(resolve => setTimeout(resolve, 5000))
    }

    // Create new index with 384 dimensions
    console.log("\nCreating new vector_index with 384 dimensions...")
    await collection.createSearchIndex({
      name: "vector_index",
      type: "vectorSearch",
      definition: {
        fields: [
          {
            type: "vector",
            path: "embedding",
            numDimensions: 384, // HuggingFace all-MiniLM-L6-v2
            similarity: "cosine"
          }
        ]
      }
    })
    
    console.log("✅ Vector index created successfully with 384 dimensions!")
    console.log("\nNote: Index may take a few minutes to become active.")

  } catch (error) {
    console.error("Error:", error.message)
  } finally {
    await client.close()
  }
}

recreateVectorIndex()
