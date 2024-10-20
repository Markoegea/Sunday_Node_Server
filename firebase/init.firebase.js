require('dotenv').config()
// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");
const { getFirestore } = require("firebase/firestore");
const { errorHandler } = require("../handler/error.handler");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const {
    FIREBASE_APIKEY,
    FIREBASE_AUTHDOMAIN,
    FIREBASE_PROJECTID,
    FIREBASE_STORAGEBUCKET,
    FIREBASE_MESSAGINGSENDERID,
    FIREBASE_APPID,
    FIREBASE_MEASUREMENTID
} = process.env;

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: FIREBASE_APIKEY,
  authDomain: FIREBASE_AUTHDOMAIN,
  projectId: FIREBASE_PROJECTID,
  storageBucket: FIREBASE_STORAGEBUCKET,
  messagingSenderId: FIREBASE_MESSAGINGSENDERID,
  appId: FIREBASE_APPID,
  measurementId: FIREBASE_MEASUREMENTID
};

class FirebaseClass {
    constructor() {
        if (FirebaseClass.instance) {
            return FirebaseClass.instance; // Return the existing instance
        }

        // Initialize Firebase
        try {
            this._app = initializeApp(firebaseConfig);
            // Get a reference to the storage service, which is used to create references in your storage bucket
            this._storage = getStorage(this._app);
            this._firestore = getFirestore(this._app);
        } catch (error) {
            errorHandler(error, "firebase-initializeFirebaseApp");
        }

        FirebaseClass.instance = this; // Save the instance for future references
        return this;
    }

    get app() {
        return this._app;
    }

    get storage() {
        return this._storage;
    }

    get firestore() {
        return this._firestore;
    }
}

//Export an instance of the FirebaseClass
const firebaseApp = new FirebaseClass();
Object.freeze(firebaseApp);

module.exports = {
    firebaseApp
};