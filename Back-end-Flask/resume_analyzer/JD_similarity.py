import nltk
from sentence_transformers import SentenceTransformer, util
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
nltk.download('punkt_tab')
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')

# Initialize tools
stop_words = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()

# Function to preprocess text
# Tokenizes, removes stopwords, and lemmatizes the text
def preprocess_text(text):
    tokens = word_tokenize(text.lower())  # Convert to lowercase & tokenize
    tokens = [lemmatizer.lemmatize(word) for word in tokens if word not in stop_words and word.isalnum()]  # Remove stopwords & lemmatize
    return " ".join(tokens)

# Load the model
# This model is used for calculating semantic similarity between job descriptions and resumes
model = SentenceTransformer('all-MiniLM-L6-v2')


class Similarity:
    
    # Function to calculate semantic similarity between job description and resume text
    # Returns a similarity score as a percentage
    def bert_similarity(JD, resume_text):
        # Preprocess text
        JD = preprocess_text(JD)
        resume_text = preprocess_text(resume_text)

        # SBERT similarity
        emb1 = model.encode(JD, convert_to_tensor=True)
        emb2 = model.encode(resume_text, convert_to_tensor=True)
        similarity = util.pytorch_cos_sim(emb1, emb2).item() * 100  # Convert to percentage
        return similarity