# Email Phishing Detector

## Overview
Email phishing detector is an adaptive threshold based web applicaion that analyzes email content to determine whether an email is phishing or legitimate. The application uses a machine learning model trained on email dataset and provides instant predictions through a user-freindly web interface.
The core idea behind this application is adaptive threshold optimization which will alllow user to alter the threshold value based on the trained results.

## Features
- Detects and classify emails as phishing, suspicious or legitimate.
- Simple and responsive React user interface
- Flask rest APIs for prediction
- Machine-learning based email classification
- Real-time prediction without storing data
- No database required

## Tech Stack
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

## Prerequisites
- Pyhton 3.x
- Node.js 

## Installation
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
## Api Endpoint
/predict - Predicts whether an email is phishing or legitimate

## How it works
1. The user enters or pastes an email into the application
2. The frontend sends the email text to the Flask backend
3. The backend processes the text and converts it into numerical features using the trained TF-IDF vectorizer.
4. The ML model predicts  whether an email is phishing or suspicious or legitimate based on the confidence score
5. The predicted results is displayed instantly on frontend along with the confidence score adn relevant keywords of the email.
