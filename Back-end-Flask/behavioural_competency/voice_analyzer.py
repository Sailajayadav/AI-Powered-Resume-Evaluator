import librosa
import numpy as np

# Function to analyze audio features from a given audio file
# Returns a dictionary with pitch, speech rate, and energy variation
def analyze_audio(audio_path):
    y, sr = librosa.load(audio_path)

    # Pitch
    pitches, magnitudes = librosa.piptrack(y=y, sr=sr)
    pitch_vals = pitches[magnitudes > np.median(magnitudes)]
    pitch_mean = np.mean(pitch_vals) if len(pitch_vals) > 0 else 0
    pitch_std = np.std(pitch_vals) if len(pitch_vals) > 0 else 0

    # Speech rate (approximate using ZCR)
    duration = librosa.get_duration(y=y, sr=sr)
    zcr = librosa.feature.zero_crossing_rate(y)
    speech_rate = np.mean(zcr) * sr / 2  # crossings/sec

    # Energy variation
    energy = librosa.feature.rms(y=y)[0]
    energy_var = np.std(energy)

    return {
        "pitch_mean": round(float(pitch_mean), 2),
        "pitch_std": round(float(pitch_std), 2),
        "speech_rate": round(float(speech_rate), 2),
        "energy_var": round(float(energy_var), 4),
        "duration_sec": round(float(duration), 2)
    }

def compute_voice_scores(audio_features):
    def clamp_norm(value, min_val, max_val):
        value = min(max(value, min_val), max_val)
        return (value - min_val) / (max_val - min_val)

    # Normalization ranges
    pitch_std_norm = clamp_norm(audio_features["pitch_std"], 0, 150)
    speech_rate_norm = clamp_norm(audio_features["speech_rate"], 0, 300)
    energy_var_norm = min(audio_features["energy_var"] * 10, 1.0)  # Scale up energy variation

    # Confidence: higher with stable pitch + healthy energy variation
    confidence = round(0.4 * (1 - pitch_std_norm) + 0.6 * energy_var_norm, 3)

    # Nervousness: higher with variable pitch + fast speech
    nervousness = round(0.5 * pitch_std_norm + 0.5 * speech_rate_norm, 3)

    # Clarity: best when speech_rate_norm ~0.5 (targeting mid speech rate)
    clarity = round(1 - abs(speech_rate_norm - 0.5), 3)

    # Ensure scores between 0-1
    confidence = min(max(confidence, 0.0), 1.0)
    nervousness = min(max(nervousness, 0.0), 1.0)
    clarity = min(max(clarity, 0.0), 1.0)

    return {
        "confidence": confidence,
        "nervousness": nervousness,
        "clarity": clarity
    }
