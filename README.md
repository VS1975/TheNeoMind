# NeoMind OS

An AI-powered Life OS for students & creators — blending note-taking, goal tracking, AI agents, and adaptive planning.

## Tech Stack

- **Frontend:** React + TypeScript + Vite
- **Styling:** TailwindCSS
- **Backend & Auth:** Firebase (Authentication & Firestore)
- **AI Layer:** OpenAI GPT-4 (via `gptUtils.js`)
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- A Firebase account

### Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd TheNeoMind
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Firebase:**
    - Create a new project in the [Firebase Console](https://console.firebase.google.com/).
    - Add a new Web App to your project.
    - Enable **Google** as a Sign-in method in the **Authentication** tab.
    - Create a **Firestore Database** in test mode to start.

4.  **Configure environment variables:**
    - In Firebase, go to **Project Settings** > **General**.
    - Find your SDK setup and configuration, and copy the `firebaseConfig` object.
    - Paste this object into `src/utils/firebase.ts`, replacing the placeholder values.

### Running the Application

To run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
