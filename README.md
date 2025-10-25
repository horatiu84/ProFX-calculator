# 📊 ProFX Calculator - Trading Education & Management Platform

![ProFX Logo](public/ProFX_Logo.jpg)

A comprehensive trading education and management platform designed for the ProFX Romania community. This application provides essential tools for forex traders, including lot size calculators, trading journals, educational materials, and performance analytics.

## 🌟 Features

### 📱 Core Trading Tools
- **Lot Size Calculator**: Professional forex lot calculator with multi-currency support
  - Real-time currency pair conversion
  - Risk management calculations
  - Support for 20+ currency pairs (EUR/USD, GBP/USD, XAU/USD, etc.)
  - Customizable account currency and leverage

- **Investment Calculator**: ROI and compound interest calculator
  - Monthly/yearly growth projections
  - Visual charts and graphs
  - Multiple calculation scenarios

- **Trading Journal (Jurnal)**: Complete trade tracking system
  - Add, edit, and delete trades
  - Filter by date range, currency pair, and trade type
  - Performance metrics and statistics
  - Win rate, P&L tracking, and risk/reward analysis
  - Export functionality

### 📈 Analytics & Reports
- **Performance Reports**: Advanced trading analytics
  - Weekly, monthly, and custom period reports
  - Profit/Loss evolution charts
  - Win/Loss distribution analysis
  - Currency pair performance metrics
  - Best/Worst trade tracking
  - Interactive charts with Recharts



### 🎓 Education & Training
- **Educational Materials (Educatie)**:
  - 5 comprehensive PDF lessons
  - Video tutorials (MT5 guides, trailing stop explanation)
  - Mobile trading guides (Android & iPhone)
  - Dictionary and macroeconomic indicators
  - Password-protected access

- **Training Portal**:
  - Beginner and advanced webinar recordings
  - Backtesting sessions archive
  - Macroeconomics courses
  - Weekly market analysis
  - Price Action strategy guides
  - Risk management tutorials

### 🎮 Interactive Learning
- **Training Simulators**:
  - Buy Stop Trainer: Practice placing buy stop orders
  - TP/SL Trainer: Learn proper take profit and stop loss placement
  - Interactive drag-and-drop interface
  - Real-time feedback and validation

- **FlipCard**: Quick reference for trading rules and strategies
  - 5 Golden Rules in Trading
  - Execution Strategy guidelines
  - Animated flip card design

### 📰 Community Features
- **News & Updates (Stiri)**: Meta tags and social sharing optimization
- **Gallery**: Community trading results and testimonials
- **Competition**: Trading contests and leaderboards
- **Contact Forms**: Multiple specialized forms for feedback, registration, and contests

## 🌍 Internationalization

The application supports **Romanian (RO)** and **English (EN)** languages with:
- Seamless language switching
- Smooth transition animations (0.7s fade + scale + blur effects)
- 15+ translated components
- 1000+ translation keys
- Context-based translation system

### Translated Components:
- Calculator (Lot & Investment)
- Trading Journal (Jurnal)
- Reports Modal
- Education (Educatie)
- Training Portal
- ProFXbook
- Home, Menu, Gallery
- Forms (Feedback, Registration, Contest)
- How-To guides
- FlipCard and more

## 🛠️ Technology Stack

### Frontend
- **React 18.3+**: Modern React with Hooks
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Recharts**: Interactive charts and data visualization
- **Lucide React**: Beautiful icon library

### PDF & Document Handling
- **@react-pdf-viewer**: In-app PDF viewing
- **pdfjs-dist**: PDF.js for document rendering

### Backend & Database
- **Firebase**: Backend services
  - Firestore: Real-time database
  - Authentication: User management
  - Hosting: Deployment platform

### Routing & Navigation
- **React Router DOM v6**: Client-side routing

### Forms & Validation
- **React Hook Form**: Efficient form handling
- Custom validation logic

### External Integrations
- **MyFXbook API**: Live trading account data
- **YouTube Embeds**: Video content integration

## 📁 Project Structure

```
profx-lot-calculator/
├── public/                      # Static assets
│   ├── pdfs/                   # Educational PDF materials
│   ├── Rapoarte/               # Monthly trading reports
│   ├── Galerie/                # Gallery images
│   └── Background/             # Background images
│
├── src/
│   ├── components/             # Reusable components
│   │   ├── BuyStopTrainer.jsx
│   │   ├── TpSlTrainer.jsx
│   │   ├── ReportsModal.jsx
│   │   ├── FormularInscriere.jsx
│   │   ├── FormularFeedback.jsx
│   │   ├── FormularConcurs.jsx
│   │   ├── ListaComentarii.jsx
│   │   ├── VipInfoModal.jsx
│   │   └── ui/                 # UI components (Card, Input, Carousel)
│   │
│   ├── contexts/               # React Context providers
│   │   └── LanguageContext.jsx # i18n context
│   │
│   ├── db/                     # Database configuration
│   │   ├── FireBase.js
│   │   └── Dashboard.jsx
│   │
│   ├── translations/           # i18n translation files
│   │   ├── index.js           # Central export
│   │   ├── common.js          # Shared translations
│   │   ├── menu.js
│   │   ├── home.js
│   │   ├── calculator.js
│   │   ├── jurnal.js
│   │   ├── educatie.js
│   │   ├── training.js
│   │   ├── flipcard.js
│   │   └── ...
│   │
│   ├── App.jsx                # Main app component
│   ├── main.jsx               # Entry point
│   ├── index.css              # Global styles
│   │
│   └── [Pages]                # Main page components
│       ├── Calculator.jsx
│       ├── InvestmentCalculator.jsx
│       ├── Jurnal.jsx
│       ├── Raport.jsx
│       ├── ProFXbook.jsx
│       ├── educatie.jsx
│       ├── Training.jsx
│       ├── Home.jsx
│       ├── Galerie.jsx
│       ├── Stiri.jsx
│       ├── Competitie.jsx
│       └── ...
│
├── functions/                  # Firebase Cloud Functions
│   └── index.js
│
├── firebase.json              # Firebase configuration
├── netlify.toml               # Netlify deployment config
├── vite.config.js             # Vite configuration
├── tailwind.config.js         # Tailwind CSS config
├── postcss.config.js          # PostCSS configuration
└── package.json               # Dependencies
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn
- Firebase account (for backend services)
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/horatiu84/ProFX-calculator.git
cd profx-lot-calculator
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Firebase**
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Firestore Database
   - Add your Firebase configuration to `src/db/FireBase.js`

4. **Configure environment variables**
   - Create a `.env` file in the root directory
   - Add necessary API keys and configuration

5. **Start development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Build output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 🔐 Access Control

Certain sections of the application are password-protected:
- **Education Materials**: Requires access password stored in Firestore (`settings/educatieAccess`)
- **Training Portal**: Requires training password stored in Firestore (`settings/trainingAccess`)

Passwords are managed through Firebase Firestore and checked against user input.

## 📊 Firebase Firestore Structure

```
firestore/
├── settings/
│   ├── educatieAccess          # { password: "xxx" }
│   └── trainingAccess          # { password: "xxx" }
│
├── trades/                     # User trading journal entries
│   └── [userId]/
│       └── trades/
│           └── [tradeId]       # { pair, type, lotSize, pips, date, ... }
│
├── comentarii/                 # User comments/feedback
│   └── [comentariiId]          # { nume, email, comentariu, data }
│
├── inscrieri/                  # Course registrations
│   └── [inscriereId]           # { nume, email, telefon, data }
│
└── concurs/                    # Contest entries
    └── [concursId]             # { nume, email, ...contestData }
```

## 🎨 Styling & Design

- **Design System**: Custom color palette with yellow/gold accent colors (#d4af37)
- **Dark Theme**: Default dark mode optimized for traders
- **Responsive Design**: Fully responsive from mobile to desktop
- **Animations**: 
  - Language transition animations (0.7s fade + translateY + scale + blur)
  - Hover effects and micro-interactions
  - Chart animations with Recharts
- **Glassmorphism**: Backdrop blur effects for modern UI

## 📱 Responsive Breakpoints

```css
sm:  640px   /* Mobile landscape */
md:  768px   /* Tablet */
lg:  1024px  /* Desktop */
xl:  1280px  /* Large desktop */
2xl: 1536px  /* Extra large desktop */
```

## 🧪 Testing

The application includes interactive training modules that serve as built-in testing tools:
- Buy Stop placement validation
- TP/SL placement validation
- Real-time feedback on user actions

## 🚀 Deployment

### Netlify (Current)
The application is configured for Netlify deployment with:
- Automatic redirects for SPA routing
- Build optimization
- Environment variable management

Deploy command:
```bash
npm run build
```

### Firebase Hosting
Alternative deployment option configured in `firebase.json`:
```bash
firebase deploy --only hosting
```

## 🔧 Configuration Files

### `vite.config.js`
- React plugin configuration
- Build optimization settings
- Server configuration

### `tailwind.config.js`
- Custom color palette
- Extended theme configuration
- Plugin configuration

### `firebase.json`
- Hosting rules
- Firestore indexes
- Cloud Functions configuration

### `netlify.toml`
- Build commands
- Redirect rules
- Header configuration

## 📝 Key Features Implementation

### Language Switching
The application uses a custom `LanguageContext` provider:
- Centralized translation management
- Persistent language selection (localStorage)
- Smooth transitions with CSS animations
- Key-based re-rendering for instant updates

### Trading Journal
Advanced features:
- Real-time data synchronization with Firestore
- Client-side filtering and sorting
- Inline editing capabilities
- Export to various formats
- Statistics calculation and visualization

### PDF Viewer
Custom PDF viewing experience:
- In-app PDF rendering with React PDF Viewer
- Fullscreen mode
- Download functionality
- Dark theme optimized
- Mobile-responsive

### MyFXbook Integration
Live trading statistics:
- Custom API integration
- Timezone conversion (UTC to Bucharest)
- Caching for performance
- Error handling and fallbacks

## 🤝 Contributing

This is a private project for the ProFX Romania community. For access or collaboration inquiries, please contact the repository owner.

## 📄 License

This project is proprietary and confidential. All rights reserved by ProFX Romania.

## 👥 Authors

- **Horatiu** - [@horatiu84](https://github.com/horatiu84)

## 🙏 Acknowledgments

- ProFX Romania trading community
- All traders who provided feedback and suggestions
- Contributors to the educational materials

## 📞 Support

For support, feedback, or questions:
- Visit the application's Contact page
- Use the in-app feedback form
- Join the ProFX Romania community

## 🔄 Version History

### Current Version (2025)
- ✅ Full bilingual support (RO/EN)
- ✅ Complete trading journal system
- ✅ Advanced analytics and reporting
- ✅ Educational material access system
- ✅ Training portal with 50+ resources
- ✅ Interactive learning modules
- ✅ MyFXbook integration
- ✅ Mobile-optimized design

---

**Built with ❤️ for the ProFX Romania trading community** 🇷🇴

*Trading involves substantial risk and is not suitable for every investor. Past performance is not indicative of future results.*
