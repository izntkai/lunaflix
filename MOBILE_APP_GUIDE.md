# Lunaflix Mobile App Guide (Capacitor)

This document provides a comprehensive overview of how the Lunaflix Vite + React web application is wrapped into a native mobile app (Android/iOS) using **Capacitor**. 

This single repository serves as the source of truth for both the Web SPA and the Native Mobile apps.

---

## 🏗️ Architecture & Approach

We chose **Capacitor** over React Native. This allows us to keep the existing HTML/CSS (Tailwind v4) and React logic completely intact. Capacitor runs the compiled web assets (`dist/`) inside a high-speed Native WebView while exposing native device hardware capabilities (Haptics, Status Bar, Keyboard) via JS plugins.

### The "Hybrid" UI Strategy
To make the app feel truly "Native" and not just like a website stuffed in a WebView, we implemented conditional rendering based on the platform.

1. **Platform Detection**:
   - `src/hooks/usePlatform.js`: A custom hook utilizing `Capacitor.isNativePlatform()`. This determines if the user is on the web or the mobile app.

2. **Native Navigation (Bottom Tab Bar)**:
   - `src/components/MobileBottomNav.jsx`: A pure native-feel bottom navigation bar.
   - Fixed persistently to the bottom (`z-50`).
   - Uses `backdrop-filter: blur` for a glassmorphic iOS-style look.
   - Animated active states using `framer-motion`.
   - Incorporates `@capacitor/haptics` for physical feedback on tap.

3. **Header Simplification**:
   - `src/components/Navbar.jsx`: On the web, it shows the pill-shaped floating header and hamburger menu. If `isNative` is true, it replaces this with a minimalistic top-edge header (Logo + Profile Icon) matching native iOS/Android conventions.

4. **Layout & Safe Areas**:
   - `src/components/Layout.jsx`: Adjusts screen padding. On mobile, it adds `pb-24` so content scrolls safely behind the Bottom Nav, and reduces top padding since the heavy web Navbar is hidden.

5. **App-Style Search**:
   - `src/pages/Search.jsx`: Redesigned for mobile to act as a full-screen modal. The search bar stretches edge-to-edge under the status bar. Includes a clear (`X`) button and triggers haptic vibrations on selections and clears.

6. **API Proxy Handling (Crucial)**:
   - `src/services/tmdb.js`: Mobile `.apk` builds cannot resolve relative proxy paths (`/.netlify/functions/tmdb-proxy`). 
   - The code dynamically checks `Capacitor.isNativePlatform()`. If true, it uses an **Absolute URL** (`https://lunaflix.netlify.app/.netlify/functions/tmdb-proxy`) to hit the backend.

---

## 🚀 Developer Commands & Workflow

All development and "vibe coding" should be done in **VS Code**. Android Studio (or Xcode) is strictly used as a compiler and device emulator.

### Standard Scripts (in `package.json`)
- `pnpm run build:mobile` : Builds the Vite project and syncs the `dist/` folder into the native `android/` and `ios/` projects.
- `pnpm run open:android` : Opens the Android project in Android Studio (Panda).
- `pnpm run open:ios` : Opens the iOS project in Xcode (Requires macOS).

### ⚡ Live Reload (Vibe Coding Workflow)
To see changes instantly on the Android emulator without rebuilding every time:

1. Find your local IP address (e.g., `192.168.1.3`).
2. Add the server block to `capacitor.config.ts`:
   ```typescript
   server: {
     url: "http://192.168.1.3:5173", // Your computer's local IP + Vite Port
     cleartext: true
   }
   ```
3. Run `npx cap copy android`.
4. Start your Vite server in VS Code: `pnpm run dev:vite --host`.
5. Run the app in Android Studio. Modifying any React file will instantly update the emulator.

> **🛑 CRITICAL BEFORE PRODUCTION:** You **MUST** remove or comment out the `server` block in `capacitor.config.ts` before building a release `.apk` or `.aab`, otherwise the app will look for your local computer on the user's phone and show a white screen!

---

## 📦 Installed Capacitor Plugins
- `@capacitor/core` / `@capacitor/cli`
- `@capacitor/android` / `@capacitor/ios`
- `@capacitor/app`: App state lifecycle.
- `@capacitor/haptics`: Vibration feedback.
- `@capacitor/keyboard`: Safe area management for software keyboards.
- `@capacitor/splash-screen`: Controls the native launch screen.
- `@capacitor/status-bar`: UI control over the system battery/time bar.
- `@capacitor/device` / `@capacitor/network`

## 🛠 Troubleshooting
- **Grey Play Button in Android Studio**: Ensure the Gradle Sync (bottom right) is completely finished, and select `app` in the top configuration dropdown.
- **Movies not loading on mobile**: The `PRODUCTION_PROXY` absolute URL in `src/services/tmdb.js` might be incorrect or the Netlify function is down.
- **Performance Lag in Emulator**: Increase Emulator RAM to 4GB and switch Graphics to "Hardware - GLES 2.0" in Android Studio's Device Manager Advanced Settings. Release builds will perform significantly better than debug emulator builds.