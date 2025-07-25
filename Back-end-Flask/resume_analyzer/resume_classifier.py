import joblib
import warnings
from sklearn.exceptions import InconsistentVersionWarning

warnings.simplefilter("ignore", InconsistentVersionWarning)


# Load the model components from models folder
# These are Trained models, and saved as pickle files
model = joblib.load('resume_analyzer/models/naive_bayes_model.pkl')
vectorizer = joblib.load('resume_analyzer/models/tfidf_vectorizer.pkl')
label_encoder = joblib.load('resume_analyzer/models/label_encoder.pkl')

# Function to predict job role based on skills
# Takes a list of skills as input and returns the predicted job role
def predict_job_role(skills):
    print(skills)
    skills_text = ' '.join(skills)
    X_tfidf = vectorizer.transform([skills_text])
    pred = model.predict(X_tfidf)
    role = label_encoder.inverse_transform(pred)[0]
    return role
