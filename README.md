# AI-Powered Resume Evaluation System

## **Project Overview**
The AI-Powered Resume Evaluation System is designed to help recruiters streamline the hiring process by evaluating resumes and providing actionable insights. It performs:
- **Key Skills Extraction** from resumes.
- **Job Role Classification** based on extracted skills.
- **Job Description & Resume Matching** using semantic similarity.
- **Technical Competency Evaluation** via auto-generated MCQ tests.
- **Behavioral Competency Evaluation** through facial, voice, and sentiment analysis of candidate videos.

This system consists of:
1. **Admin Portal** – A MERN-based job portal for posting job descriptions and managing applicants.  
2. **Resume Evaluator** – A Flask-based backend for analyzing resumes and videos.  
3. **User Portal** – A React-based interface for candidates to submit resumes, videos, and take tests.

---

## **Key Features**
- **AI-driven Resume Parsing** (PDF to structured text).
- **Machine Learning Models** for skill extraction and job role classification.
- **Semantic Resume Matching** with Sentence-BERT embeddings.
- **Automated MCQ Generation & Scoring** using Gemini API.
- **Behavioral Analysis** using DeepFace, OpenCV, and Librosa for facial and voice analysis.
- **Frontend & Backend Integration** for end-to-end recruitment workflows.

---

## **Tech Stack**
- **Frontend (Admin & User Portal):** React.js, Bootstrap.
- **Backend (Admin):** Node.js, Express.js, MongoDB.
- **Resume Evaluator:** Python, Flask, PyMuPDF, Sentence-BERT, DeepFace, Librosa.
- **Other Tools:** Gemini API, Whisper, VADER sentiment analysis.

---

## **Project Structure**
- Resume-Evaluation-System/
- │
- ├── resume_application/ # Admin portal (MERN)
- │ ├── job-portal-admin/ # React frontend
- │ ├── server/ # Node.js backend
- │
- ├── resume_evaluator/ # Python-based backend (Flask)
- │ ├── behavioural_competency/
- │ ├── resume_analyzer/
- │ ├── uploads/
- │ ├── app.py
- │
- ├── user-portal/ # User-facing React app
- │ ├── public/
- │ ├── src/
- │
- └── README.md
  
---

## **Installation & Running Locally**

### **1. Clone the Repository**
```bash
git clone https://github.com/amareshkoneti/Resume-Evaluation-System.git
cd Resume-Evaluation-System
```

### **2. Run Admin Portal (resume_application)**
```
cd resume_application/server
npm install
npm start   # Starts backend on default port (e.g., 5000)

cd ../job-portal-admin
npm install
npm start   # Starts frontend (React)
```

### **3. Run Resume Evaluator (Flask)**
```
cd ../resume_evaluator
python -m venv venv
source venv/bin/activate    # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py               # Runs Flask server (default port 5001)
```

### **4. Run User Portal**
```
cd ../user-portal
npm install
npm start
```
--- 

## **Modules Explained**
### **Key Skills Extraction**
- Uses PyMuPDF for text extraction and an SVM model with TF-IDF to identify skills.

### **Job Role Classification**
- Naive Bayes + TF-IDF classifier trained on skill sets.

### **Resume & JD Matching**
- Sentence-BERT embeddings with cosine similarity.

### **Technical Competency**
- Auto-generated MCQs using Gemini API and score evaluation.

### **Behavioral Competency**
- Facial emotion analysis via DeepFace.

### **Voice clarity & tone using Librosa.**
- Sentiment analysis of transcribed speech with VADE
---
## **Contributors**
- [Amaresh Koneti](https://github.com/amareshkoneti)
- [Veerla Sailaja](https://github.com/Sailajayadav)

