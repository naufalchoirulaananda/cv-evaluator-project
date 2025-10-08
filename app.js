global.DOMMatrix = class {};
global.ImageData = class {};
global.Path2D = class {};

import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import { ChromaClient } from "chromadb";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const upload = multer({ dest: "uploads/" });
const chroma = new ChromaClient();
let jobs = {};

async function readPdfFile(filePath) {
  try {
    const buffer = await fs.promises.readFile(filePath);
    return buffer.toString("utf-8").slice(0, 10000);
  } catch {
    return "";
  }
}

async function getRelevantContext(queryText) {
  try {
    const collection = await chroma.getOrCreateCollection({ name: "references" });
    const results = await collection.query({
      queryTexts: [queryText],
      nResults: 2,
    });
    return results.documents.flat().join("\n\n");
  } catch (err) {
    console.warn("⚠️ ChromaDB not available, using fallback context.");
    return "Backend Engineer job and case study brief context (simulated).";
  }
}

function simulateEvaluation(jobTitle, cvText, reportText) {
  const randomCvScore = (0.7 + Math.random() * 0.2).toFixed(2);
  const randomProjScore = (3.5 + Math.random() * 1).toFixed(1);

  return {
    cv_match_rate: parseFloat(randomCvScore),
    cv_feedback:
      "The candidate demonstrates a good foundation in backend development, with relevant skills for " +
      jobTitle +
      ". Some areas such as cloud integration and testing practices could be improved.",
    project_score: parseFloat(randomProjScore),
    project_feedback:
      "The project follows the required structure and demonstrates understanding of API design, though resilience and documentation can be further improved.",
    overall_summary:
      "Overall, the candidate shows strong potential and a solid understanding of backend principles, with room to grow in production-level resilience and documentation.",
  };
}

app.post("/upload", upload.fields([{ name: "cv" }, { name: "report" }]), (req, res) => {
  const cv = req.files["cv"]?.[0];
  const report = req.files["report"]?.[0];
  if (!cv || !report) {
    return res.status(400).json({ error: "Both CV and project report are required" });
  }
  res.json({
    cv_id: path.basename(cv.path),
    report_id: path.basename(report.path),
  });
});

app.post("/evaluate", async (req, res) => {
  const { job_title, cv_id, report_id } = req.body;
  if (!job_title || !cv_id || !report_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const jobId = Date.now().toString();
  jobs[jobId] = { status: "processing" };
  res.json({ id: jobId, status: "processing" });

  setTimeout(async () => {
    try {
      const cvText = await readPdfFile(`uploads/${cv_id}`);
      const reportText = await readPdfFile(`uploads/${report_id}`);
      const context = await getRelevantContext(job_title);

      const evaluation = simulateEvaluation(job_title, cvText, reportText);

      jobs[jobId] = {
        status: "completed",
        result: evaluation,
        context_used: context.slice(0, 200) + "...",
      };
    } catch (err) {
      jobs[jobId] = { status: "error", message: err.message };
    }
  }, 2000);
});

app.get("/result/:id", (req, res) => {
  const job = jobs[req.params.id];
  if (!job) return res.status(404).json({ error: "Job not found" });
  res.json(job);
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running at http://localhost:${process.env.PORT || 3000}`);
});