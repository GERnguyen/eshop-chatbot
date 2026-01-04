// Script to add more products to database (30 additional products)
const { MongoClient } = require("mongodb");
require("dotenv/config");

// Additional 30 furniture products
const additionalProducts = [
  // Living Room (6 items)
  {
    item_id: "SOFA002",
    item_name: "Velvet Sectional Sofa",
    item_description:
      "L-shaped sectional sofa with premium velvet upholstery and gold legs",
    brand: "LuxuryHome",
    manufacturer_address: {
      street: "100 Design Blvd",
      city: "New York",
      state: "New York",
      postal_code: "10001",
      country: "USA",
    },
    prices: { full_price: 2499.99, sale_price: 1999.99 },
    categories: ["Living Room", "Sofas", "Velvet"],
    user_reviews: [
      {
        review_date: "2024-03-15",
        rating: 5,
        comment: "Absolutely stunning piece!",
      },
      { review_date: "2024-04-20", rating: 5, comment: "Worth every penny" },
    ],
    notes: "Available in 5 colors",
    image_url:
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=400&h=300&fit=crop",
  },
  {
    item_id: "SOFA003",
    item_name: "Scandinavian Loveseat",
    item_description:
      "Minimalist 2-seater loveseat with natural oak frame and linen cushions",
    brand: "NordicStyle",
    manufacturer_address: {
      street: "55 Nordic Way",
      city: "Seattle",
      state: "Washington",
      postal_code: "98101",
      country: "USA",
    },
    prices: { full_price: 899.99, sale_price: 749.99 },
    categories: ["Living Room", "Sofas", "Scandinavian"],
    user_reviews: [
      {
        review_date: "2024-05-10",
        rating: 4,
        comment: "Perfect for small spaces",
      },
      {
        review_date: "2024-06-15",
        rating: 5,
        comment: "Love the minimalist design",
      },
    ],
    notes: "Easy assembly in 15 minutes",
    image_url:
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop",
  },
  {
    item_id: "COFFEE001",
    item_name: "Marble Top Coffee Table",
    item_description:
      "Elegant coffee table with genuine marble top and brass metal base",
    brand: "ModernLux",
    manufacturer_address: {
      street: "200 Marble St",
      city: "Boston",
      state: "Massachusetts",
      postal_code: "02101",
      country: "USA",
    },
    prices: { full_price: 599.99, sale_price: 499.99 },
    categories: ["Living Room", "Tables", "Marble"],
    user_reviews: [
      {
        review_date: "2024-07-01",
        rating: 5,
        comment: "Gorgeous centerpiece!",
      },
      { review_date: "2024-07-20", rating: 4, comment: "Heavy but beautiful" },
    ],
    notes: "Each piece has unique marble patterns",
    image_url:
      "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=400&h=300&fit=crop",
  },
  {
    item_id: "TV001",
    item_name: "Floating TV Console",
    item_description:
      "Wall-mounted TV stand with LED lighting and cable management system",
    brand: "TechFurniture",
    manufacturer_address: {
      street: "88 Media Ave",
      city: "Austin",
      state: "Texas",
      postal_code: "78701",
      country: "USA",
    },
    prices: { full_price: 449.99, sale_price: 379.99 },
    categories: ["Living Room", "Entertainment", "Modern"],
    user_reviews: [
      {
        review_date: "2024-08-05",
        rating: 5,
        comment: "The LED lights are amazing!",
      },
      {
        review_date: "2024-08-25",
        rating: 4,
        comment: "Great cable management",
      },
    ],
    notes: "Supports TVs up to 75 inches",
    image_url:
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop",
  },
  {
    item_id: "ACCENT001",
    item_name: "Accent Armchair",
    item_description:
      "Mid-century modern accent chair with tufted back and wooden legs",
    brand: "RetroComfort",
    manufacturer_address: {
      street: "77 Retro Lane",
      city: "Chicago",
      state: "Illinois",
      postal_code: "60601",
      country: "USA",
    },
    prices: { full_price: 349.99, sale_price: 299.99 },
    categories: ["Living Room", "Chairs", "Mid-Century"],
    user_reviews: [
      {
        review_date: "2024-09-10",
        rating: 5,
        comment: "Perfect reading chair",
      },
      { review_date: "2024-09-30", rating: 5, comment: "Exactly as pictured" },
    ],
    notes: "Available in 8 fabric colors",
    image_url:
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=300&fit=crop",
  },
  {
    item_id: "SIDE001",
    item_name: "Glass Side Table",
    item_description:
      "Tempered glass side table with chrome frame and modern design",
    brand: "ClearView",
    manufacturer_address: {
      street: "33 Glass Rd",
      city: "Phoenix",
      state: "Arizona",
      postal_code: "85001",
      country: "USA",
    },
    prices: { full_price: 149.99, sale_price: 119.99 },
    categories: ["Living Room", "Tables", "Glass"],
    user_reviews: [
      { review_date: "2024-10-05", rating: 4, comment: "Sleek and modern" },
      { review_date: "2024-10-20", rating: 5, comment: "Easy to clean" },
    ],
    notes: "Set of 2 available",
    image_url:
      "https://images.unsplash.com/photo-1499933374294-4584851497cc?w=400&h=300&fit=crop",
  },

  // Bedroom (6 items)
  {
    item_id: "BED002",
    item_name: "King Size Canopy Bed",
    item_description:
      "Romantic canopy bed frame with elegant metal design and flowing curtains",
    brand: "DreamSleep",
    manufacturer_address: {
      street: "321 Sleep Lane",
      city: "Denver",
      state: "Colorado",
      postal_code: "80201",
      country: "USA",
    },
    prices: { full_price: 1299.99, sale_price: 1099.99 },
    categories: ["Bedroom", "Beds", "Canopy"],
    user_reviews: [
      { review_date: "2024-02-14", rating: 5, comment: "Feel like royalty!" },
      {
        review_date: "2024-03-01",
        rating: 5,
        comment: "Beautiful bedroom centerpiece",
      },
    ],
    notes: "Curtains included",
    image_url:
      "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=400&h=300&fit=crop",
  },
  {
    item_id: "BED003",
    item_name: "Storage Bed Frame",
    item_description:
      "Queen bed with 4 large storage drawers and hydraulic lift mechanism",
    brand: "SpaceSaver",
    manufacturer_address: {
      street: "456 Storage Blvd",
      city: "Minneapolis",
      state: "Minnesota",
      postal_code: "55401",
      country: "USA",
    },
    prices: { full_price: 899.99, sale_price: 799.99 },
    categories: ["Bedroom", "Beds", "Storage"],
    user_reviews: [
      {
        review_date: "2024-04-10",
        rating: 5,
        comment: "So much extra storage!",
      },
      {
        review_date: "2024-05-05",
        rating: 4,
        comment: "Great for small apartments",
      },
    ],
    notes: "Soft-close drawers",
    image_url:
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop",
  },
  {
    item_id: "NIGHT001",
    item_name: "Nightstand with USB",
    item_description:
      "Modern nightstand with built-in USB charging ports and wireless charging pad",
    brand: "TechBedroom",
    manufacturer_address: {
      street: "99 Tech Park",
      city: "San Francisco",
      state: "California",
      postal_code: "94102",
      country: "USA",
    },
    prices: { full_price: 249.99, sale_price: 199.99 },
    categories: ["Bedroom", "Nightstands", "Tech"],
    user_reviews: [
      { review_date: "2024-06-15", rating: 5, comment: "Love the USB ports!" },
      {
        review_date: "2024-07-10",
        rating: 5,
        comment: "Perfect for charging devices",
      },
    ],
    notes: "LED touch light included",
    image_url:
      "https://images.unsplash.com/photo-1532372576444-dda954194ad0?w=400&h=300&fit=crop",
  },
  {
    item_id: "DRESSER001",
    item_name: "6-Drawer Dresser",
    item_description:
      "Spacious dresser with soft-close drawers and anti-tip hardware",
    brand: "SafeStorage",
    manufacturer_address: {
      street: "888 Furniture Way",
      city: "Detroit",
      state: "Michigan",
      postal_code: "48201",
      country: "USA",
    },
    prices: { full_price: 549.99, sale_price: 449.99 },
    categories: ["Bedroom", "Dressers", "Storage"],
    user_reviews: [
      {
        review_date: "2024-08-01",
        rating: 4,
        comment: "Lots of storage space",
      },
      { review_date: "2024-08-20", rating: 5, comment: "Quality construction" },
    ],
    notes: "Child-safe design",
    image_url:
      "https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=400&h=300&fit=crop",
  },
  {
    item_id: "VANITY001",
    item_name: "Makeup Vanity Set",
    item_description:
      "Elegant vanity table with LED mirror, stool, and 5 storage drawers",
    brand: "GlamourHome",
    manufacturer_address: {
      street: "555 Beauty Blvd",
      city: "Las Vegas",
      state: "Nevada",
      postal_code: "89101",
      country: "USA",
    },
    prices: { full_price: 399.99, sale_price: 349.99 },
    categories: ["Bedroom", "Vanity", "Decor"],
    user_reviews: [
      {
        review_date: "2024-09-05",
        rating: 5,
        comment: "Perfect lighting for makeup!",
      },
      { review_date: "2024-09-25", rating: 5, comment: "Feels so luxurious" },
    ],
    notes: "Adjustable LED brightness",
    image_url:
      "https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=400&h=300&fit=crop",
  },
  {
    item_id: "WARDROBE001",
    item_name: "Sliding Door Wardrobe",
    item_description:
      "Large wardrobe with mirror sliding doors and organized interior",
    brand: "OrganizeIt",
    manufacturer_address: {
      street: "777 Closet St",
      city: "Philadelphia",
      state: "Pennsylvania",
      postal_code: "19101",
      country: "USA",
    },
    prices: { full_price: 1199.99, sale_price: 999.99 },
    categories: ["Bedroom", "Wardrobes", "Storage"],
    user_reviews: [
      {
        review_date: "2024-10-10",
        rating: 4,
        comment: "Great space management",
      },
      {
        review_date: "2024-10-30",
        rating: 5,
        comment: "Mirror doors are perfect",
      },
    ],
    notes: "Professional installation recommended",
    image_url:
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=400&h=300&fit=crop",
  },

  // Dining Room (5 items)
  {
    item_id: "TABLE002",
    item_name: "Extendable Dining Table",
    item_description:
      "Modern dining table that extends from 6 to 10 seats with hidden leaf",
    brand: "ExpandaHome",
    manufacturer_address: {
      street: "123 Dining Dr",
      city: "Houston",
      state: "Texas",
      postal_code: "77001",
      country: "USA",
    },
    prices: { full_price: 1099.99, sale_price: 899.99 },
    categories: ["Dining Room", "Tables", "Extendable"],
    user_reviews: [
      { review_date: "2024-11-01", rating: 5, comment: "Perfect for hosting!" },
      { review_date: "2024-11-15", rating: 4, comment: "Easy to extend" },
    ],
    notes: "Seats 6-10 people",
    image_url:
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400&h=300&fit=crop",
  },
  {
    item_id: "DCHAIR001",
    item_name: "Upholstered Dining Chair",
    item_description:
      "Comfortable dining chair with velvet upholstery and gold legs",
    brand: "DineInStyle",
    manufacturer_address: {
      street: "456 Chair Ave",
      city: "Dallas",
      state: "Texas",
      postal_code: "75201",
      country: "USA",
    },
    prices: { full_price: 179.99, sale_price: 149.99 },
    categories: ["Dining Room", "Chairs", "Velvet"],
    user_reviews: [
      {
        review_date: "2024-12-01",
        rating: 5,
        comment: "So comfortable for long dinners",
      },
      {
        review_date: "2024-12-15",
        rating: 5,
        comment: "Beautiful color options",
      },
    ],
    notes: "Sold individually or as set of 4",
    image_url:
      "https://images.unsplash.com/photo-1503602642458-232111445657?w=400&h=300&fit=crop",
  },
  {
    item_id: "BUFFET001",
    item_name: "Modern Buffet Cabinet",
    item_description:
      "Sleek sideboard with wine storage, drawers, and adjustable shelves",
    brand: "EntertainHome",
    manufacturer_address: {
      street: "789 Buffet Ln",
      city: "Nashville",
      state: "Tennessee",
      postal_code: "37201",
      country: "USA",
    },
    prices: { full_price: 799.99, sale_price: 699.99 },
    categories: ["Dining Room", "Storage", "Cabinets"],
    user_reviews: [
      {
        review_date: "2025-01-02",
        rating: 5,
        comment: "Love the wine storage!",
      },
      {
        review_date: "2025-01-05",
        rating: 4,
        comment: "Great for entertaining",
      },
    ],
    notes: "Holds up to 12 wine bottles",
    image_url:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop",
  },
  {
    item_id: "BAR001",
    item_name: "Home Bar Cabinet",
    item_description:
      "Elegant bar cabinet with glass holder, wine rack, and LED lighting",
    brand: "BarStyle",
    manufacturer_address: {
      street: "321 Cocktail Way",
      city: "Miami",
      state: "Florida",
      postal_code: "33101",
      country: "USA",
    },
    prices: { full_price: 649.99, sale_price: 549.99 },
    categories: ["Dining Room", "Bar", "Entertainment"],
    user_reviews: [
      { review_date: "2024-12-20", rating: 5, comment: "Party essential!" },
      {
        review_date: "2024-12-28",
        rating: 5,
        comment: "LED lights are a nice touch",
      },
    ],
    notes: "Includes 2 wine glass racks",
    image_url:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
  },
  {
    item_id: "BENCH001",
    item_name: "Dining Bench",
    item_description:
      "Rustic wooden dining bench that seats 3 with comfortable cushion",
    brand: "FarmhouseStyle",
    manufacturer_address: {
      street: "100 Farm Rd",
      city: "Kansas City",
      state: "Missouri",
      postal_code: "64101",
      country: "USA",
    },
    prices: { full_price: 299.99, sale_price: 249.99 },
    categories: ["Dining Room", "Seating", "Rustic"],
    user_reviews: [
      {
        review_date: "2024-11-20",
        rating: 4,
        comment: "Great farmhouse vibes",
      },
      {
        review_date: "2024-12-05",
        rating: 5,
        comment: "Sturdy and comfortable",
      },
    ],
    notes: "Cushion is removable and washable",
    image_url:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop",
  },

  // Office (5 items)
  {
    item_id: "CHAIR002",
    item_name: "Executive Leather Chair",
    item_description:
      "Premium leather executive chair with memory foam and adjustable lumbar",
    brand: "CEOComfort",
    manufacturer_address: {
      street: "500 Executive Blvd",
      city: "New York",
      state: "New York",
      postal_code: "10001",
      country: "USA",
    },
    prices: { full_price: 699.99, sale_price: 599.99 },
    categories: ["Office", "Chairs", "Leather"],
    user_reviews: [
      {
        review_date: "2024-06-01",
        rating: 5,
        comment: "Best office chair I've owned",
      },
      { review_date: "2024-07-15", rating: 5, comment: "Worth the investment" },
    ],
    notes: "10-year warranty",
    image_url:
      "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400&h=300&fit=crop",
  },
  {
    item_id: "DESK002",
    item_name: "L-Shaped Computer Desk",
    item_description:
      "Spacious corner desk with monitor stand, keyboard tray, and cable management",
    brand: "WorkSmart",
    manufacturer_address: {
      street: "200 Office Park",
      city: "San Jose",
      state: "California",
      postal_code: "95101",
      country: "USA",
    },
    prices: { full_price: 449.99, sale_price: 379.99 },
    categories: ["Office", "Desks", "Computer"],
    user_reviews: [
      {
        review_date: "2024-08-10",
        rating: 4,
        comment: "Great for dual monitors",
      },
      {
        review_date: "2024-09-01",
        rating: 5,
        comment: "Perfect home office setup",
      },
    ],
    notes: "Fits corner spaces perfectly",
    image_url:
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&h=300&fit=crop",
  },
  {
    item_id: "DESK003",
    item_name: "Electric Standing Desk",
    item_description:
      "Height-adjustable desk with dual motors and memory presets",
    brand: "StandUp",
    manufacturer_address: {
      street: "300 Health Way",
      city: "Portland",
      state: "Oregon",
      postal_code: "97201",
      country: "USA",
    },
    prices: { full_price: 599.99, sale_price: 499.99 },
    categories: ["Office", "Desks", "Standing"],
    user_reviews: [
      {
        review_date: "2024-10-01",
        rating: 5,
        comment: "Game changer for my health!",
      },
      {
        review_date: "2024-10-20",
        rating: 5,
        comment: "Smooth motor operation",
      },
    ],
    notes: "4 programmable height presets",
    image_url:
      "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=400&h=300&fit=crop",
  },
  {
    item_id: "FILING001",
    item_name: "Mobile Filing Cabinet",
    item_description:
      "3-drawer filing cabinet with lock and smooth rolling casters",
    brand: "SecureFile",
    manufacturer_address: {
      street: "400 Document Dr",
      city: "Cleveland",
      state: "Ohio",
      postal_code: "44101",
      country: "USA",
    },
    prices: { full_price: 199.99, sale_price: 169.99 },
    categories: ["Office", "Storage", "Filing"],
    user_reviews: [
      {
        review_date: "2024-11-05",
        rating: 4,
        comment: "Keeps documents organized",
      },
      {
        review_date: "2024-11-25",
        rating: 5,
        comment: "Lock feature is great",
      },
    ],
    notes: "Fits under most desks",
    image_url:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
  },
  {
    item_id: "SHELF001",
    item_name: "Office Wall Shelves",
    item_description: "Set of 3 floating shelves with industrial pipe brackets",
    brand: "IndustrialDecor",
    manufacturer_address: {
      street: "150 Loft St",
      city: "Brooklyn",
      state: "New York",
      postal_code: "11201",
      country: "USA",
    },
    prices: { full_price: 129.99, sale_price: 99.99 },
    categories: ["Office", "Shelves", "Industrial"],
    user_reviews: [
      {
        review_date: "2024-12-01",
        rating: 5,
        comment: "Love the industrial look!",
      },
      { review_date: "2024-12-15", rating: 4, comment: "Easy to install" },
    ],
    notes: "Includes all mounting hardware",
    image_url:
      "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=400&h=300&fit=crop",
  },

  // Outdoor (4 items)
  {
    item_id: "PATIO001",
    item_name: "Patio Dining Set",
    item_description:
      "6-piece outdoor dining set with weather-resistant wicker and cushions",
    brand: "OutdoorLiving",
    manufacturer_address: {
      street: "800 Garden Way",
      city: "San Diego",
      state: "California",
      postal_code: "92101",
      country: "USA",
    },
    prices: { full_price: 1299.99, sale_price: 1099.99 },
    categories: ["Outdoor", "Patio", "Dining"],
    user_reviews: [
      {
        review_date: "2024-05-01",
        rating: 5,
        comment: "Perfect for summer BBQs!",
      },
      {
        review_date: "2024-06-10",
        rating: 4,
        comment: "Survived the rain well",
      },
    ],
    notes: "UV-resistant cushions included",
    image_url:
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=400&h=300&fit=crop",
  },
  {
    item_id: "LOUNGE001",
    item_name: "Outdoor Lounge Chair",
    item_description:
      "Adjustable chaise lounge with waterproof fabric and cup holder",
    brand: "RelaxOutdoors",
    manufacturer_address: {
      street: "900 Pool Dr",
      city: "Orlando",
      state: "Florida",
      postal_code: "32801",
      country: "USA",
    },
    prices: { full_price: 349.99, sale_price: 299.99 },
    categories: ["Outdoor", "Lounge", "Pool"],
    user_reviews: [
      {
        review_date: "2024-07-01",
        rating: 5,
        comment: "So relaxing by the pool!",
      },
      {
        review_date: "2024-07-25",
        rating: 5,
        comment: "Adjustable positions are great",
      },
    ],
    notes: "Folds flat for storage",
    image_url:
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=400&h=300&fit=crop",
  },
  {
    item_id: "SWING001",
    item_name: "Porch Swing with Stand",
    item_description:
      "Classic wooden porch swing with steel frame stand and chains",
    brand: "PorchPerfect",
    manufacturer_address: {
      street: "100 Southern Rd",
      city: "Charleston",
      state: "South Carolina",
      postal_code: "29401",
      country: "USA",
    },
    prices: { full_price: 449.99, sale_price: 399.99 },
    categories: ["Outdoor", "Porch", "Swing"],
    user_reviews: [
      {
        review_date: "2024-08-15",
        rating: 5,
        comment: "Love sitting here in evenings",
      },
      {
        review_date: "2024-09-05",
        rating: 5,
        comment: "Beautiful craftsmanship",
      },
    ],
    notes: "Supports up to 500 lbs",
    image_url:
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=400&h=300&fit=crop",
  },
  {
    item_id: "FIREPIT001",
    item_name: "Gas Fire Pit Table",
    item_description:
      "Propane fire pit coffee table with lava rocks and weather cover",
    brand: "FireGlow",
    manufacturer_address: {
      street: "200 Flame Ave",
      city: "Denver",
      state: "Colorado",
      postal_code: "80201",
      country: "USA",
    },
    prices: { full_price: 699.99, sale_price: 599.99 },
    categories: ["Outdoor", "Fire Pit", "Entertainment"],
    user_reviews: [
      {
        review_date: "2024-10-01",
        rating: 5,
        comment: "Perfect for fall evenings!",
      },
      {
        review_date: "2024-10-25",
        rating: 5,
        comment: "Creates great ambiance",
      },
    ],
    notes: "CSA certified for safety",
    image_url:
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=400&h=300&fit=crop",
  },

  // Kids Room (4 items)
  {
    item_id: "KIDS001",
    item_name: "Bunk Bed with Slide",
    item_description: "Fun twin-over-twin bunk bed with slide and ladder",
    brand: "KidsFun",
    manufacturer_address: {
      street: "300 Play St",
      city: "Columbus",
      state: "Ohio",
      postal_code: "43201",
      country: "USA",
    },
    prices: { full_price: 599.99, sale_price: 499.99 },
    categories: ["Kids", "Beds", "Bunk"],
    user_reviews: [
      {
        review_date: "2024-06-01",
        rating: 5,
        comment: "Kids absolutely love it!",
      },
      { review_date: "2024-07-10", rating: 5, comment: "Sturdy and safe" },
    ],
    notes: "Slide can be removed",
    image_url:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop",
  },
  {
    item_id: "KIDS002",
    item_name: "Kids Study Desk Set",
    item_description:
      "Height-adjustable desk and chair set with tilting desktop",
    brand: "LearnWell",
    manufacturer_address: {
      street: "400 School Rd",
      city: "Raleigh",
      state: "North Carolina",
      postal_code: "27601",
      country: "USA",
    },
    prices: { full_price: 299.99, sale_price: 249.99 },
    categories: ["Kids", "Desk", "Study"],
    user_reviews: [
      {
        review_date: "2024-08-01",
        rating: 5,
        comment: "Great for homework time",
      },
      { review_date: "2024-09-15", rating: 4, comment: "Grows with the child" },
    ],
    notes: "Suitable for ages 4-14",
    image_url:
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&h=300&fit=crop",
  },
  {
    item_id: "KIDS003",
    item_name: "Toy Storage Organizer",
    item_description: "Colorful toy storage with 12 bins and bookshelf top",
    brand: "TidyKids",
    manufacturer_address: {
      street: "500 Toy Lane",
      city: "Indianapolis",
      state: "Indiana",
      postal_code: "46201",
      country: "USA",
    },
    prices: { full_price: 149.99, sale_price: 119.99 },
    categories: ["Kids", "Storage", "Toys"],
    user_reviews: [
      {
        review_date: "2024-10-01",
        rating: 5,
        comment: "Finally organized toys!",
      },
      {
        review_date: "2024-10-30",
        rating: 5,
        comment: "Kids can reach everything",
      },
    ],
    notes: "BPA-free plastic bins",
    image_url:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
  },
  {
    item_id: "KIDS004",
    item_name: "Reading Nook Canopy",
    item_description: "Cozy corner canopy with LED lights and cushioned base",
    brand: "DreamyKids",
    manufacturer_address: {
      street: "600 Dream Way",
      city: "Salt Lake City",
      state: "Utah",
      postal_code: "84101",
      country: "USA",
    },
    prices: { full_price: 199.99, sale_price: 169.99 },
    categories: ["Kids", "Reading", "Decor"],
    user_reviews: [
      {
        review_date: "2024-11-15",
        rating: 5,
        comment: "My daughter loves reading here!",
      },
      {
        review_date: "2024-12-01",
        rating: 5,
        comment: "Creates a magical space",
      },
    ],
    notes: "Machine washable cover",
    image_url:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop",
  },
];

// Create embedding text for each item (same format as seed-simple.js)
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

async function addMoreProducts() {
  const client = new MongoClient(process.env.MONGODB_ATLAS_URI);

  try {
    await client.connect();
    console.log("Connected to MongoDB!");

    const db = client.db("inventory_database");
    const collection = db.collection("items");

    const existingCount = await collection.countDocuments();
    console.log(`Current products in database: ${existingCount}`);

    // HuggingFace API setup
    const HF_API_KEY = process.env.HUGGINGFACEHUB_API_KEY;
    if (!HF_API_KEY) {
      throw new Error("HUGGINGFACEHUB_API_KEY is required");
    }

    const HF_MODEL = "sentence-transformers/all-MiniLM-L6-v2";
    const HF_API_URL = `https://router.huggingface.co/hf-inference/models/${HF_MODEL}/pipeline/feature-extraction`;

    console.log(`\nAdding ${additionalProducts.length} new products...\n`);

    // Process items one by one
    for (let i = 0; i < additionalProducts.length; i++) {
      const item = additionalProducts[i];

      // Check if item already exists
      const exists = await collection.findOne({ item_id: item.item_id });
      if (exists) {
        console.log(`⏭ Skipping ${item.item_id} (already exists)`);
        continue;
      }

      const embeddingText = createEmbeddingText(item);

      console.log(
        `Processing ${i + 1}/${additionalProducts.length}: ${item.item_name}`
      );

      // Generate embedding using HuggingFace API
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

      console.log(`  ✓ Added: ${item.item_id}`);

      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    const finalCount = await collection.countDocuments();
    console.log(`\n✅ Done! Total products now: ${finalCount}`);
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await client.close();
  }
}

addMoreProducts();
