# 🤖 AI Integration Setup Guide

## Current Status: Mock AI
The current system uses simulated AI responses. To use real AI, follow these steps:

## 🚀 Option 1: OpenAI GPT-4 (Recommended)

### Step 1: Get OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign up/Login
3. Click "Create new secret key"
4. Copy the API key

### Step 2: Configure API Key
1. Edit `ai-config.js`
2. Replace `'your-openai-api-key-here'` with your actual API key:
```javascript
const AI_CONFIG = {
    OPENAI_API_KEY: 'sk-your-actual-api-key-here',
    FALLBACK_TO_MOCK: true
};
```

### Step 3: Test
1. Open the app
2. Add a measurement with dietary information
3. Click "ניתוח AI"
4. You should see real AI analysis from GPT-4

## 🧠 Option 2: Anthropic Claude

### Step 1: Get Anthropic API Key
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Create account and get API key

### Step 2: Configure
```javascript
const AI_CONFIG = {
    ANTHROPIC_API_KEY: 'your-claude-api-key-here',
    FALLBACK_TO_MOCK: true
};
```

## 🤖 Option 3: Local AI with Ollama

### Step 1: Install Ollama
```bash
# macOS
brew install ollama

# Or download from https://ollama.ai/
```

### Step 2: Run Local Model
```bash
ollama run llama2
# or
ollama run mistral
```

### Step 3: Configure
```javascript
const AI_CONFIG = {
    USE_LOCAL_AI: true,
    LOCAL_AI_ENDPOINT: 'http://localhost:11434',
    FALLBACK_TO_MOCK: true
};
```

## 🔧 Option 4: Google Gemini

### Step 1: Get Google AI API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create API key

### Step 2: Configure
```javascript
const AI_CONFIG = {
    GOOGLE_AI_API_KEY: 'your-gemini-api-key-here',
    FALLBACK_TO_MOCK: true
};
```

## 📊 What the AI Analyzes

The AI system analyzes:

1. **Vitamin K Content**: Detects foods rich in vitamin K
2. **Dietary Interactions**: Alcohol, grapefruit, etc.
3. **Consistency Patterns**: Changes in diet between days
4. **Risk Assessment**: Potential INR impacts
5. **Dose Recommendations**: Suggested dose adjustments

## 🔒 Security Notes

- **Never commit API keys** to Git
- `ai-config.js` is in `.gitignore`
- Use environment variables in production
- Consider rate limiting for API calls

## 💰 Cost Considerations

- **OpenAI GPT-4**: ~$0.03 per analysis
- **Claude**: ~$0.015 per analysis  
- **Local AI**: Free but requires local setup
- **Mock AI**: Free, always available

## 🧪 Testing

1. **Mock Mode**: Works without API keys
2. **Real AI**: Requires valid API key
3. **Fallback**: Automatically falls back to mock if AI fails

## 🚨 Troubleshooting

### "API key not found"
- Check `ai-config.js` exists
- Verify API key is correct
- Check browser console for errors

### "Rate limit exceeded"
- Wait a few minutes
- Check API usage dashboard
- Consider upgrading plan

### "Network error"
- Check internet connection
- Verify API endpoint is accessible
- Check CORS settings

## 📈 Production Deployment

For GitHub Pages deployment:

1. **Use environment variables** in GitHub Actions
2. **Set up API key** as GitHub secret
3. **Configure CORS** for your domain
4. **Add rate limiting** to prevent abuse

Example GitHub Action:
```yaml
- name: Deploy to GitHub Pages
  env:
    OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
  run: |
    echo "const AI_CONFIG = { OPENAI_API_KEY: '$OPENAI_API_KEY' };" > ai-config.js
``` 