// Firebase configuration (to be filled in later)
const firebaseConfig = {
    apiKey: "AIzaSyCp3DToSo3XvEctGKU-7K-plIA--DYOMTw",
    authDomain: "inr-assistant.firebaseapp.com",
    projectId: "inr-assistant",
    storageBucket: "inr-assistant.firebasestorage.app",
    messagingSenderId: "774887287377",
    appId: "1:774887287377:web:5439c34e139ebd4b272670",
    measurementId: "G-MTETS4KKSF"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

// Sign in with Google
function googleSignIn() {
    auth.signInWithPopup(provider)
        .then((result) => {
            const user = result.user;
            console.log("Signed in as:", user.displayName);
            window.location.href = 'index.html'; // Redirect to main app
        }).catch((error) => {
            console.error("Authentication failed:", error);
            alert("שגיאה בהתחברות: " + error.message);
        });
}

// Sign out
function signOut() {
    auth.signOut().then(() => {
        console.log("Signed out");
        window.location.href = 'login.html'; // Redirect to login page
    }).catch((error) => {
        console.error("Sign out error:", error);
    });
}

// Check for auth state changes
function initAuth(callback) {
    auth.onAuthStateChanged((user) => {
        if (user) {
            console.log("User is signed in:", user.displayName);
            if (callback) callback(user);
        } else {
            console.log("User is signed out.");
            // If not on login page, redirect
            if (window.location.pathname !== '/login.html' && !window.location.pathname.endsWith('/login.html')) {
                 window.location.href = 'login.html';
            }
        }
    });
}
