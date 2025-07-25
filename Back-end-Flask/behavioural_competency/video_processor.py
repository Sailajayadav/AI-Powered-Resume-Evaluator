import cv2
from moviepy.editor import VideoFileClip

# Function to extract audio from a video file
# Takes the path to the video file and the desired output audio file path
def extract_audio(video_path, audio_path="temp_audio.wav"):
    clip = VideoFileClip(video_path)
    clip.audio.write_audiofile(audio_path, codec='pcm_s16le')
    return audio_path


# Function to extract frames from a video file
# Takes the path to the video file and the desired frame rate
def extract_frames(video_path, frame_rate=2):
    cap = cv2.VideoCapture(video_path)
    frames = []
    fps = cap.get(cv2.CAP_PROP_FPS)
    interval = int(fps / frame_rate) if fps > 0 else 1

    count = 0
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        if count % interval == 0:
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            frames.append(frame_rgb)
        count += 1
    cap.release()
    return frames
