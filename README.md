
# CV Evaluator (Backend Case Study)

This project was built as part of the Product Engineer (Backend) case study.

The goal is to design a simple backend system that can automatically evaluate a candidate’s CV and project report based on a given job description and case study brief.


## 🚀 Overview

This is a small backend application built with Node.js and Express.
It simulates an AI-powered evaluation pipeline that goes through the following steps:

- Upload candidate files (CV and report)
- Evaluate both documents using job and case study context
- Return a structured result with scores and feedback

The system also includes a RAG (Retrieval-Augmented Generation) component using ChromaDB, which stores and retrieves reference documents (job description and brief).

Because API quotas can be limited, this project runs in simulation mode, meaning the AI logic is mocked, but the architecture still follows how a real LLM-assisted system would work.
## 🧱 Tech Stack

**Node.js + Express** : core backend framework

**Multer** : handles file uploads

**ChromaDB** : local vector database for storing context

**pdf-parse** : reads PDF contents

**dotenv** : manages environment variables
## 🏃🏻‍♂️‍➡️ How to Run

- Clone and install dependencies
```bash
  https://github.com/naufalchoirulaananda/cv-evaluator-project.git
```
```bash
  cd cv-evaluator
```
```bash
  npm install
```

- Start ChromaDB locally
If you haven’t started Chroma before:
```bash
  chroma run --path ./.chromadb
```

- Ingest reference documents
This step stores the job description and case study brief into ChromaDB.
```bash
  node ingest.js
```
Expected output:
```bash
  References successfully ingested into ChromaDB (dummy mode).
```

- Run the main server
```bash
  node app.js
```
The server will start at:
```bash
  http://localhost:3000
```

## 🧪 API Endpoints

### **POST /upload**

Upload candidate CV and project report.

**Body (form-data):**
```bash
cv: <file.pdf>
report: <file.pdf>
```

**Response:**
```bash
{ 
    "cv_id": "12345", 
    "report_id": "67890" 
}
```

### **POST /evaluate**

Start an evaluation process.

**Request:**
```bash
{ 
    "job_title": "Product Engineer (Backend)", 
    "cv_id": "12345", 
    "report_id": "67890" 
}
```

**Response (initial):**
```bash
{ 
    "id": "1698761234567", 
    "status": "processing" 
}
```

### **GET /result/**

Retrieve the evaluation result once it’s done.

**Example response:**
```bash
{ 
    "status": "completed", 
    "result": { 
        "cv_match_rate": 0.89,
        "cv_feedback": "The candidate demonstrates a good foundation in backend development...", 
        "project_score": 4.5, 
        "project_feedback": "The project follows the required structure and demonstrates understanding of API design...", 
        "overall_summary": "Overall, the candidate shows strong potential and a solid understanding of backend principles..." 
    }, 
    "context_used": "Backend Engineer job and case study brief context (simulated)..." 
}
```

## ⚒️ How It Works

- Candidate files are uploaded to `/uploads`
- Reference documents (in `/refs`) are read and stored in **ChromaDB**
- When `/evaluate` is called, the system retrieves relevant context from the database
- AI evaluation is simulated scores and feedback are generated dynamically
- The result is stored in memory and accessible via `/result/:id`

Even though this version runs offline, the architecture mimics a production-ready pipeline that integrates RAG and LLM evaluation logic.

## 📁 Folder Structure

rakamin-cv-evaluator-project/  
├── .chromadb/  
├── jobs/  
├── node_modules/  
├── refs/  
│   ├── case_study_brief.txt/  
│   ├── job_description.txt/  
├── uploads/  
├── .env  
├── .gitignore  
├── app.js  
├── ingest.js  
├── package.json  
├── package-lock.json  
└── README.md  

## ✅ Requirements Check

| Requirement                                    | Status | Notes                                |
| ---------------------------------------------- | ------ | ------------------------------------ |
| Use any backend framework                       | ✅     | Node.js + Express                     |
| Use a proper LLM or RAG concept                | ✅     | Simulated RAG with ChromaDB           |
| Include a vector DB or RAG as a service       | ✅     | ChromaDB (local instance)             |
| Provide README with instructions and design explanation | ✅ | This file                           |
| Include reference documents and ingestion scripts | ✅  | refs/ + ingest.js                     |


## 📝 Notes

- This project runs in simulation mode for reproducibility without external API overhead.
- The LLM logic can be easily reactivated by connecting the evaluation process to a real-world API (e.g., OpenAI, Gemini, or Anthropic).

## ⭐ Possible Improvements
- Connect to OpenAI or another LLM provider for real scoring
- Store results persistently using MongoDB or PostgreSQL
- Add authentication for admin/recruiter dashboard
- Create a simple frontend for visualizing evaluation results


## Authors

Naufal Choirul Ananda
- [@naufalchoirulaananda](https://github.com/naufalchoirulaananda)



