# 🌾 AgroAssist

### *Smart Farming Assistant for Indian Farmers*

[![React Native](https://img.shields.io/badge/React%20Native-0.81.4-61DAFB?logo=react&logoColor=white)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-54.0.10-000020?logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**AgroAssist** is a multilingual mobile application that empowers farmers with AI-driven crop disease detection, real-time weather forecasting, and a voice-enabled agricultural query assistant — all designed to be accessible in regional Indian languages.

---

## 📱 Screenshots

> *Run the app and capture screenshots to add here.*

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔍 **AI Crop Disease Detection** | Photograph your crop and get instant disease diagnosis with treatment recommendations |
| 🤖 **Voice AI Assistant** | Ask farming questions in Hindi, Marathi, English or other regional languages |
| 🌤️ **Weather & Forecasts** | Real-time weather with GPS location, 3-day forecast & intelligent farming advisories |
| 📊 **Smart Dashboard** | Personalized farm overview with seasonal crop recommendations and irrigation status |
| 🌐 **Multilingual Support** | Full app in English, Hindi, Marathi, Tamil, Telugu, Kannada |
| 🎤 **Speech-to-Text & TTS** | Speak your queries and hear answers read aloud in your language |
| 👤 **Farmer Profile** | Personalized profile with village, district, and state details |

---

## 🏗️ Tech Stack

### Frontend (Mobile App)

| Technology | Version | Purpose |
|---|---|---|
| React Native | 0.81.4 | Cross-platform mobile framework |
| Expo | ~54.0.10 | Development platform & build tools |
| Expo Router | ~6.0.8 | File-based navigation |
| TypeScript | ~5.9.2 | Type-safe development |
| i18next + react-i18next | ^25.5.3 | Internationalization |
| Expo AV | ^16.0.7 | Audio recording for voice queries |
| Expo Speech | ^14.0.7 | Text-to-speech for AI responses |
| Expo Location | ~19.0.7 | GPS for weather feature |
| Expo Image Picker | ^17.0.8 | Camera & gallery for disease detection |
| Axios | ^1.12.1 | API communication |

### Backend (API Server)

| Technology | Purpose |
|---|---|
| FastAPI | High-performance REST API framework |
| PostgreSQL | Relational database |
| SQLAlchemy | ORM for database operations |
| JWT (python-jose) | Secure token-based authentication |
| bcrypt (passlib) | Password hashing |
| Pydantic | Input validation |

### External APIs

| Service | Purpose |
|---|---|
| OpenWeatherMap API | Real-time weather data and 3-day forecast |
| Custom ML Model API | Crop disease detection (19+ crop types) |

---

## 📁 Project Structure

```
agroassist/
├── app/                        # Expo Router app directory
│   ├── (tabs)/                 # Bottom tab screens
│   │   ├── index.tsx           # Home / Dashboard
│   │   ├── detection.tsx       # Crop Disease Detection
│   │   ├── query.tsx           # AI Query Assistant
│   │   ├── weather.tsx         # Weather Forecast
│   │   ├── profile.tsx         # Farmer Profile
│   │   └── _layout.tsx         # Tab navigation layout
│   ├── _layout.tsx             # Root layout
│   ├── login.tsx               # Login screen
│   ├── register.tsx            # Registration screen
│   ├── personal-info.tsx       # Onboarding info screen
│   └── language.tsx            # Language selection screen
│
├── components/
│   └── ChatHistory.tsx         # Reusable chat history component
│
├── services/                   # API service layer
│   ├── auth.ts                 # Authentication (login, register, JWT)
│   ├── dashboard.ts            # Dashboard data (weather, tips, crops)
│   ├── query.ts                # AI query, speech-to-text
│   ├── weather.ts              # Weather API integration
│   ├── weatherAdvisory.ts      # Intelligent farming advisories
│   ├── weatherTracking.ts      # Weather search logging
│   └── profile.ts              # User profile management
│
├── constants/
│   └── Colors.ts               # Design system color tokens
│
├── i18n/                       # Internationalization
│   └── (translation files)     # en, hi, mr, ta, te, kn
│
├── utils/
│   └── date.ts                 # Date formatting utilities
│
├── assets/                     # Images, fonts, icons
│
├── backend/                    # FastAPI backend (see backend/README.md)
│   ├── models.py               # SQLAlchemy models
│   ├── profile_routes.py       # Profile API routes
│   ├── database_schema.sql     # PostgreSQL schema
│   └── README.md               # Backend-specific documentation
│
├── .env                        # Environment variables (not committed)
├── app.json                    # Expo app configuration
├── app.config.js               # Dynamic Expo config
├── package.json                # Node.js dependencies
└── tsconfig.json               # TypeScript configuration
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18.x
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/go) app on your Android/iOS device **or** an Android/iOS emulator
- [Python 3.9+](https://www.python.org/) (for the backend)
- [PostgreSQL 13+](https://www.postgresql.org/) (for the backend)

---

### 1. Clone the Repository

```bash
git clone https://github.com/CoderSanket24/agroassist-mobile-app-.git
cd agroassist
```

---

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```env
# Backend API (replace with your server's IP address)
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.100:8000

# OpenWeatherMap (get a free key at https://openweathermap.org/api)
EXPO_PUBLIC_OPENWEATHER_API_KEY=your_openweather_api_key_here
```

> **Note:** Use your local machine's IP address (not `localhost`) so the app can reach the backend from a physical device.

---

### 3. Install Dependencies

```bash
npm install
```

---

### 4. Set Up the Backend

> See [`backend/README.md`](./backend/README.md) for the full backend setup guide.

**Quick setup:**

```bash
# 1. Create PostgreSQL database
psql -U postgres -c "CREATE DATABASE agroassist;"

# 2. Apply schema
psql -U postgres -d agroassist -f backend/database_schema.sql

# 3. Install Python packages
cd backend
pip install -r requirements.txt

# 4. Run the backend server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

---

### 5. Start the Mobile App

```bash
npx expo start
```

Then:
- Press `a` to open in Android emulator
- Press `i` to open in iOS simulator
- Scan the QR code with **Expo Go** on your physical device

---

## 🔍 Crop Disease Detection

The detection screen supports **19+ crop types** with AI-powered disease identification:

| Fruits | Vegetables | Field Crops |
|---|---|---|
| Apple, Banana, Blueberry | Cauliflower, Chilli, Pepper | Corn, Soybean |
| Cherry, Grape, Orange | Potato, Radish | Groundnut |
| Peach, Raspberry | Squash | — |
| Strawberry, Tomato | — | — |

**How it works:**
1. Select a crop (optional — app auto-detects)
2. Take a photo or choose from gallery
3. AI returns disease name, confidence %, treatment, prevention tips & organic solutions
4. Results are displayed in your selected app language

---

## 🌤️ Weather & Farming Advisories

The weather screen uses your **GPS location** to fetch:
- Current temperature, humidity, wind speed & pressure
- **3-day weather forecast**
- **Intelligent farming advisories** based on conditions:
  - Irrigation adjustments for rain
  - Heat stress warnings
  - Wind speed alerts for spraying
  - Humidity-based disease risk warnings

---

## 🤖 AI Query Assistant

Ask any farming-related question using:
- **Text input** — type your question
- **Voice input** — tap the mic button and speak

Answers are:
- **Read aloud** automatically via Text-to-Speech
- Available in your selected language
- Stored as **chat history** for future reference

---

## 🌐 Supported Languages

| Language | Code | Speech Recognition | Text-to-Speech |
|---|---|---|---|
| English (India) | `en` | Yes | Yes |
| Hindi | `hi` | Yes | Yes |
| Marathi | `mr` | Yes | Yes |
| Tamil | `ta` | Yes | — |
| Telugu | `te` | Yes | — |
| Kannada | `kn` | Yes | — |

---

## 🔐 Authentication

AgroAssist uses a **phone number + password** login system tailored for Indian farmers:

- **Register** with name, phone, village, district & state
- **JWT token** stored securely on device via AsyncStorage
- Token expires after **7 days** (configurable in backend)
- Phone number format validation for Indian numbers (10 digits)

---

## 🧩 API Overview

The backend exposes these key endpoints (running at `http://localhost:8000`):

```
POST   /auth/register        — Register new farmer
POST   /auth/login           — Login and receive JWT token
GET    /auth/me              — Get logged-in user profile
PUT    /auth/me              — Update profile

POST   /detect-disease       — Crop disease detection (multipart image)
POST   /query                — Ask AI farming question
GET    /queries              — Fetch query history

POST   /weather/search-log   — Log weather search
```

> Swagger UI available at `http://localhost:8000/docs` when the backend is running.

---

## 🛠️ Development Scripts

```bash
npm start          # Start Expo development server
npm run android    # Launch on Android emulator
npm run ios        # Launch on iOS simulator
npm run web        # Launch in browser (limited features)
npm run lint       # Run ESLint
```

---

## 📦 Building for Production

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for Android (.apk or .aab)
eas build --platform android

# Build for iOS (.ipa)
eas build --platform ios
```

See [EAS Build documentation](https://docs.expo.dev/build/introduction/) for full details.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add: your feature description'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Sanket** — [CoderSanket24](https://github.com/CoderSanket24)

*Built as part of the EDI (Entrepreneurship Development Initiative) project, SY SEM-I.*

---

*Made with love for Indian farmers* 🌾
