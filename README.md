# LOLcial 📱

A modern, full-featured social media mobile app built with React Native (Expo), Clerk for authentication, and Convex for the backend. Users can sign up, create and interact with posts, follow others, and receive real-time notifications for social activity.

<div align="center">
  <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
  <img src="https://img.shields.io/badge/Convex-FF6B6B?style=for-the-badge&logo=convex&logoColor=white" alt="Convex" />
  <img src="https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white" alt="Clerk" />
</div>

---

## 🚀 Features

- **🔐 Authentication:** Secure login with Google SSO via Clerk
- **📱 Feed:** Browse a real-time feed of posts with images and captions
- **❤️ Like & Comment:** Like and comment on posts, with instant updates
- **👥 Follow System:** Follow/unfollow users and view follower/following counts
- **🔔 Notifications:** Receive notifications for likes, comments, and follows
- **👤 Profile:** View and edit your profile, including username, bio, and avatar
- **📸 Create Post:** Upload images and captions to share with the community
- **📱 Responsive UI:** Built with Expo and React Native for a smooth mobile experience

---

## 🛠️ Tech Stack

### Frontend

- **React Native** - Cross-platform mobile development
- **Expo** - Development platform and toolchain
- **TypeScript** - Type-safe JavaScript
- **Expo Image Picker** - Native image selection

### Backend

- **[Convex](https://convex.dev/)** - Serverless database & real-time functions
- **Convex Storage** - File storage and management

### Authentication

- **[Clerk](https://clerk.dev/)** - Authentication with Google SSO

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Expo CLI** - Install globally with `npm install -g @expo/cli`
- **Git** for version control
- **Android Studio** (for Android development) or **Xcode** (for iOS development)

### Mobile Development Setup

- **iOS:** Xcode (macOS only)
- **Android:** Android Studio with Android SDK
- **Physical Device:** Install Expo Go app from App Store/Google Play

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Sowdarjya/lolcial.git
cd lolcial
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# Clerk Configuration
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# Convex Configuration
EXPO_PUBLIC_CONVEX_URL=your_convex_deployment_url
```

### 4. Set up Convex

1. Install Convex CLI:

```bash
npm install -g convex
```

2. Initialize Convex in your project:

```bash
npx convex dev
```

3. Deploy your Convex functions:

```bash
npx convex deploy
```

### 5. Set up Clerk

1. Create a Clerk account at [clerk.dev](https://clerk.dev)
2. Create a new application
3. Enable Google OAuth provider
4. Copy your publishable key to the `.env` file

### 6. Start the Development Server

```bash
npx expo start
```

Choose your preferred development method:

- **i** - Open iOS simulator
- **a** - Open Android emulator
- **w** - Open in web browser
- Scan QR code with Expo Go app on your physical device

---

## 🔧 Key Components

### Authentication Flow

- Google SSO integration via Clerk
- Automatic user profile creation
- Secure token management

---

## 🎯 Core Features Implementation

### Feed System

- Real-time post updates using Convex subscriptions
- Infinite scroll pagination
- Image optimization and caching

### Social Interactions

- Real-time like/unlike functionality
- Nested comment system
- Follow/unfollow with instant UI updates

### Notifications

- Push notifications for social interactions
- In-app notification center
- Real-time notification badges

---

## 📦 Scripts

| Command              | Description                   |
| -------------------- | ----------------------------- |
| `npm start`          | Start Expo development server |
| `npm run android`    | Run on Android emulator       |
| `npm run ios`        | Run on iOS simulator          |
| `npm run web`        | Run in web browser            |
| `npm run build`      | Build for production          |
| `npm run lint`       | Run ESLint                    |
| `npm run type-check` | Run TypeScript type checking  |

---

## 🔒 Security & Privacy

- **Authentication:** Secure OAuth flow with Clerk
- **Data Protection:** All API calls are authenticated
- **Image Security:** Secure image upload and storage via Convex
- **Privacy:** User data handling compliant with privacy standards

---

## 🙏 Acknowledgments

- [Expo](https://expo.dev/) for the amazing development platform
- [Convex](https://convex.dev/) for the serverless backend
- [Clerk](https://clerk.dev/) for authentication services
- React Native community for continuous support

<div align="center">
  <p>Made with ❤️ for the social media community</p>
  <p>⭐ Star this repo if you found it helpful!</p>
</div>
