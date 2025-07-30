import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB4cwWaG4FeF39LXV4eCEUUbpUR0adeEOM",
  authDomain: "bolomitra-2134a.firebaseapp.com",
  projectId: "bolomitra-2134a",
  storageBucket: "bolomitra-2134a.appspot.com", // fixed typo
  messagingSenderId: "435910779773",
  appId: "1:435910779773:web:4561036378af6248812214",
  measurementId: "G-GZSTWFV85G"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics }; 