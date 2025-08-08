// Secure Setup Script for Production Deployment
// This script handles environment variables and GitHub secrets

class SecureConfig {
    constructor() {
        this.config = {};
        this.loadConfig();
    }

    loadConfig() {
        // Try to load from environment variables first (for production)
        if (typeof process !== 'undefined' && process.env) {
            this.loadFromEnv();
        } else {
            // Fallback to local config files (for development)
            this.loadFromLocalFiles();
        }
    }

    loadFromEnv() {
        // Production: Load from environment variables
        this.config.firebase = {
            apiKey: process.env.FIREBASE_API_KEY,
            authDomain: process.env.FIREBASE_AUTH_DOMAIN,
            projectId: process.env.FIREBASE_PROJECT_ID,
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.FIREBASE_APP_ID,
            measurementId: process.env.FIREBASE_MEASUREMENT_ID
        };

        this.config.ai = {
            OPENAI_API_KEY: process.env.OPENAI_API_KEY,
            AI_MODEL: process.env.AI_MODEL || 'gpt-4',
            MAX_TOKENS: parseInt(process.env.MAX_TOKENS) || 1000,
            TEMPERATURE: parseFloat(process.env.TEMPERATURE) || 0.3,
            FALLBACK_TO_MOCK: process.env.FALLBACK_TO_MOCK !== 'false',
            ENABLE_COST_LIMITS: process.env.ENABLE_COST_LIMITS !== 'false',
            MAX_COST_PER_ANALYSIS: parseFloat(process.env.MAX_COST_PER_ANALYSIS) || 0.05,
            REQUEST_TIMEOUT: parseInt(process.env.REQUEST_TIMEOUT) || 30000,
            RETRY_ATTEMPTS: parseInt(process.env.RETRY_ATTEMPTS) || 2,
            ENABLE_RATE_LIMITING: process.env.ENABLE_RATE_LIMITING !== 'false',
            MAX_REQUESTS_PER_MINUTE: parseInt(process.env.MAX_REQUESTS_PER_MINUTE) || 10
        };

        console.log('🔒 Loaded configuration from environment variables');
    }

    loadFromLocalFiles() {
        // Development: Load from local config files
        try {
            // These will be undefined if files don't exist (which is expected in production)
            if (typeof firebaseConfig !== 'undefined') {
                this.config.firebase = firebaseConfig;
            }
            
            if (typeof AI_CONFIG !== 'undefined') {
                this.config.ai = AI_CONFIG;
            }
            
            console.log('🏠 Loaded configuration from local files');
        } catch (error) {
            console.warn('⚠️ No local configuration found, using defaults');
            this.setDefaults();
        }
    }

    setDefaults() {
        this.config.firebase = {
            apiKey: null,
            authDomain: null,
            projectId: null,
            storageBucket: null,
            messagingSenderId: null,
            appId: null,
            measurementId: null
        };

        this.config.ai = {
            OPENAI_API_KEY: null,
            AI_MODEL: 'gpt-4',
            MAX_TOKENS: 1000,
            TEMPERATURE: 0.3,
            FALLBACK_TO_MOCK: true,
            ENABLE_COST_LIMITS: true,
            MAX_COST_PER_ANALYSIS: 0.05,
            REQUEST_TIMEOUT: 30000,
            RETRY_ATTEMPTS: 2,
            ENABLE_RATE_LIMITING: true,
            MAX_REQUESTS_PER_MINUTE: 10
        };
    }

    getFirebaseConfig() {
        return this.config.firebase;
    }

    getAIConfig() {
        return this.config.ai;
    }

    validateConfig() {
        const errors = [];
        const warnings = [];

        // Validate Firebase config
        if (!this.config.firebase.apiKey) {
            errors.push('Firebase API key not configured');
        }

        // Validate AI config
        if (!this.config.ai.OPENAI_API_KEY) {
            warnings.push('OpenAI API key not configured - using mock AI');
        } else if (!this.config.ai.OPENAI_API_KEY.startsWith('sk-')) {
            errors.push('Invalid OpenAI API key format');
        }

        return { errors, warnings };
    }
}

// Initialize secure configuration
const secureConfig = new SecureConfig();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = secureConfig;
}

// Make available globally
window.secureConfig = secureConfig;

// Setup helper functions
window.setupSecureConfig = function() {
    const validation = secureConfig.validateConfig();
    
    if (validation.errors.length > 0) {
        console.error('❌ Configuration errors:', validation.errors);
        alert('Configuration errors found. Check console for details.');
        return false;
    }
    
    if (validation.warnings.length > 0) {
        console.warn('⚠️ Configuration warnings:', validation.warnings);
    }
    
    console.log('✅ Configuration validated successfully');
    return true;
};

console.log(`
🔒 Secure Configuration System Loaded!

Available functions:
- setupSecureConfig() - Validate configuration
- secureConfig.getFirebaseConfig() - Get Firebase config
- secureConfig.getAIConfig() - Get AI config

For production deployment, set these environment variables:
- FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN, etc.
- OPENAI_API_KEY, AI_MODEL, etc.
`); 