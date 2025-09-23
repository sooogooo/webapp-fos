# FOS - Face Over-filling Syndrome Consultation App

A professional AI-powered medical aesthetic consultation application specializing in the identification, consultation, and repair solutions for "Puffy Face" (Face Over-filling Syndrome).

## 🎯 Project Overview

This application combines modern web technologies with AI artificial intelligence to provide users with:
- Professional "Puffy Face" knowledge and education
- Three different AI consultation personas (Professional Consultant, Technical Expert, Friendly Advisor)
- Online appointment booking services
- Responsive design compatible with all devices

## 🛠️ Technology Stack

- **Frontend Framework**: React 19.1.0 + TypeScript
- **Build Tool**: Vite 6.2.0
- **AI Service**: Google Gemini API
- **Styling**: Tailwind CSS
- **Icons**: Heroicons

## 📁 Project Structure

```
.
├── components/          # React Components
│   ├── ActionButton.tsx # Action Button Component
│   ├── FeatureCard.tsx  # Feature Card Component
│   ├── Footer.tsx       # Footer Component
│   ├── Header.tsx       # Header Component
│   ├── IconComponents.tsx # Icon Components
│   └── Section.tsx      # Section Component
├── App.tsx              # Main Application Component
├── constants.ts         # Configuration Constants
├── index.html           # HTML Entry File
├── index.tsx            # React Entry File
├── package.json         # Project Dependencies
├── tsconfig.json        # TypeScript Configuration
├── vite.config.ts       # Vite Configuration
└── README.md            # Project Documentation
```

## 🚀 Quick Start

### Prerequisites

- Node.js (Recommended version 16+)
- npm or yarn
- Gemini API Key

### Installation Steps

1. **Clone the Project**
   ```bash
   git clone https://github.com/sooogooo/webapp-fos.git
   cd webapp-fos
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit the `.env.local` file and add your Gemini API Key:
   ```
   API_KEY=your_gemini_api_key_here
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Access the Application**
   
   Open your browser and visit `http://localhost:5173`

## 🔧 Available Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 🤖 AI Features

The application integrates three different AI consultation personas:

1. **Professional Consultant** - Provides professional, authoritative medical aesthetic consultation
2. **Technical Expert** - Offers technical and clinical detail explanations
3. **Friendly Advisor** - Provides warm, friendly advice and support

Users can switch between different AI personas in the interface for a personalized consultation experience.

## 📱 Feature Highlights

- ✅ Responsive design supporting mobile and desktop
- ✅ AI intelligent chat consultation
- ✅ Local storage of chat history
- ✅ Professional medical aesthetic knowledge education
- ✅ Online appointment form
- ✅ Enterprise WeChat QR code integration
- ✅ SEO optimization

## 🎨 Design Philosophy

- **Clean & Elegant**: Modern design language focused on user experience
- **Professional & Trustworthy**: Color scheme reflects medical aesthetic industry professionalism
- **Warm & Friendly**: Interface design balances professionalism with approachability

## 🔒 Privacy & Security

- Chat records are stored only in the user's local browser
- API calls use secure HTTPS protocol
- No collection of user personal sensitive information

## 📄 License

This project is for educational and research purposes only.

## 👥 Contributing

Issues and Pull Requests are welcome to improve this project.

## 📞 Contact Information

- **Company**: Chongqing United Lige Technology Co., Ltd.
- **Address**: No. 28 Linjiang Branch Road, Yuzhong District, Chongqing
- **Email**: bccsw@cqlhlg.work
- **Phone**: 023-68726872

---

*This application aims to provide medical aesthetic consultation information and does not constitute specific medical advice. For professional treatment, please consult qualified medical professionals.*