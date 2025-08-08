# 🚀 Quick AI Setup - Just Add Your OpenAI Key!

## ⚡ Super Simple Setup (3 Steps)

### Step 1: Get Your OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign up/Login
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)

### Step 2: Add Your Key
**Option A: Manual Setup**
1. Edit `ai-config.js`
2. Replace `'your-openai-api-key-here'` with your actual key
3. Save the file

**Option B: Automatic Setup**
1. Open the app in your browser
2. Open browser console (F12)
3. Run: `setupOpenAI()`
4. Enter your API key when prompted
5. Save the downloaded file

### Step 3: Test It!
1. Refresh the page
2. Add dietary information to a measurement
3. Click "ניתוח AI"
4. Get real GPT-4 analysis! 🎉

## 🔧 Configuration Options

In `ai-config.js`, you can adjust:

```javascript
AI_MODEL: 'gpt-4',           // or 'gpt-3.5-turbo' (cheaper)
MAX_TOKENS: 1000,            // Response length
TEMPERATURE: 0.3,            // Creativity level (0-1)
MAX_COST_PER_ANALYSIS: 0.05, // Cost limit per analysis
```

## 💰 Cost Estimate
- **GPT-4**: ~$0.03 per analysis
- **GPT-3.5-turbo**: ~$0.002 per analysis
- **Mock AI**: Free (always available)

## 🧪 Test Your Setup

In browser console:
```javascript
testAIConnection()  // Check if API key is valid
```

## 🔒 Security
- API keys are protected by `.gitignore`
- Never shared in the repository
- Automatic fallback to mock AI if real AI fails

## 🆘 Troubleshooting

**"API key not found"**
- Check `ai-config.js` exists
- Verify key starts with `sk-`

**"Rate limit exceeded"**
- Wait a few minutes
- Check your OpenAI usage

**"Network error"**
- Check internet connection
- Try again in a few minutes

## 🎯 What You Get

With real AI, you'll get:
- **Smart vitamin K analysis**
- **Drug interaction detection**
- **Personalized dose recommendations**
- **Risk assessment**
- **Dietary pattern analysis**

---

**That's it! Just add your API key and you're ready to go! 🚀** 