# Setup Guide - INR Assistant

## Firebase Configuration Security Fix

This project has been updated to use a separate configuration file for Firebase settings to address security alerts about exposed API keys.

## Quick Setup

1. **Copy the config template:**
   ```bash
   cp config.js.template config.js
   ```

2. **Get your Firebase configuration:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project (or create a new one)
   - Go to Project Settings (gear icon)
   - Scroll down to "Your apps" section
   - Click on the web app or create one
   - Copy the configuration values

3. **Update config.js with your values:**
   ```javascript
   const firebaseConfig = {
       apiKey: "your-actual-api-key",
       authDomain: "your-project.firebaseapp.com",
       projectId: "your-project-id",
       storageBucket: "your-project.firebasestorage.app",
       messagingSenderId: "123456789012",
       appId: "1:123456789012:web:abcdef123456",
       measurementId: "G-XXXXXXXXXX"
   };
   ```

## Security Note

Firebase API keys for web applications are **meant to be public** - they identify your project, not authenticate users. The real security comes from:

1. **Firebase Security Rules** - Control database access
2. **Firebase Authentication** - Verify user identity  
3. **API Key Restrictions** - Limit where keys can be used

## Additional Security Steps

### 1. Rotate Your API Key (Recommended)
Since the old key was exposed in Git history:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to "APIs & Services" > "Credentials"
4. Find your API key and regenerate it
5. Update your `config.js` with the new key

### 2. Set API Key Restrictions
1. In Google Cloud Console > Credentials
2. Click on your API key
3. Under "Application restrictions", select "HTTP referrers"
4. Add your domains (e.g., `https://yourdomain.com/*`)
5. Under "API restrictions", select "Restrict key"
6. Choose only the APIs you need (Firebase, etc.)

### 3. Configure Firebase Security Rules
Make sure your Firestore rules are properly configured:

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

## File Structure After Setup

```
inr-assistant/
├── config.js              # Your Firebase config (not tracked in git)
├── config.js.template      # Template for new setups
├── login.js               # Updated to use config.js
├── index.html             # Updated to include config.js
├── login.html             # Updated to include config.js
├── admin.html             # Updated to include config.js
└── .gitignore            # Excludes config.js from git
```

## Deployment

When deploying to production:

1. Ensure `config.js` exists on your server
2. The file should contain your production Firebase config
3. Set up proper API key restrictions for your domain
4. Consider using environment variables in server-side deployments 