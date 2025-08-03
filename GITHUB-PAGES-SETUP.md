# GitHub Pages Deployment Guide

## Two Options for Deploying to GitHub Pages

### Option 1: Simple Deployment (Recommended for Firebase)

Since Firebase web API keys are **designed to be public**, the simplest approach is to just commit your config:

1. **Keep config.js in your repo:**
   ```bash
   git add config.js
   git commit -m "Add Firebase config for GitHub Pages"
   git push
   ```

2. **Enable GitHub Pages:**
   - Go to your repo on GitHub
   - Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: "main" / root
   - Save

3. **Your site will be live at:**
   `https://yourusername.github.io/inr-assistant`

### Option 2: Using GitHub Secrets (More Secure)

If you prefer to keep credentials out of your source code:

1. **Set up GitHub Secrets:**
   - Go to your repo → Settings → Secrets and variables → Actions
   - Add these Repository Secrets:
     - `FIREBASE_API_KEY`: Your Firebase API key
     - `FIREBASE_AUTH_DOMAIN`: Your auth domain (e.g., `your-project.firebaseapp.com`)
     - `FIREBASE_PROJECT_ID`: Your project ID
     - `FIREBASE_STORAGE_BUCKET`: Your storage bucket
     - `FIREBASE_MESSAGING_SENDER_ID`: Your messaging sender ID
     - `FIREBASE_APP_ID`: Your app ID
     - `FIREBASE_MEASUREMENT_ID`: Your measurement ID

2. **Enable GitHub Pages with Actions:**
   - Go to Settings → Pages
   - Source: "GitHub Actions"

3. **The GitHub Action will automatically:**
   - Create `config.js` from your secrets
   - Deploy to GitHub Pages
   - Run on every push to main

## Firebase Security Setup for Public Deployment

Even with a public API key, secure your Firebase:

### 1. API Key Restrictions
In [Google Cloud Console](https://console.cloud.google.com/):
- Go to "APIs & Services" → "Credentials"
- Click your API key
- Application restrictions → "HTTP referrers"
- Add: `https://yourusername.github.io/*`

### 2. Firebase Security Rules
In Firebase Console → Firestore → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /inrData/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 3. Firebase Authentication Settings
- Enable only Google Sign-In
- Add your GitHub Pages domain to authorized domains

## Testing Your Deployment

1. **Local testing:**
   ```bash
   python -m http.server 8000
   # Visit http://localhost:8000
   ```

2. **After deployment:**
   - Visit your GitHub Pages URL
   - Try signing in with Google
   - Verify data saves/loads correctly

## Troubleshooting

- **Config not found**: Make sure `config.js` exists and is included in HTML files
- **Auth fails**: Check authorized domains in Firebase Console
- **API key errors**: Verify restrictions in Google Cloud Console
- **Actions fail**: Check secrets are set correctly in GitHub

## Why Firebase API Keys Are Safe to Expose

Firebase web API keys are **not secret** - they:
- Only identify your project
- Don't authenticate users (that's done by Firebase Auth)
- Are restricted by Firebase Security Rules
- Can be limited by HTTP referrer restrictions

The real security is in your Firebase configuration, not hiding the API key! 