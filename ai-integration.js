// AI Integration with OpenAI GPT-4
// This file handles real AI analysis of dietary data

class AIAnalyzer {
    constructor(apiKey) {
        this.apiKey = apiKey;
        // Handle different API key types
        if (apiKey.startsWith('sk-svcacct-')) {
            // Service account key - might need different endpoint
            this.baseURL = 'https://api.openai.com/v1/chat/completions';
            console.log('🔧 Using service account API key');
        } else if (apiKey.startsWith('sk-')) {
            // Standard OpenAI API key
            this.baseURL = 'https://api.openai.com/v1/chat/completions';
            console.log('🔧 Using standard OpenAI API key');
        } else {
            this.baseURL = 'https://api.openai.com/v1/chat/completions';
            console.log('🔧 Unknown API key format, using default endpoint');
        }
    }

    async analyzeDiet(dietData, patientContext) {
        const prompt = this.buildPrompt(dietData, patientContext);
        const aiConfig = getAIConfig();
        const model = aiConfig.AI_MODEL || 'gpt-4';
        
        console.log('🤖 Making OpenAI API call with:');
        console.log('- Model:', model);
        console.log('- API Key starts with:', this.apiKey.substring(0, 10) + '...');
        console.log('- Max tokens:', aiConfig.MAX_TOKENS || 1000);
        
        try {
            const requestBody = {
                model: model,
                messages: [
                    {
                        role: 'system',
                        content: `You are a medical AI assistant specializing in INR (International Normalized Ratio) management and Coumadin (warfarin) therapy. You analyze dietary patterns and their impact on INR levels. Provide responses in Hebrew. Be precise and medical in your analysis.`
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: aiConfig.MAX_TOKENS || 1000,
                temperature: aiConfig.TEMPERATURE || 0.3
            };
            
            console.log('📤 Request body:', requestBody);
            
            const response = await fetch(this.baseURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ OpenAI API Error Response:', errorText);
                throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            console.log('✅ OpenAI API Response:', data);
            return this.parseAIResponse(data.choices[0].message.content);
        } catch (error) {
            console.error('AI Analysis error:', error);
            throw error;
        }
    }

    buildPrompt(dietData, patientContext) {
        return `
אני מטופל בקומדין עם הנתונים הבאים:

**נתוני מטופל:**
- גיל: ${patientContext.age || 'לא צוין'}
- משקל: ${patientContext.weight || 'לא צוין'} ק"ג
- טווח יעד INR: ${patientContext.targetMin}-${patientContext.targetMax}
- INR נוכחי: ${patientContext.currentINR || 'לא ידוע'}
- מינון נוכחי: ${patientContext.currentDose || 'לא ידוע'} מ"ג

**תזונה היום:**
${dietData.dietToday || 'לא צוין'}

**תזונה מתוכננת למחר:**
${dietData.dietTomorrow || 'לא צוין'}

**מדידות אחרונות:**
${patientContext.recentMeasurements ? patientContext.recentMeasurements.map(m => 
    `- ${m.date}: INR ${m.inr}, מינון ${m.dose} מ"ג`
).join('\n') : 'אין נתונים'}

אנא נתח את השפעת התזונה על ה-INR וספק המלצות. תן תשובה בפורמט JSON:

{
    "vitaminKImpact": {
        "level": "low/medium/high",
        "score": 0-5,
        "description": "תיאור השפעת ויטמין K"
    },
    "dietaryInteractions": [
        {
            "type": "סוג האינטראקציה",
            "severity": "low/medium/high",
            "description": "תיאור האינטראקציה",
            "recommendation": "המלצה"
        }
    ],
    "recommendations": [
        {
            "type": "סוג ההמלצה",
            "description": "תיאור ההמלצה",
            "action": "פעולה מומלצת"
        }
    ],
    "riskAssessment": [
        {
            "level": "low/medium/high",
            "description": "תיאור הסיכון",
            "impact": "השפעה על INR"
        }
    ],
    "doseAdjustment": {
        "adjustment": -1.0 עד 1.0,
        "reason": "סיבת ההתאמה",
        "recommendedDose": "מינון מומלץ"
    }
}
        `;
    }

    parseAIResponse(responseText) {
        try {
            // Extract JSON from response (in case there's extra text)
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No JSON found in response');
            }
            
            const parsed = JSON.parse(jsonMatch[0]);
            return {
                vitaminKImpact: parsed.vitaminKImpact || { level: 'low', score: 0, description: '' },
                dietaryInteractions: parsed.dietaryInteractions || [],
                recommendations: parsed.recommendations || [],
                riskAssessment: parsed.riskAssessment || [],
                doseAdjustment: parsed.doseAdjustment || { adjustment: 0, reason: '', recommendedDose: null }
            };
        } catch (error) {
            console.error('Error parsing AI response:', error);
            // Fallback to mock analysis
            return this.getMockAnalysis();
        }
    }

    getMockAnalysis() {
        return {
            vitaminKImpact: { level: 'low', score: 0, description: 'לא זוהתה השפעה משמעותית' },
            dietaryInteractions: [],
            recommendations: [],
            riskAssessment: [],
            doseAdjustment: { adjustment: 0, reason: '', recommendedDose: null }
        };
    }
}

// Configuration - Uses secure configuration system
function getAIConfig() {
    // Try secure config first
    if (window.secureConfig) {
        return window.secureConfig.getAIConfig();
    }
    // Fallback to direct AI_CONFIG
    return window.AI_CONFIG || {
        OPENAI_API_KEY: 'your-openai-api-key-here',
        FALLBACK_TO_MOCK: true
    };
}

// Initialize AI Analyzer
let aiAnalyzer = null;

function initializeAI() {
    const aiConfig = getAIConfig();
    const apiKey = aiConfig.OPENAI_API_KEY;
    
    if (apiKey && apiKey !== 'your-openai-api-key-here' && apiKey.startsWith('sk-')) {
        aiAnalyzer = new AIAnalyzer(apiKey);
        console.log('🤖 AI Analyzer initialized with OpenAI GPT-4');
        return true;
    } else {
        console.log('🧪 No valid OpenAI API key found, using mock AI');
        console.log('API Key status:', apiKey ? 'Present but invalid' : 'Missing');
        return false;
    }
}

// Enhanced diet analysis function
async function performDietAnalysis(dietToday, dietTomorrow) {
    const targetMin = parseFloat(document.getElementById('targetMin').value) || 2.0;
    const targetMax = parseFloat(document.getElementById('targetMax').value) || 3.0;
    const currentINR = inrData.length > 0 ? inrData[inrData.length - 1].inr : null;
    const currentDose = inrData.length > 0 ? inrData[inrData.length - 1].dose : null;
    
    const context = {
        patientInfo: patientInfo,
        targetRange: { min: targetMin, max: targetMax },
        currentINR: currentINR,
        currentDose: currentDose,
        recentMeasurements: inrData.slice(-3)
    };

    const dietData = {
        dietToday: dietToday,
        dietTomorrow: dietTomorrow
    };

    // Try real AI first, fallback to mock
    if (aiAnalyzer) {
        try {
            return await aiAnalyzer.analyzeDiet(dietData, context);
        } catch (error) {
            console.error('Real AI failed, using mock:', error);
            return await localDietAnalysis(context);
        }
    } else {
        return await localDietAnalysis(context);
    }
}

// Initialize AI when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeAI();
}); 