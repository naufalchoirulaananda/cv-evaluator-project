import { ChromaClient } from "chromadb";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const client = new ChromaClient();

async function readTextFile(filePath) {
  return fs.promises.readFile(filePath, "utf-8");
}

async function createDummyEmbeddings(texts) {
  console.log("Using dummy embeddings (no OpenAI API)...");
  return texts.map(() => Array(1536).fill(Math.random()));
}

async function main() {
  console.log("Starting ingestion to ChromaDB...");

  const jobPath = path.join(process.cwd(), "refs", "job_description.txt");
  const casePath = path.join(process.cwd(), "refs", "case_study_brief.txt");

  const jobDesc = await readTextFile(jobPath);
  const caseBrief = await readTextFile(casePath);

  const texts = [jobDesc, caseBrief];
  const embeddings = await createDummyEmbeddings(texts);

  const collection = await client.getOrCreateCollection({
    name: "references",
    embeddingFunction: undefined,
  });

  await collection.add({
    ids: ["job_description", "case_study_brief"],
    documents: texts,
    embeddings,
  });

  console.log("References successfully ingested into ChromaDB (dummy mode).");
}

main().catch(console.error);
