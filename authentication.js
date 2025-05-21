import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
    getAuth,
    GoogleAuthProvider,
    GithubAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyBDKWhRUhVDJqUOAbmH_ER_dUkOb3bp4n0",
    authDomain: "tpf-pk-11682.firebaseapp.com",
    projectId: "tpf-pk-11682",
    storageBucket: "tpf-pk-11682.firebasestorage.app",
    messagingSenderId: "878879069175",
    appId: "1:878879069175:web:791ce6eb88b4ff829854f2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// Buttons
const signInWithGoogleBtn = document.querySelector("#signInButton");
const signInWithGitHubBtn = document.querySelector("#signInWithGitHubButton");
const signOutBtn = document.querySelector("#signOutButton");

// Sign in function
const signIn = async (provider, providerName) => {
    const user = auth.currentUser;
    if (user) {
        alert(`Już jesteś zalogowany jako: ${user.displayName || user.email}`);
        return;
    }

    try {
        const result = await signInWithPopup(auth, provider);
        alert(`Zalogowano przez ${providerName} jako: ${result.user.displayName || result.user.email}`);
        console.log(`${providerName} user:`, result.user);
    } catch (error) {
        console.error(`${providerName} sign-in error:`, error.message);
    }
};

// Sign out
const userSignOut = async () => {
    try {
        await signOut(auth);
        alert("Wylogowano!");
    } catch (error) {
        console.error("Sign-out error:", error.message);
    }
};

const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const email = document.getElementById('exampleInputEmail1');

// Auth state change
onAuthStateChanged(auth, (user) => {
    if (user) {
        alert("Jesteś zalogowany " + user.email || user.email);

        if (user.displayName) {
            firstName.value = user.displayName.split(" ")[0] || "";
            lastName.value = user.displayName.split(" ")[1] || "";
        }

        if (user.email) {
            email.value = user.email;
        }

        console.log("Zalogowany użytkownik:", user.displayName || user.email);
    }
});

// Button events
signInWithGoogleBtn.addEventListener("click", () => signIn(googleProvider, "Google"));
signInWithGitHubBtn.addEventListener("click", () => signIn(githubProvider, "GitHub"));
signOutBtn.addEventListener("click", userSignOut);
