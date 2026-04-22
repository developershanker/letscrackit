# LetsCrackIt 🚀

A modern health & wellness mobile application built using React Native.
LetsCrackIt focuses on helping users take control of their health through smart tracking, habit building, and personalized insights.

---

## 📱 Features

* 🔐 User Authentication (Firebase Auth)
* 📊 Health Data Tracking
* 🔥 Real-time Database (Firestore)
* 🎯 Goal & Habit Tracking *(extendable)*
* ⚡ Fast & responsive UI
* 📦 Scalable project structure

---

## 🛠 Tech Stack

* **React Native**
* **Firebase**

  * Authentication
  * Firestore Database
* **JavaScript / TypeScript**
* **React Navigation**

---

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

* Node.js
* React Native CLI
* Android Studio / Xcode

---

### Installation

```bash
# Clone the repo
git clone <your-repo-url>

# Navigate into project
cd LetsCrackIt

# Install dependencies
yarn install
```

---

### ▶️ Running the App

```bash
# Start Metro
npx react-native start

# Run on Android
npx react-native run-android

# Run on iOS
npx react-native run-ios
```

---

## 🔥 Firebase Setup

1. Create a project in Firebase Console
2. Add Android/iOS app
3. Download config files:

   * `google-services.json` → place in `android/app/`
   * `GoogleService-Info.plist` → place in `ios/`
4. Install Firebase packages:

```bash
yarn add @react-native-firebase/app
yarn add @react-native-firebase/auth
yarn add @react-native-firebase/firestore
```

---

## 📁 Project Structure

```
LetsCrackIt/
│
├── src/
│   ├── components/
│   ├── screens/
│   ├── navigation/
│   ├── services/
│   └── utils/
│
├── android/
├── ios/
└── App.js
```

---

## ⚠️ Notes

* This project is currently under development
* Firebase configuration is required before running
* Do not commit sensitive config files

---

## 📌 Future Improvements

* 🧠 AI-based health recommendations
* 📈 Advanced analytics dashboard
* 🍎 Diet & nutrition tracking
* ⌚ Wearable integration

---

## 🤝 Contributing

Contributions are welcome!
Feel free to fork the repo and submit a PR.

---

## 📄 License

This project is licensed under the MIT License.

---

## 💡 Author

Built with focus and intent to create something impactful.
