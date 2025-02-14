# Task Forge

Task Forge is a powerful and intuitive task management tool built with **Vite**, utilizing **Firebase** for authentication and database management. It includes **Gemini AI integration** to enhance productivity and task automation.

## 🚀 Features

- **Fast & Lightweight:** Built with **Vite** for an optimized development experience.
- **Firebase Authentication:** Secure login via **Email, Google, GitHub**.
- **Real-time Database:** Firebase Firestore ensures seamless data synchronization.
- **Gemini AI Integration:** Smart task suggestions, summaries, and insights powered by **Google Gemini AI**.
- **Responsive UI:** Modern **Neubrutalism-inspired** design for a bold yet user-friendly experience.
- **Task Management:** Add, edit, and organize tasks efficiently.
- **Progress Tracking:** Monitor task completion and productivity.

## 🛠️ Tech Stack

- **Frontend:** Vite + React
- **Backend:** Firebase (Authentication & Firestore Database)
- **AI Integration:** Google Gemini API

## 📦 Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/arsh342/task_forge.git
   cd task_forge
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
   - Enable Firestore Database and Authentication.
   - Obtain your Firebase config and place it in `.env`:
     ```sh
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     ```

4. Run the development server:
   ```sh
   npm run dev
   ```

## 📜 Usage

- Sign up or log in using Firebase authentication.
- Add new tasks and organize them in categories.
- Use **Gemini AI** to get insights and summaries for your tasks.
- Track progress and manage daily workflows efficiently.

## 🚀 Deployment

Deploy Task Forge using **Vercel, Netlify, or Firebase Hosting**:

```sh
npm run build
```

Then deploy using:

```sh
vercel deploy
```


## 📄 License

This project is open-source and available under the **MIT License**.

---

🔗 **Live Demo:** [Task Forge](https://taskforgeio.vercel.app/)  
📧 **Contact:** arshth134@example.com

