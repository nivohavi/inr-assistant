# 🔒 Security Setup Guide

## 🚨 Important: Protect Your API Keys!

Your API keys should **NEVER** be committed to a public repository. This guide shows you how to set up secure configuration.

## 🏗️ Architecture Overview

```
Public Repository (Safe to commit):
├── config.js.template     ← Template files (safe)
├── ai-config.js.template  ← Template files (safe)
├── .github/workflows/     ← GitHub Actions
└── setup-secure.js        ← Secure config loader

Private/Local (Never commit):
├── config.js             ← Real Firebase keys
└── ai-config.js          ← Real OpenAI keys

Production (GitHub Secrets):
├── FIREBASE_API_KEY      ← Environment variables
├── OPENAI_API_KEY        ← Environment variables
└── Other secrets...      ← All sensitive data
```

## 🔧 Development Setup (Local)

### Step 1: Create Local Config Files
```bash
# Copy templates to real config files
cp config.js.template config.js
cp ai-config.js.template ai-config.js
```

### Step 2: Add Your Real Keys
Edit `config.js`:
```javascript
const firebaseConfig = {
    apiKey: "your-real-firebase-key",
    authDomain: "your-project.firebaseapp.com",
    // ... other Firebase settings
};
```

Edit `ai-config.js`:
```javascript
const AI_CONFIG = {
    OPENAI_API_KEY: "sk-your-real-openai-key",
    // ... other AI settings
};
```

### Step 3: Verify .gitignore
Make sure these files are in `.gitignore`:
```
config.js
ai-config.js
```

## 🚀 Production Setup (GitHub Pages)

### Step 1: Add GitHub Secrets
Go to your repository → Settings → Secrets and variables → Actions

Add these secrets:
```
FIREBASE_API_KEY=your-firebase-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-app-id
FIREBASE_MEASUREMENT_ID=your-measurement-id
OPENAI_API_KEY=sk-your-openai-key
AI_MODEL=gpt-4
MAX_TOKENS=1000
TEMPERATURE=0.3
FALLBACK_TO_MOCK=true
ENABLE_COST_LIMITS=true
MAX_COST_PER_ANALYSIS=0.05
REQUEST_TIMEOUT=30000
RETRY_ATTEMPTS=2
ENABLE_RATE_LIMITING=true
MAX_REQUESTS_PER_MINUTE=10
```

### Step 2: Enable GitHub Pages
1. Go to Settings → Pages
2. Source: "Deploy from a branch"
3. Branch: `gh-pages`
4. Save

### Step 3: Deploy
The GitHub Actions workflow will automatically:
1. Create secure config files from secrets
2. Deploy to GitHub Pages
3. Never expose your keys in the repository

## 🔍 Security Features

### ✅ What's Protected
- **API Keys**: Never in repository
- **Firebase Config**: Environment variables only
- **OpenAI Keys**: GitHub secrets only
- **Local Development**: Template files only

### ✅ What's Safe to Commit
- `config.js.template` - No real keys
- `ai-config.js.template` - No real keys
- `.github/workflows/` - Uses secrets
- `setup-secure.js` - Secure loader

### ✅ Fallback Protection
- Mock AI always available
- Graceful degradation
- Error handling
- Cost limits

## 🧪 Testing Your Setup

### Local Development
```javascript
// In browser console
setupSecureConfig()  // Validate configuration
```

### Production
```javascript
// Check if environment variables loaded
console.log(secureConfig.getFirebaseConfig())
console.log(secureConfig.getAIConfig())
```

## 🚨 Security Checklist

- [ ] `config.js` in `.gitignore`
- [ ] `ai-config.js` in `.gitignore`
- [ ] Template files committed
- [ ] GitHub secrets configured
- [ ] GitHub Actions workflow working
- [ ] No real keys in repository
- [ ] Firebase security rules configured
- [ ] API key restrictions set

## 🔧 Troubleshooting

### "Config files not found"
- Copy template files to real config files
- Add your actual keys to the real files

### "GitHub Actions failing"
- Check all required secrets are set
- Verify secret names match workflow
- Check GitHub Pages is enabled

### "API keys not working"
- Verify keys are correct
- Check API key restrictions
- Test with `setupSecureConfig()`

## 💡 Best Practices

1. **Never commit real keys**
2. **Use environment variables in production**
3. **Set API key restrictions**
4. **Monitor usage and costs**
5. **Regular security audits**
6. **Keep dependencies updated**

## 🔐 Additional Security

### Firebase Security Rules
```javascript
// Set up proper Firestore rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### API Key Restrictions
- Set domain restrictions in OpenAI
- Set IP restrictions if needed
- Monitor usage regularly
- Rotate keys periodically

---

**Your API keys are now secure! 🎉** 