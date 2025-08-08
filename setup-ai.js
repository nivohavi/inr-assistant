// AI Setup Helper Script
// Run this in the browser console to configure your OpenAI API key

function setupOpenAI() {
    const apiKey = prompt('Enter your OpenAI API key (starts with sk-):');
    
    if (!apiKey) {
        alert('No API key entered. Setup cancelled.');
        return;
    }
    
    if (!apiKey.startsWith('sk-')) {
        alert('Invalid API key format. Should start with "sk-"');
        return;
    }
    
    // Show instructions for manual setup
    alert(`✅ API Key Validated!

📝 Next Steps:
1. Open ai-config.js in your editor
2. Replace 'your-openai-api-key-here' with:
   ${apiKey}
3. Save the file
4. Refresh this page

Your API key: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`);
}

function editConfigFile() {
    const apiKey = prompt('Enter your OpenAI API key (starts with sk-):');
    
    if (!apiKey) {
        alert('No API key entered. Setup cancelled.');
        return;
    }
    
    if (!apiKey.startsWith('sk-')) {
        alert('Invalid API key format. Should start with "sk-"');
        return;
    }
    
    // Create a simple config file with just the API key
    const configContent = `// AI Configuration - Add your OpenAI API key here
// Get your API key from: https://platform.openai.com/api-keys

const AI_CONFIG = {
    // 🔑 ADD YOUR OPENAI API KEY HERE
    OPENAI_API_KEY: '${apiKey}',
    
    // 🧠 AI Model Settings
    AI_MODEL: 'gpt-4', // or 'gpt-3.5-turbo' for cheaper option
    MAX_TOKENS: 1000,
    TEMPERATURE: 0.3,
    
    // 🔄 Fallback Settings
    FALLBACK_TO_MOCK: true,
    
    // 💰 Cost Control
    ENABLE_COST_LIMITS: true,
    MAX_COST_PER_ANALYSIS: 0.05,
    
    // 🚀 Performance Settings
    REQUEST_TIMEOUT: 30000,
    RETRY_ATTEMPTS: 2,
    
    // 🔒 Security
    ENABLE_RATE_LIMITING: true,
    MAX_REQUESTS_PER_MINUTE: 10
};

// Validate configuration
function validateAIConfig() {
    if (!AI_CONFIG.OPENAI_API_KEY || AI_CONFIG.OPENAI_API_KEY === 'your-openai-api-key-here') {
        console.warn('⚠️ OpenAI API key not configured. Using mock AI.');
        return false;
    }
    
    if (!AI_CONFIG.OPENAI_API_KEY.startsWith('sk-')) {
        console.error('❌ Invalid OpenAI API key format. Should start with "sk-"');
        return false;
    }
    
    console.log('✅ OpenAI API key configured successfully!');
    return true;
}

// Initialize validation
document.addEventListener('DOMContentLoaded', function() {
    validateAIConfig();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AI_CONFIG;
}`;

    // Create and download the file
    const blob = new Blob([configContent], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai-config.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('✅ ai-config.js file created!\n\nNext steps:\n1. Replace your existing ai-config.js with this file\n2. Refresh the page\n3. Test the AI analysis!');
}

function testAIConnection() {
    if (typeof AI_CONFIG === 'undefined') {
        alert('❌ AI_CONFIG not found. Make sure ai-config.js is loaded.');
        return;
    }
    
    if (!AI_CONFIG.OPENAI_API_KEY || AI_CONFIG.OPENAI_API_KEY === 'your-openai-api-key-here') {
        alert('❌ OpenAI API key not configured.');
        return;
    }
    
    if (!AI_CONFIG.OPENAI_API_KEY.startsWith('sk-')) {
        alert('❌ Invalid API key format.');
        return;
    }
    
    alert('✅ OpenAI API key is configured correctly!\n\nYou can now use the AI analysis features.');
}

// Add setup functions to window for easy access
window.setupOpenAI = setupOpenAI;
window.editConfigFile = editConfigFile;
window.testAIConnection = testAIConnection;

console.log(`
🤖 AI Setup Helper Available!

To configure your OpenAI API key:

Option 1 - Manual Setup (Recommended):
1. Run: setupOpenAI()
2. Follow the instructions to edit ai-config.js manually

Option 2 - Download New File:
1. Run: editConfigFile()
2. Replace your existing ai-config.js with the downloaded file

To test your configuration:
- Run: testAIConnection()

Get your API key from: https://platform.openai.com/api-keys
`); 