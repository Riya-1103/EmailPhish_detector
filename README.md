## Email Phishing Detector

# Overview
Email phishing detector is an adaptive threshold based web applicaion that analyzes email content to determine whether an email is phishing or legitimate. The application uses a machine learning model trained on email dataset and provides instant predictions through a user-freindly web interface.
The core idea behind this application is adaptive threshold optimization which will alllow user to alter the threshold value based on the trained results.

# Features
- Detects and classify emails as phishing, suspicious or legitimate.
- Simple and responsive React user interface
- Flask rest APIs for prediction
- Machine-learning based email classification
- Real-time prediction without storing data
- No database required

# Tech Stack
- React
- HTML
- CSS
- Javascript

Backend
- Pyhton
- Flask
- Flask-CORS
- Scikit-learn
- Pandas
- Numpy

# Prerequisites
- Pyhton 3.x
- Node.js 

# Installation
Backend setup
```bash
cd backend
pyhton -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python appp.py
```
frontend
```bash
npm install
npm start
```
# Api Endpoint
/predict - Predicts whether an email is phishing or legitimate
