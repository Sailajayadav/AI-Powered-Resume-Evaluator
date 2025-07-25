from deepface import DeepFace

# Function to detect emotions in a list of frames
# Each frame is expected to be an image in the form of a numpy arrayS
# Returns a list of detected emotions for each frame
def detect_emotions(frames):
    emotions = []
    for frame in frames:
        try:
            analysis = DeepFace.analyze(frame, actions=['emotion'], enforce_detection=False)
            emotions.append(analysis[0]['dominant_emotion'])
        except:
            emotions.append('none')
    return emotions
