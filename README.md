# 💊 INR Assistant - Smart Warfarin Management System

<div align="center">

![Hebrew Interface](https://img.shields.io/badge/Language-Hebrew%20RTL-blue)
![Medical App](https://img.shields.io/badge/Category-Medical%20Assistant-green)
![Single File](https://img.shields.io/badge/Type-Single%20Page%20App-orange)
![No Server](https://img.shields.io/badge/Backend-None%20Required-red)

A comprehensive web application for intelligent Warfarin (Coumadin) therapy management and INR monitoring, built specifically for elderly patients with a focus on simplicity and accuracy.

</div>

## 🎯 Overview

The INR Assistant is a sophisticated yet user-friendly medical management tool that helps patients monitor their Warfarin therapy. Originally developed for an elderly cardiologist managing his own medication, this application combines multiple dosing algorithms with an intuitive Hebrew interface.

### ✨ Key Highlights

- **🔬 Triple Algorithm Engine**: Clinical, IWPC, and ML-enhanced dosing calculations
- **📊 Visual Analytics**: Interactive charts and trend analysis
- **🎨 Draggable Interface**: Fully customizable dashboard layout  
- **💾 Smart Persistence**: Automatic data saving with backup/restore
- **🌍 Hebrew First**: Complete RTL interface with medical terminology
- **⚡ Zero Setup**: Single HTML file - no installation required

## 🚀 Features

### Medical Intelligence
- **Advanced Dosage Calculation**: Three parallel algorithms with weighted averaging
- **Comprehensive Patient Profiling**: 15+ clinical factors including genetics, lifestyle, comorbidities
- **INR Trend Analysis**: Pattern recognition and stability scoring
- **Drug Interaction Monitoring**: Automatic detection of medication conflicts
- **Weekly Dose Planning**: Color-coded schedule with safety indicators

### User Experience
- **Drag & Drop Dashboard**: Reorder all cards and save preferences
- **Smart Input Validation**: Medical-grade input verification with helpful warnings
- **Single Patient Mode**: Streamlined workflow for personal use
- **Auto-Backup System**: Periodic data protection prompts
- **ChatGPT Integration**: One-click data export for second opinions

### Technical Features
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Offline Capable**: Full functionality without internet connection
- **Data Export/Import**: JSON-based backup and restore system
- **Edit History**: Modify past measurements with audit trail
- **Mock Data**: Sample data for testing and demonstration

## 📋 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server or installation required

### Setup
1. **Download**: Save `inr_webapp.html` to your computer
2. **Open**: Double-click the file or open with your web browser
3. **Start**: Enter patient information and begin tracking

```bash
# Clone the repository
git clone https://github.com/yourusername/inr-assistant.git

# Open the application
open inr_webapp.html
# or
firefox inr_webapp.html
```

## 🖥️ Usage Guide

### Initial Setup
1. **Patient Registration**: Enter name, age, weight, and target INR range
2. **Clinical Profile**: Complete smoking, alcohol, diet, and medical history
3. **First Measurement**: Add your initial INR reading and current dose

### Daily Workflow
1. **Add Measurements**: Input new INR values with concurrent medications
2. **Review Recommendations**: Check AI-generated dosing suggestions  
3. **Plan Weekly Doses**: Use the color-coded weekly schedule
4. **Monitor Trends**: Analyze stability and patterns in the chart

### Dashboard Customization
- **Drag Cards**: Hover and drag any card to reorder the dashboard
- **Save Layout**: Your arrangement is automatically saved
- **Reset**: Use the "סידור כרטיים" button to restore defaults

## 🏗️ Technical Architecture

### Core Technologies
```
Frontend:     HTML5, CSS3, Vanilla JavaScript
Styling:      Tailwind CSS Framework
Charts:       Chart.js with custom annotations
Icons:        Lucide Icon Library
Storage:      Browser localStorage API
Responsive:   CSS Grid + Flexbox
```

### Medical Algorithms

#### 1. Clinical Algorithm
- Base calculation using patient demographics
- Age and weight adjustments
- Clinical factor modifiers (smoking, alcohol, diet)
- Organ function considerations

#### 2. IWPC Algorithm  
- International Warfarin Pharmacogenetics Consortium method
- Genetic factor simulation (CYP2C9, VKORC1)
- Population-based coefficients
- Ethnicity and indication adjustments

#### 3. ML-Enhanced Algorithm
- Historical pattern learning
- Non-linear factor interactions
- Stability-based adjustments
- Adaptive learning from measurement history

### Data Structure
```javascript
// Patient Information
{
  name: "יהודה",
  age: 75,
  weight: 80,
  targetMin: 2.0,
  targetMax: 3.0,
  clinicalFactors: {
    smoking: "never",
    alcohol: "social", 
    diet: "consistent-moderate",
    // ... 12 additional factors
  }
}

// INR Measurements
[{
  date: "2024-01-15",
  inr: 2.5,
  dose: 5.0,
  medications: "אנטיביוטיקה",
  symptoms: "חבלה קלה"
}]
```

## 🎨 Dashboard Components

### Status Cards (Draggable)
1. **יציבות INR** - Stability score with circular progress
2. **INR נוכחי** - Current INR value and status  
3. **מינון נוכחי** - Current daily dose
4. **מינון מחר** - Next day recommendation

### Full-Width Components
5. **תוכנית שבועית** - Weekly dose schedule with color coding
6. **ניתוח מגמות** - Interactive INR trend chart
7. **היסטוריית מדידות** - Editable measurement history table

## 🔒 Privacy & Data

### Data Storage
- **Local Only**: All data stored in browser's localStorage
- **No Cloud**: No data transmitted to external servers
- **Exportable**: Full data export in JSON format
- **Secure**: No personal data leaves your device

### Medical Disclaimer
⚠️ **Important**: This application is for educational and tracking purposes only. Always consult with your healthcare provider before making any changes to your medication regimen. The dosing recommendations are algorithmic suggestions and should not replace professional medical advice.

## 📱 Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome  | 90+     | ✅ Full Support |
| Firefox | 88+     | ✅ Full Support |
| Safari  | 14+     | ✅ Full Support |
| Edge    | 90+     | ✅ Full Support |

### Required Features
- ES6 JavaScript support
- CSS Grid and Flexbox
- localStorage API
- Drag and Drop API
- Canvas (for charts)

## 🤝 Contributing

This project was developed for personal use but welcomes contributions:

### Development Setup
```bash
# No build process required - direct HTML editing
# For development with live reload:
npx live-server .
```

### Contribution Areas
- 🌐 **Translations**: Additional language support
- 🏥 **Medical Algorithms**: Enhanced dosing calculations  
- 🎨 **UI/UX**: Design improvements and accessibility
- 📊 **Analytics**: Advanced trend analysis features
- 🔧 **Technical**: Performance optimizations

## 📞 Support

- **Issues**: Report bugs via GitHub Issues
- **Medical Questions**: Consult your healthcare provider
- **Technical Help**: Check browser console for error messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Chart.js** - Beautiful and responsive charts
- **Tailwind CSS** - Utility-first CSS framework  
- **Lucide** - Clean and consistent icons
- **Claude AI** - Development assistance and medical algorithm research
- **Medical Community** - INR management best practices and IWPC guidelines

---

<div align="center">

**Made with ❤️ for better healthcare management**

[🌟 Star this repo](../../stargazers) • [🐛 Report Bug](../../issues) • [💡 Request Feature](../../issues)

</div> 