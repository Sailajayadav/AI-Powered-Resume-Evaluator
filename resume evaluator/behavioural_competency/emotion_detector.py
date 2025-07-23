from deepface import DeepFace

def detect_emotions(frames):
    emotions = []
    for frame in frames:
        try:
            analysis = DeepFace.analyze(frame, actions=['emotion'], enforce_detection=False)
            emotions.append(analysis[0]['dominant_emotion'])
        except:
            emotions.append('none')
    return emotions
