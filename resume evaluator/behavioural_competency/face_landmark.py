import cv2

def load_detector():
    modelFile = "behavioural_competency/models/res10_300x300_ssd_iter_140000.caffemodel"
    configFile = "behavioural_competency/models/deploy.prototxt"
    net = cv2.dnn.readNetFromCaffe(configFile, modelFile)
    return net

def detect_faces(frames, net, conf_threshold=0.7):
    results = []
    for frame in frames:
        (h, w) = frame.shape[:2]
        blob = cv2.dnn.blobFromImage(cv2.resize(frame, (300, 300)), 1.0,
                                     (300, 300), (104.0, 177.0, 123.0))
        net.setInput(blob)
        detections = net.forward()

        faces = []
        for i in range(0, detections.shape[2]):
            confidence = detections[0, 0, i, 2]
            if confidence > conf_threshold:
                box = detections[0, 0, i, 3:7] * [w, h, w, h]
                faces.append(box.astype("int"))
        results.append(faces)
    return results

def check_eye_contact(face_boxes):
    return 1 if face_boxes else 0

def check_smile(_):
    # Placeholder - we can enhance with mouth region analysis
    return 0
