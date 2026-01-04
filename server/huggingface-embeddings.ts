// Lightweight HuggingFace Embeddings using direct API calls
// This avoids the heavy @langchain/community package

import "dotenv/config";

const HF_MODEL = "sentence-transformers/all-MiniLM-L6-v2"; // 384 dimensions
const HF_API_URL = `https://router.huggingface.co/hf-inference/models/${HF_MODEL}/pipeline/feature-extraction`;

/**
 * Get embeddings from HuggingFace Inference API directly
 * Much lighter than using @langchain/community package
 */
export async function getHuggingFaceEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.HUGGINGFACEHUB_API_KEY;
  
  if (!apiKey) {
    throw new Error("HUGGINGFACEHUB_API_KEY is not set in environment variables");
  }

  const response = await fetch(HF_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inputs: text }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HuggingFace API error: ${response.status} - ${errorText}`);
  }

  const embedding = await response.json();
  
  // The API returns the embedding directly as an array of numbers
  return embedding as number[];
}

/**
 * Get embeddings for multiple texts (batch)
 */
export async function getHuggingFaceEmbeddings(texts: string[]): Promise<number[][]> {
  const apiKey = process.env.HUGGINGFACEHUB_API_KEY;
  
  if (!apiKey) {
    throw new Error("HUGGINGFACEHUB_API_KEY is not set in environment variables");
  }

  const response = await fetch(HF_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inputs: texts }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HuggingFace API error: ${response.status} - ${errorText}`);
  }

  const embeddings = await response.json();
  return embeddings as number[][];
}

/**
 * Custom Embeddings class that mimics LangChain interface
 * For use with MongoDBAtlasVectorSearch
 */
export class HuggingFaceEmbeddings {
  async embedQuery(text: string): Promise<number[]> {
    return getHuggingFaceEmbedding(text);
  }

  async embedDocuments(texts: string[]): Promise<number[][]> {
    return getHuggingFaceEmbeddings(texts);
  }
}
