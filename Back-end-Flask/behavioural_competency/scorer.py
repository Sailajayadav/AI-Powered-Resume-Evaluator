from behavioural_competency.face_landmark import check_eye_contact, check_smile

# Function to compute scores based on detected emotions and landmarks
# Takes a list of detected emotions and landmarks results as input
def compute_scores(emotions, landmarks_results):
    total = len(emotions)
    happy_ratio = emotions.count('happy') / total
    neutral_ratio = emotions.count('neutral') / total
    nervous_ratio = (emotions.count('fear') + emotions.count('sad')) / total

    eye_contact_ratio = sum([check_eye_contact(r) for r in landmarks_results]) / total
    smile_ratio = sum([check_smile(r) for r in landmarks_results]) / total

    return {
        "emotion_distribution": {
            "happy": round(happy_ratio * 100),
            "neutral": round(neutral_ratio * 100),
            "nervous": round(nervous_ratio * 100)
        },
        "confidence": round(0.5 * happy_ratio + 0.5 * eye_contact_ratio, 2),
        "stress": round(nervous_ratio, 2),
        "engagement": round(0.5 * eye_contact_ratio + 0.5 * smile_ratio, 2)
    }
