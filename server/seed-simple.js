// Simple seed script without heavy LangChain dependencies
const { MongoClient } = require("mongodb");
require("dotenv/config");

// Sample furniture data with pre-defined embeddings (to be generated)
const sampleFurniture = [
  {
    item_id: "SOFA001",
    item_name: "Modern Leather Sofa",
    item_description:
      "A luxurious 3-seater leather sofa with soft cushions and sturdy wooden frame",
    brand: "ComfortLiving",
    manufacturer_address: {
      street: "123 Furniture Ave",
      city: "Los Angeles",
      state: "California",
      postal_code: "90001",
      country: "USA",
    },
    prices: { full_price: 1299.99, sale_price: 999.99 },
    categories: ["Living Room", "Sofas", "Leather"],
    user_reviews: [
      {
        review_date: "2024-01-15",
        rating: 5,
        comment: "Extremely comfortable and stylish!",
      },
      {
        review_date: "2024-02-20",
        rating: 4,
        comment: "Great quality, fast delivery",
      },
    ],
    notes: "Best seller in the leather sofa category",
  },
  {
    item_id: "TABLE001",
    item_name: "Oak Dining Table",
    item_description:
      "Solid oak wood dining table that seats 6 people comfortably",
    brand: "WoodCraft",
    manufacturer_address: {
      street: "456 Oak Street",
      city: "Portland",
      state: "Oregon",
      postal_code: "97201",
      country: "USA",
    },
    prices: { full_price: 899.99, sale_price: 749.99 },
    categories: ["Dining Room", "Tables", "Wood"],
    user_reviews: [
      {
        review_date: "2024-03-10",
        rating: 5,
        comment: "Beautiful craftsmanship!",
      },
      { review_date: "2024-04-05", rating: 5, comment: "Sturdy and elegant" },
    ],
    notes: "Handcrafted from sustainable oak",
  },
  {
    item_id: "CHAIR001",
    item_name: "Ergonomic Office Chair",
    item_description:
      "Adjustable office chair with lumbar support and breathable mesh back",
    brand: "ErgoComfort",
    manufacturer_address: {
      street: "789 Tech Blvd",
      city: "San Jose",
      state: "California",
      postal_code: "95101",
      country: "USA",
    },
    prices: { full_price: 449.99, sale_price: 379.99 },
    categories: ["Office", "Chairs", "Ergonomic"],
    user_reviews: [
      {
        review_date: "2024-05-12",
        rating: 4,
        comment: "Great for long work hours",
      },
      {
        review_date: "2024-06-18",
        rating: 5,
        comment: "My back pain is gone!",
      },
    ],
    notes: "Recommended by chiropractors",
  },
  {
    item_id: "BED001",
    item_name: "Queen Size Platform Bed",
    item_description:
      "Modern platform bed with upholstered headboard and sturdy slats",
    brand: "DreamSleep",
    manufacturer_address: {
      street: "321 Sleep Lane",
      city: "Denver",
      state: "Colorado",
      postal_code: "80201",
      country: "USA",
    },
    prices: { full_price: 699.99, sale_price: 599.99 },
    categories: ["Bedroom", "Beds", "Platform"],
    user_reviews: [
      {
        review_date: "2024-07-22",
        rating: 5,
        comment: "Easy assembly and very sturdy",
      },
      {
        review_date: "2024-08-30",
        rating: 4,
        comment: "Looks exactly like the pictures",
      },
    ],
    notes: "No box spring required",
  },
  {
    item_id: "DESK001",
    item_name: "Standing Desk Converter",
    item_description:
      "Adjustable standing desk that sits on top of existing desk",
    brand: "StandUp",
    manufacturer_address: {
      street: "555 Health Way",
      city: "Austin",
      state: "Texas",
      postal_code: "78701",
      country: "USA",
    },
    prices: { full_price: 299.99, sale_price: 249.99 },
    categories: ["Office", "Desks", "Standing"],
    user_reviews: [
      {
        review_date: "2024-09-05",
        rating: 5,
        comment: "Perfect for working from home",
      },
      {
        review_date: "2024-10-11",
        rating: 4,
        comment: "Smooth height adjustment",
      },
    ],
    notes: "Supports up to 35 lbs",
  },
  {
    item_id: "BOOK001",
    item_name: "Industrial Bookshelf",
    item_description:
      "5-tier metal and wood bookshelf with rustic industrial design",
    brand: "UrbanLoft",
    manufacturer_address: {
      street: "888 Design District",
      city: "Brooklyn",
      state: "New York",
      postal_code: "11201",
      country: "USA",
    },
    prices: { full_price: 199.99, sale_price: 159.99 },
    categories: ["Living Room", "Storage", "Industrial"],
    user_reviews: [
      {
        review_date: "2024-11-01",
        rating: 5,
        comment: "Love the industrial look!",
      },
      {
        review_date: "2024-11-15",
        rating: 4,
        comment: "Very sturdy for the price",
      },
    ],
    notes: "Easy 30-minute assembly",
  },
  {
    item_id: "LAMP001",
    item_name: "Mid-Century Floor Lamp",
    item_description:
      "Tripod floor lamp with fabric shade and walnut wood legs",
    brand: "LightHouse",
    manufacturer_address: {
      street: "222 Bright Ave",
      city: "Seattle",
      state: "Washington",
      postal_code: "98101",
      country: "USA",
    },
    prices: { full_price: 149.99, sale_price: 119.99 },
    categories: ["Living Room", "Lighting", "Mid-Century"],
    user_reviews: [
      {
        review_date: "2024-12-01",
        rating: 5,
        comment: "Beautiful warm lighting",
      },
      { review_date: "2024-12-10", rating: 5, comment: "Perfect accent piece" },
    ],
    notes: "Compatible with smart bulbs",
  },
  {
    item_id: "CABINET001",
    item_name: "Kitchen Pantry Cabinet",
    item_description:
      "Tall storage cabinet with adjustable shelves and soft-close doors",
    brand: "HomeOrganize",
    manufacturer_address: {
      street: "444 Storage St",
      city: "Chicago",
      state: "Illinois",
      postal_code: "60601",
      country: "USA",
    },
    prices: { full_price: 349.99, sale_price: 299.99 },
    categories: ["Kitchen", "Storage", "Cabinets"],
    user_reviews: [
      {
        review_date: "2025-01-02",
        rating: 4,
        comment: "Great storage solution",
      },
      { review_date: "2025-01-03", rating: 5, comment: "Excellent quality" },
    ],
    notes: "Water-resistant finish",
  },
  {
    item_id: "RUG001",
    item_name: "Persian Style Area Rug",
    item_description:
      "Hand-woven 8x10 area rug with traditional Persian patterns",
    brand: "RugMaster",
    manufacturer_address: {
      street: "777 Weave Way",
      city: "Atlanta",
      state: "Georgia",
      postal_code: "30301",
      country: "USA",
    },
    prices: { full_price: 599.99, sale_price: 499.99 },
    categories: ["Living Room", "Rugs", "Traditional"],
    user_reviews: [
      {
        review_date: "2025-01-01",
        rating: 5,
        comment: "Gorgeous colors and patterns",
      },
      { review_date: "2025-01-02", rating: 4, comment: "Very soft underfoot" },
    ],
    notes: "Stain-resistant treatment applied",
  },
  {
    item_id: "MIRROR001",
    item_name: "Full Length Wall Mirror",
    item_description: "Large 65x22 inch wall mirror with gold metal frame",
    brand: "ReflectStyle",
    manufacturer_address: {
      street: "999 Mirror Lane",
      city: "Miami",
      state: "Florida",
      postal_code: "33101",
      country: "USA",
    },
    prices: { full_price: 249.99, sale_price: 199.99 },
    categories: ["Bedroom", "Mirrors", "Decor"],
    user_reviews: [
      {
        review_date: "2025-01-03",
        rating: 5,
        comment: "Makes the room look bigger!",
      },
      { review_date: "2025-01-04", rating: 5, comment: "Beautiful gold frame" },
    ],
    notes: "Includes wall mounting hardware",
  },
];

// Create embedding text for each item
function createEmbeddingText(item) {
  const manufacturerDetails = `Made in ${item.manufacturer_address.country}`;
  const categories = item.categories.join(", ");
  const userReviews = item.user_reviews
    .map(
      (review) =>
        `Rated ${review.rating} on ${review.review_date}: ${review.comment}`
    )
    .join(" ");
  const basicInfo = `${item.item_name} ${item.item_description} from the brand ${item.brand}`;
  const price = `At full price it costs: ${item.prices.full_price} USD, On sale it costs: ${item.prices.sale_price} USD`;
  const notes = item.notes;

  return `${basicInfo}. Manufacturer: ${manufacturerDetails}. Categories: ${categories}. Reviews: ${userReviews}. Price: ${price}. Notes: ${notes}`;
}

async function seedDatabase() {
  const client = new MongoClient(process.env.MONGODB_ATLAS_URI);

  try {
    await client.connect();
    console.log("Connected to MongoDB!");

    const db = client.db("inventory_database");
    const collection = db.collection("items");

    // Clear existing data
    await collection.deleteMany({});
    console.log("Cleared existing data");

    // Check if HuggingFace API key exists for embeddings
    const HF_API_KEY = process.env.HUGGINGFACEHUB_API_KEY;
    if (!HF_API_KEY) {
      throw new Error(
        "HUGGINGFACEHUB_API_KEY is required for generating embeddings"
      );
    }

    const HF_MODEL = "sentence-transformers/all-MiniLM-L6-v2"; // 384 dimensions
    const HF_API_URL = `https://router.huggingface.co/hf-inference/models/${HF_MODEL}/pipeline/feature-extraction`;

    // Process items one by one to avoid memory issues
    for (let i = 0; i < sampleFurniture.length; i++) {
      const item = sampleFurniture[i];
      const embeddingText = createEmbeddingText(item);

      console.log(
        `Processing item ${i + 1}/${sampleFurniture.length}: ${item.item_name}`
      );

      // Generate embedding using HuggingFace API directly
      const response = await fetch(HF_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: embeddingText }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`HuggingFace API error: ${error}`);
      }

      const embedding = await response.json();

      // Insert document with embedding
      await collection.insertOne({
        ...item,
        embedding_text: embeddingText,
        embedding: embedding,
      });

      console.log(`  ✓ Saved: ${item.item_id}`);

      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    // Create vector search index
    console.log("\nCreating vector search index...");
    try {
      // Check if index exists
      const indexes = await collection.listSearchIndexes().toArray();
      const existingIndex = indexes.find((idx) => idx.name === "vector_index");

      if (existingIndex) {
        console.log("Vector search index already exists");
      } else {
        await collection.createSearchIndex({
          name: "vector_index",
          type: "vectorSearch",
          definition: {
            fields: [
              {
                type: "vector",
                path: "embedding",
                numDimensions: 384, // HuggingFace all-MiniLM-L6-v2 uses 384 dimensions
                similarity: "cosine",
              },
            ],
          },
        });
        console.log("Vector search index created");
      }
    } catch (e) {
      console.log(
        "Note: Vector index creation may require Atlas M10+ cluster or may already exist"
      );
      console.log("Error:", e.message);
    }

    console.log("\n✅ Database seeding completed!");
    console.log(`Total items inserted: ${sampleFurniture.length}`);
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await client.close();
  }
}

seedDatabase();
