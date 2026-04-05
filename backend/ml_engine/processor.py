import sys
import argparse
import cv2
import json
import os
import urllib.request
import re

try:
    from ultralytics import YOLO
    import easyocr
except ImportError:
    print(json.dumps({"error": "Missing libraries. Please install: pip install ultralytics easyocr opencv-python"}))
    sys.exit(1)

def download_model(model_name):
    """Ensure the base YOLOv8 model is downloaded to the current directory."""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(script_dir, model_name)
    if not os.path.exists(model_path):
        url = f"https://github.com/ultralytics/assets/releases/download/v8.2.0/{model_name}"
        urllib.request.urlretrieve(url, model_path)
    return model_path

def process_media(input_path, output_path):
    # Retrieve base YOLOv8 model (detects cars/trucks)
    model_path = download_model('yolov8n.pt')
    model = YOLO(model_path)
    
    # Initialize EasyOCR Reader (CPU mode to avoid breaking setups without CUDA)
    reader = easyocr.Reader(['en'], gpu=False)

    # Known COCO classes for vehicles
    vehicle_classes = [2, 3, 5, 7] # car, motorcycle, bus, truck

    is_video = input_path.lower().endswith(('.mp4', '.avi', '.mov', '.mkv'))
    detected_plates = []

    if is_video:
        cap = cv2.VideoCapture(input_path)
        if not cap.isOpened():
            print(json.dumps({"error": f"Could not open video {input_path}"}))
            sys.exit(1)
            
        width  = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        fps    = int(cap.get(cv2.CAP_PROP_FPS))
        
        # Use avc1 or h264 for strict HTML5 browser compatibility so the video plays clearly
        fourcc = cv2.VideoWriter_fourcc(*'avc1')
        out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
        
        frame_count = 0
        best_plate = "WAITING"
        best_plate_box = None
        best_plate_valid = False
        vehicle_box = None
        
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
                
            frame_count += 1
            
            # Run detection every 5th frame to speed up processing
            if frame_count % 5 == 0:
                results = model(frame, verbose=False)[0]
                
                for box in results.boxes:
                    cls_id = int(box.cls[0].item())
                    if cls_id in vehicle_classes:
                        x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
                        
                        # Crop the lower 40% of the vehicle where the license plate usually is
                        h_veh = y2 - y1
                        plate_y1 = y1 + int(h_veh * 0.6)
                        plate_crop = frame[plate_y1:y2, x1:x2]
                        
                        if plate_crop.size != 0:
                            ocr_res = reader.readtext(plate_crop, allowlist='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
                            if ocr_res:
                                best_ocr = max(ocr_res, key=lambda x: x[2])
                                text = best_ocr[1]
                                box = best_ocr[0]
                                
                                if len(text) > 4: 
                                    clean_text = re.sub(r'[^A-Z0-9]', '', text.upper())
                                    is_valid = bool(re.match(r'^[A-Z]{2}[0-9]{1,2}[A-Z]{0,3}[0-9]{4}$', clean_text))
                                    
                                    best_plate = clean_text if is_valid else text
                                    best_plate_valid = is_valid
                                    detected_plates.append(best_plate)
                                    pt1 = (int(box[0][0]) + x1, int(box[0][1]) + plate_y1)
                                    pt2 = (int(box[2][0]) + x1, int(box[2][1]) + plate_y1)
                                    best_plate_box = (pt1, pt2)
                        
                        vehicle_box = (x1, y1, x2, y2)

            if vehicle_box:
                cv2.rectangle(frame, (vehicle_box[0], vehicle_box[1]), (vehicle_box[2], vehicle_box[3]), (255, 0, 0), 2)
            
            if best_plate_box and best_plate != "WAITING":
                color = (0, 255, 0) if best_plate_valid else (0, 0, 255) # Green or Red (BGR format)
                cv2.rectangle(frame, best_plate_box[0], best_plate_box[1], color, 5)
                # No text overlay - plate text shown in UI overlay instead

            out.write(frame)
            
        cap.release()
        out.release()
        
    else:
        frame = cv2.imread(input_path)
        if frame is None:
            print(json.dumps({"error": f"Could not read image {input_path}"}))
            sys.exit(1)
            
        results = model(frame, verbose=False)[0]
        best_plate = "UNKNOWN"
        
        for box in results.boxes:
            cls_id = int(box.cls[0].item())
            if cls_id in vehicle_classes:
                x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
                h_veh = y2 - y1
                plate_y1 = y1 + int(h_veh * 0.6)
                plate_crop = frame[plate_y1:y2, x1:x2]
                
                if plate_crop.size != 0:
                    ocr_res = reader.readtext(plate_crop, allowlist='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
                    if ocr_res:
                        best_ocr = max(ocr_res, key=lambda x: x[2])
                        text = best_ocr[1]
                        box = best_ocr[0]
                        if len(text) > 4:
                            clean_text = re.sub(r'[^A-Z0-9]', '', text.upper())
                            is_valid = bool(re.match(r'^[A-Z]{2}[0-9]{1,2}[A-Z]{0,3}[0-9]{4}$', clean_text))
                            
                            best_plate = clean_text if is_valid else text
                            detected_plates.append(best_plate)
                            pt1 = (int(box[0][0]) + x1, int(box[0][1]) + plate_y1)
                            pt2 = (int(box[2][0]) + x1, int(box[2][1]) + plate_y1)
                            
                            color = (0, 255, 0) if is_valid else (0, 0, 255)
                            cv2.rectangle(frame, pt1, pt2, color, 5)
                            # No text overlay - plate text shown in UI overlay instead
                            
                cv2.rectangle(frame, (x1, y1), (x2, y2), (255, 0, 0), 2)
                
        cv2.imwrite(output_path, frame)
        
    # Return JSON to stdout for Node.js
    final_plate = "UNKNOWN"
    is_valid_format = False
    if detected_plates:
        # Get most common plate
        final_plate = max(set(detected_plates), key=detected_plates.count)
        is_valid_format = bool(re.match(r'^[A-Z]{2}[0-9]{1,2}[A-Z]{0,3}[0-9]{4}$', final_plate))
        
    print(json.dumps({
        "plate": final_plate,
        "is_valid": is_valid_format,
        "success": True,
        "type": "video" if is_video else "image"
    }))

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--input', required=True)
    parser.add_argument('--output', required=True)
    args = parser.parse_args()
    
    process_media(args.input, args.output)
