import joblib
import re
import warnings
from sklearn.exceptions import InconsistentVersionWarning

warnings.simplefilter("ignore", InconsistentVersionWarning)


# Load the trained model
pipeline = joblib.load('resume_analyzer/models/skill_detector_pipeline.pkl')


def clean_resume_text(text):
    # Convert to lowercase
    text = text.lower()

    # Remove email addresses and phone numbers
    text = re.sub(r'\S+@\S+', ' ', text)  # Remove emails
    text = re.sub(r'\+?\d[\d\s-]{8,}', ' ', text)  # Remove phone numbers

    # Remove URLs
    text = re.sub(r'http\S+|www\S+|linkedin\S+|github\S+', ' ', text)

    # Keep only alphanumeric characters and spaces
    text = re.sub(r'[^a-z0-9\s]', ' ', text)

    # Collapse multiple spaces into one
    text = re.sub(r'\s+', ' ', text).strip()

    return text

def is_skill(word):
    pred = pipeline.predict([word])[0]
    proba = pipeline.predict_proba([word])[0][1]
    #print(pred,proba)
    return pred == "skill", proba

def extract_skills(resume_text):
    text = clean_resume_text(resume_text)
    words = text.lower().split()
    words = list(set(words))
    extracted_skills = []
    for word in words:
        result, score = is_skill(word)
        #print(f"{word:<12} --> {'Skill' if result else 'Not Skill'} (confidence: {score:.2f})")
        if(result and score > 0.95):
            print(word,score)
            extracted_skills.append(word)
    return extracted_skills
