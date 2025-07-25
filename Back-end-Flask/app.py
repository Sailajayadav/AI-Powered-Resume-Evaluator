from flask import Flask, request, jsonify
import os
import fitz  # PyMuPDF
from bson.objectid import ObjectId
from pymongo import MongoClient
from flask_cors import CORS
import re
import json

# Importing custom modules for resume and behavioral analysis
from resume_analyzer.resume_classifier import predict_job_role
from resume_analyzer.skill_extractor import extract_skills
from resume_analyzer.JD_similarity import Similarity
from behavioural_competency.video_processor import extract_frames, extract_audio
from behavioural_competency.face_landmark import load_detector, detect_faces
from behavioural_competency.emotion_detector import detect_emotions
from behavioural_competency.voice_analyzer import analyze_audio, compute_voice_scores
from behavioural_competency.scorer import compute_scores
from behavioural_competency.speech_text import speech_to_text_sentiment_module

import google.generativeai as genai

# Initialize Flask app
app = Flask(__name__)
# Enable Cross-Origin Resource Sharing (CORS)
CORS(app)

# Connect to MongoDB database
client = MongoClient("mongodb+srv://amaresh:1234@artgallery.vntex.mongodb.net/?retryWrites=true&w=majority&appName=artgallery")
db = client['job_portal']
resumes_collection = db['resumes'] 

# Configure upload folder for files
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Function to extract text from a PDF file
def extract_text_from_pdf(pdf_path):
    text = ""
    with fitz.open(pdf_path) as doc:
        for page in doc:
            text += page.get_text()
    return text

# Function to preprocess text by removing extra whitespace and non-ASCII characters
def preprocess(text):
    import re
    text = re.sub(r'\s+', ' ', text)  # Replace multiple whitespaces with single space
    text = re.sub(r'[^\x00-\x7F]+', '', text)  # Remove non-ASCII characters
    return text.strip()

# API endpoint for job application submission
@app.route('/api/apply-job', methods=['POST'])
def apply_job():
    results, skills, resume_text, match_score, behavior_score = [], [], "", None, None
    name = request.form.get('name')
    email = request.form.get('email')
    job_id = request.form['job_id']
    file = request.files.get('resume')
    video_file = request.files.get('video')  # Get video file from request

    # Process resume if provided
    if file and file.filename.endswith('.pdf') and job_id:
        # Save resume file to upload folder
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(filepath)

        # Extract and preprocess text from PDF
        raw_text = extract_text_from_pdf(filepath)
        resume_text = preprocess(raw_text)

        # Fetch job description from database
        job = db.jobs.find_one({"_id": ObjectId(job_id)})
        jd_text = job["description"]

        # Extract skills and predict job role from resume
        skills = extract_skills(resume_text)
        predicted_role = predict_job_role(skills)
        # Calculate similarity score between JD and resume
        match_score = Similarity.bert_similarity(jd_text, resume_text)

        # Remove the uploaded resume file
        os.remove(filepath)

    # Process video file if provided
    if video_file and video_file.filename.endswith(('.mp4', '.mov', '.avi')):
        # Save video file to upload folder
        video_path = os.path.join(app.config['UPLOAD_FOLDER'], video_file.filename)
        video_file.save(video_path)

        print("Extracting frames...")
        frames = extract_frames(video_path)

        print("Loading detector...")
        net = load_detector()

        print("Detecting faces...")
        face_boxes_list = detect_faces(frames, net)

        print("Detecting emotions...")
        emotions = detect_emotions(frames)

        print("Extracting audio...")
        audio_path = extract_audio(video_path)

        print("Analyzing audio...")
        audio_features = analyze_audio(audio_path)
        voice_scores = compute_voice_scores(audio_features)

        print("Scoring facial expressions...")
        face_scores = compute_scores(emotions, face_boxes_list)

        print("Textual Analysis...")
        text_analysis = speech_to_text_sentiment_module(audio_path)

        # Aggregate behavioral scores
        behavior_score = {
            "facial": face_scores,
            "voice": {
                "features": audio_features,
                "scores": voice_scores
            },
            "text": text_analysis
        }
        # Remove the uploaded video file
        os.remove(video_path)

    # Prepare document to be inserted into MongoDB
    resume_doc = {
        "candidateName": name,
        "email": email,
        "resume": raw_text,
        "classification": predicted_role,
        "skills": skills,
        "match_score": match_score,
        "job_id": job_id,
        "job_title": job["title"],  # Assuming job object is available from resume processing
        "behavioral_score": behavior_score 
    }
    # Insert the application data into the resumes collection
    result = resumes_collection.insert_one(resume_doc)

    # Return success response
    return jsonify({"message": "Application submitted successfully", "_id": str(result.inserted_id)})

# API endpoint to get all jobs
@app.route('/api/jobs', methods=['GET'])
def get_all_jobs():
    # Retrieve all jobs from the database, selecting specific fields
    jobs = list(db.jobs.find({}, {
        "_id": 1,
        "job_id": 1,
        "title": 1,
        "description": 1,
        "requirements": 1,
        "location": 1,
        "salary": 1,
        "createdAt": 1,
        "updatedAt": 1
    }))
    # Convert ObjectId to string for JSON serialization
    for job in jobs:
        job["_id"] = str(job["_id"])
    return jsonify(jobs)

# API endpoint to get a single job by its ID
@app.route('/api/jobs/<job_id>', methods=['GET'])
def get_job(job_id):
    try:
        # Find job by ObjectId
        job = db.jobs.find_one({"_id": ObjectId(job_id)})
        if not job:
            return jsonify({"error": "Job not found"}), 404
        # Convert ObjectId to string
        job["_id"] = str(job["_id"])
        return jsonify(job)
    except Exception as e:
        print(f"Error fetching job: {e}")
        return jsonify({"error": "Invalid job ID"}), 400

# API endpoint to generate MCQs for a given job ID
@app.route('/jobs/<job_id>/mcqs', methods=['GET'])
def generate_mcqs(job_id):
    job = db.jobs.find_one({"_id": ObjectId(job_id)})
    if not job:
        return jsonify([])

    # Return existing MCQs if they are already generated and saved in the job document
    existing = job.get("assessment", {}).get("mcqs", [])
    if existing:
        return jsonify(existing)

    assessment = job.get("assessment", {})
    mcq_topics = assessment.get("mcqTopics", [])
    num_mcqs = assessment.get("mcqsPerTopic", 2)

    # Configure Google Generative AI with API key
    genai.configure(api_key="AIzaSyDUuHI9NOjq-A__rf325fQE_57NdlpnQ3U")
    model = genai.GenerativeModel("gemini-2.0-flash-001")

    all_questions = []
    for topic in mcq_topics:
        prompt = f"Generate {num_mcqs} multiple choice questions with options and correct answer for the topic: {topic}. return result in JSON format with fields: question, options, answer."
        response = model.generate_content(prompt)
        print(f"Generated questions for topic '{topic}': {response.text.strip()}")
        try:
            # Extract JSON array from the model's response using regex
            match = re.search(r'\[\s*{.*}\s*\]', response.text, re.DOTALL)
            if match:
                questions = json.loads(match.group())
                for q in questions:
                    q['_id'] = str(ObjectId())  # Assign a unique ID to each question
                all_questions.extend(questions)
            else:
                print("No valid JSON array found in Gemini response:", response.text)
        except Exception as e:
            print("Parsing failed:", e)
            continue
    print(all_questions)
    # Save generated MCQs to the job document in the database
    db.jobs.update_one(
        {"_id": ObjectId(job_id)},
        {"$set": {"assessment.mcqs": all_questions}}
    )

    return jsonify(all_questions)

# API endpoint to evaluate MCQs submitted by an applicant
@app.route('/jobs/<job_id>/evaluate-mcqs', methods=['POST'])
def evaluate_mcqs(job_id):
    data = request.get_json()
    applicant_id = data.get('applicantId')
    responses = data.get('responses', [])  # List of applicant's responses [{questionId, selected}]

    job = db.jobs.find_one({"_id": ObjectId(job_id)})
    if not job:
        return jsonify({"error": "Job not found"}), 404

    mcqs = job.get("assessment", {}).get("mcqs", [])

    # Create a lookup dictionary for correct answers from the stored MCQs
    answer_key = {q['_id']: q['answer'] for q in mcqs}

    correct = 0
    total = len(responses)

    # Compare applicant's responses with the correct answers
    for item in responses:
        qid = item.get('questionId')
        selected = item.get('selected')
        if answer_key.get(qid) == selected:
            correct += 1

    # Calculate the score percentage
    score_percent = (correct / total) * 100 if total > 0 else 0

    # Update the applicant's resume document with their MCQ score
    db.resumes.update_one(
        {"_id": ObjectId(applicant_id)},
        {"$set": {"mcq_score": score_percent}}
    )

    return jsonify({"score": round(score_percent, 2)})

# Main entry point for the Flask application
if __name__ == '__main__':
    # Create the upload folder if it doesn't exist
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    # Run the Flask app in debug mode (set to False for production)
    app.run(debug=False)