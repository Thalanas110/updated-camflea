import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { createClient } from "@supabase/supabase-js";


const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const firebaseApiKey = import.meta.env.VITE_FIREBASE_API_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing Supabase environment variables.");
}

const firebaseConfig = {
    apiKey: firebaseApiKey,
    authDomain: "camflea-d7291.firebaseapp.com",
    projectId: "camflea-d7291",
    storageBucket: "camflea-d7291.appspot.com",
    messagingSenderId: "268541757006",
    appId: "1:268541757006:web:78f50992dbd1b61fdae51f",
    measurementId: "G-DMMJYMMKKW"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
console.log("✅ Firebase initialized:", app);

const supabase = createClient(supabaseUrl, supabaseKey);
console.log("✅ Supabase initialized:", supabase);

export { supabase, auth };
