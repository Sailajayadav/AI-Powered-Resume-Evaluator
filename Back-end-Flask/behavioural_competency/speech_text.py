import nltk
from nltk.sentiment import SentimentIntensityAnalyzer
import whisper

# NLTK resources
nltk.download('vader_lexicon')
nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')

# Sentiment analyzer
sia = SentimentIntensityAnalyzer()

# Function to analyze sentiment of a given text
# Returns a dictionary with sentiment scores
def analyze_sentiment(text):
    return sia.polarity_scores(text)

# Function to convert speech to text and analyze sentiment
# Takes the path to an audio file as input and returns sentiment analysis results
def speech_to_text_sentiment_module(audio_path):
    model = whisper.load_model("base")
    result = model.transcribe(audio_path)
    text = result["text"]
    sentiment = analyze_sentiment(text)
    return {
        "sentiment": sentiment,
    }
