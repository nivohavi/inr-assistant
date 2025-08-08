#!/bin/bash

echo "🔐 GitHub Secrets Setup Script"
echo "=============================="
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI not found. Please install it first:"
    echo "   brew install gh"
    echo "   gh auth login"
    exit 1
fi

# Check if user is authenticated
if ! gh auth status &> /dev/null; then
    echo "❌ Not authenticated with GitHub. Please run:"
    echo "   gh auth login"
    exit 1
fi

echo "📝 Please provide your configuration values:"
echo ""

# Firebase Configuration
echo "🔥 Firebase Configuration:"
read -p "Firebase API Key: " FIREBASE_API_KEY
read -p "Firebase Auth Domain: " FIREBASE_AUTH_DOMAIN
read -p "Firebase Project ID: " FIREBASE_PROJECT_ID
read -p "Firebase Storage Bucket: " FIREBASE_STORAGE_BUCKET
read -p "Firebase Messaging Sender ID: " FIREBASE_MESSAGING_SENDER_ID
read -p "Firebase App ID: " FIREBASE_APP_ID
read -p "Firebase Measurement ID: " FIREBASE_MEASUREMENT_ID

echo ""
echo "🤖 OpenAI Configuration:"
read -p "OpenAI API Key: " OPENAI_API_KEY

echo ""
echo "⚙️ Optional AI Settings (press Enter for defaults):"
read -p "AI Model (default: gpt-4): " AI_MODEL
read -p "Max Tokens (default: 1000): " MAX_TOKENS
read -p "Temperature (default: 0.3): " TEMPERATURE

# Set defaults if empty
AI_MODEL=${AI_MODEL:-gpt-4}
MAX_TOKENS=${MAX_TOKENS:-1000}
TEMPERATURE=${TEMPERATURE:-0.3}

echo ""
echo "🚀 Setting up GitHub secrets..."

# Firebase Secrets
gh secret set FIREBASE_API_KEY --env dev --repo nivohavi/inr-assistant --body "$FIREBASE_API_KEY"
gh secret set FIREBASE_AUTH_DOMAIN --env dev --repo nivohavi/inr-assistant --body "$FIREBASE_AUTH_DOMAIN"
gh secret set FIREBASE_PROJECT_ID --env dev --repo nivohavi/inr-assistant --body "$FIREBASE_PROJECT_ID"
gh secret set FIREBASE_STORAGE_BUCKET --env dev --repo nivohavi/inr-assistant --body "$FIREBASE_STORAGE_BUCKET"
gh secret set FIREBASE_MESSAGING_SENDER_ID --env dev --repo nivohavi/inr-assistant --body "$FIREBASE_MESSAGING_SENDER_ID"
gh secret set FIREBASE_APP_ID --env dev --repo nivohavi/inr-assistant --body "$FIREBASE_APP_ID"
gh secret set FIREBASE_MEASUREMENT_ID --env dev --repo nivohavi/inr-assistant --body "$FIREBASE_MEASUREMENT_ID"

# OpenAI Secrets
gh secret set OPENAI_API_KEY --env dev --repo nivohavi/inr-assistant --body "$OPENAI_API_KEY"

# Optional AI Settings
gh secret set AI_MODEL --env dev --repo nivohavi/inr-assistant --body "$AI_MODEL"
gh secret set MAX_TOKENS --env dev --repo nivohavi/inr-assistant --body "$MAX_TOKENS"
gh secret set TEMPERATURE --env dev --repo nivohavi/inr-assistant --body "$TEMPERATURE"

echo ""
echo "✅ Secrets configured successfully!"
echo ""
echo "🔄 To trigger deployment, run:"
echo "   git commit --allow-empty -m 'Trigger deployment with secrets'"
echo "   git push origin main"
echo ""
echo "🌐 Check deployment at: https://github.com/nivohavi/inr-assistant/actions"
echo "🧪 Test AI at: https://nivohavi.github.io/inr-assistant/ai-test.html" 