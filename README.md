# Personal Gemini Journal

Personal Gemini Journal is a secure AI-powered journaling application that enables users to maintain private journal conversations with Gemini while ensuring secure authentication, strict user-level data isolation, automatic summaries, and mood analysis.

## Features

- Google Sign-In using Firebase Authentication
- Secure backend token verification with Firebase Admin SDK
- Multi-turn conversations powered by Gemini
- Automatic journal summaries
- Sentiment and mood analysis
- Real-time Mood Analytics Dashboard
- Secure Firestore storage
- Cloud Run backend deployment
- Secret Manager integration
- Strict per-user data isolation

---

## Architecture

```text
User
 │
 ▼
React + TypeScript
(Firebase Hosting)
 │
 ▼
Firebase Authentication
 │
 ▼
Firebase ID Token
 │
 ▼
Express Backend (Cloud Run)
 │
 ├── Firebase Admin SDK
 ├── Gemini API
 ├── Secret Manager
 └── Cloud Firestore
         │
         ▼
      users/{uid}/journals
```

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Axios
- Firebase SDK

### Backend

- Express.js
- Firebase Admin SDK
- Gemini API

### Google Cloud Services

- Firebase Authentication
- Cloud Firestore
- Cloud Run
- Secret Manager
- Firebase Hosting

---

## Firestore Data Model

```text
users
 └── {uid}
      └── journals
           └── {journalId}
                ├── message
                ├── response
                ├── sentiment
                ├── summary
                └── createdAt
```

---

## Firestore Security Rules

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    match /users/{userId} {

      allow read, write:
        if request.auth != null &&
           request.auth.uid == userId;

      match /journals/{journalId} {

        allow read, write:
          if request.auth != null &&
             request.auth.uid == userId;
      }
    }
  }
}
```

---

## Security Architecture

### Authentication

- Users authenticate using Google Sign-In through Firebase Authentication.
- Firebase issues an ID token after successful login.
- The backend verifies every token using Firebase Admin SDK before processing requests.

### Authorization

- User IDs are derived from verified tokens.
- Client-provided UIDs are never trusted.
- Firestore Security Rules enforce user-level access control.

### Secret Management

- Gemini API keys are stored in Google Cloud Secret Manager.
- Secrets are retrieved at runtime.
- No secrets are exposed in frontend code or source control.

---

## AI Features

### Multi-Turn Conversations

Gemini receives session history to maintain context across interactions and provide more relevant responses.

### Automatic Summaries

After every interaction, Gemini generates a running summary that is stored with the journal session.

### Sentiment Analysis

Each journal entry is analyzed and categorized as:

- Positive
- Neutral
- Negative

### Mood Analytics Dashboard

Users can visualize sentiment trends across journal history and monitor personal growth over time.

---

## Local Development

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
node server.js
```

---

## Deployment

### Deploy Backend to Cloud Run

```bash
gcloud builds submit \
--tag gcr.io/personal-gemini-journal-507718/gemini-journal

gcloud run deploy gemini-journal \
--image gcr.io/personal-gemini-journal-507718/gemini-journal \
--region asia-south1 \
--allow-unauthenticated
```

### Deploy Frontend to Firebase Hosting

```bash
cd frontend
npm run build

cd ..
firebase deploy --only hosting
```

---

## Project URLs

### Frontend

https://personal-gemini-journal-507718.web.app

### Backend

https://gemini-journal-234422397989.asia-south1.run.app

---

## Challenge Requirements Covered

- ✅ Firebase Authentication
- ✅ Cloud Firestore
- ✅ Gemini API Integration
- ✅ Google Cloud Secret Manager
- ✅ Cloud Run Deployment
- ✅ Multi-Turn Conversations
- ✅ Automatic Summarization
- ✅ Sentiment Analysis
- ✅ User-Level Data Isolation
- ✅ Real-Time Mood Analytics

---

## Future Enhancements

- Weekly AI reflection reports
- Journal search and filtering
- Advanced mood analytics
- Journal export to PDF
- Personalized productivity insights

---

## Author

**Harihara Sudhan Palanivel**

Built for the **Accelerate AI with Cloud Run Challenge**.