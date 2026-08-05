
from flask import Flask, request, jsonify
from flask_cors import CORS
from pathlib import Path
import joblib
import json
import pandas as pd # Needed if your vectorizer or model implicitly uses pandas structures or if your make_prediction function expects Series/DataFrames

app = Flask(__name__)
CORS(app)

# Define the path to the configuration file
CONFIG_FILE = 'config.json'

best_adaptive_threshold = 0.5

try:
    with open(CONFIG_FILE, 'r') as f:
        config = json.load(f)
    best_adaptive_threshold = config.get('best_adaptive_threshold', 0.5) # Get from config, with a fallback
    print(f"Adaptive threshold loaded from {CONFIG_FILE}: {best_adaptive_threshold}")
except FileNotFoundError:
    print(f"Configuration file {CONFIG_FILE} not found. Using default threshold: {best_adaptive_threshold}")
except json.JSONDecodeError:
    print(f"Error decoding {CONFIG_FILE}. Using default threshold: {best_adaptive_threshold}")
except Exception as e:
    print(f"An unexpected error occurred while loading config: {e}. Using default threshold: {best_adaptive_threshold}")


# --- Load the trained model and vectorizer globally --- 
BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR/"model"/"logistic_model.pkl"
VECTORIZER_PATH = BASE_DIR / "model" / "tfidf_vectorizer.pkl"


try:
    model = joblib.load(MODEL_PATH)
    vectorizer = joblib.load(VECTORIZER_PATH)
    print("Model and Vectorizer loaded successfully!")
except Exception as e:
    print(f"Error loading model or vectorizer: {e}")
    model = None
    vectorizer = None

def build_signals(email_text, verdict, probability):
    if model is None or vectorizer is None:
        return []
    
    features = vectorizer.transform([email_text])
    feature_names = vectorizer.get_feature_names_out()
    feature_values = features.toarray()[0]

    top_indices = feature_values.argsort()[::-1][:8]
    top_words = [(feature_names[i], round(float(feature_values[i]), 4))
                for i in top_indices if feature_values[i] > 0]

    phishing_keywords = [
        "click", "verify", "urgent", "account", "suspend", "password", "login",
        "confirm", "bank", "paypal", "apple", "amazon", "secure", "alert",
        "update", "immediately", "free", "win", "prize", "claim", "expire",
        "blocked","cash"
    ]

    signals = []
    for word, score in top_words[:6]:
        is_phishing_word = any(keyword in word.lower() for keyword in phishing_keywords)
        signals.append({
            "label": f'"{word}"',
            "value": f"TF-IDF weight: {score}",
            "type": (
                "danger" if (is_phishing_word and verdict == "Phishing")
                else "warning" if verdict == "Phishing"
                else "safe"
            )
        })


    return signals

def calculate_adaptive_threshold(email_text):
    email_lower = email_text.lower()

    risk_score = 0

    # High-risk indicators
    if "http" in email_lower:
        risk_score += 2

    if "login" in email_lower:
        risk_score += 2

    if "password" in email_lower:
        risk_score += 2

    if "bank" in email_lower:
        risk_score += 2

    # Medium-risk indicators
    if "urgent" in email_lower:
        risk_score += 1

    if "verify" in email_lower:
        risk_score += 1

    if "click" in email_lower:
        risk_score += 1

    if "account" in email_lower:
        risk_score += 1

    if "suspend" in email_lower:
        risk_score += 1

    # Calculating risk level
    if risk_score >= 6:
        risk_level = "High"

    elif risk_score >= 3:
        risk_level = "Medium"

    else:
        risk_level = "Low"   

    return risk_score, risk_level

@app.route('/predict', methods=['POST'])
def predict():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json(silent=True) or {}
    email_text = data.get('email') or data.get('email_text')
    risk_score, risk_level = calculate_adaptive_threshold(email_text)
    threshold = best_adaptive_threshold

    if not isinstance(email_text, str) or not email_text.strip():
        return jsonify({"error": "A non-empty 'email' or 'email_text' field is required"}), 400

    #prediction_label, phishing_probability = make_prediction(email_text, threshold)
    
    if model is None or vectorizer is None:
        return jsonify({"error": "Model files were not loaded correctly"}), 500

    features = vectorizer.transform([email_text])
    prob = float(model.predict_proba(features)[0][1])

    if prob >= 0.69:
        verdict = "Phishing"

    elif prob >= 0.45:
        verdict = "Suspicious"

    else:
        verdict = "Legitimate"

    confidence = round(prob * 100, 2)

    summary = (
        f"This email is classified as {verdict} with {confidence}% confidence "
        f"using a threshold {threshold} , risk_score = {risk_score}."
    )

    response = {
        "email_text": email_text,
        "verdict": verdict,
        "confidence": confidence,
        "threshold": threshold,
        "risk_score":risk_score,
        "risk_level":risk_level,
        "summary": summary,
        "signals": build_signals(email_text, verdict, prob)
    }
    return jsonify(response)

@app.route('/', methods=["GET"])
def home():
    return jsonify({"status": "Phishing Detection API is running"})

if __name__ == '__main__':
    # Run the Flask app
    # In a production environment, you would use a production-ready WSGI server like Gunicorn
    app.run(debug=True, host='0.0.0.0', port=5000)