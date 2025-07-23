import joblib
import warnings
from sklearn.exceptions import InconsistentVersionWarning

warnings.simplefilter("ignore", InconsistentVersionWarning)


# Load the model components from uploads folder
model = joblib.load('resume_analyzer/models/naive_bayes_model.pkl')
vectorizer = joblib.load('resume_analyzer/models/tfidf_vectorizer.pkl')
label_encoder = joblib.load('resume_analyzer/models/label_encoder.pkl')

def predict_job_role(skills):
    print(skills)
    skills_text = ' '.join(skills)
    X_tfidf = vectorizer.transform([skills_text])
    pred = model.predict(X_tfidf)
    role = label_encoder.inverse_transform(pred)[0]
    return role
