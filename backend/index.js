const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const dotenv = require("dotenv");

dotenv.config();

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
});

const app = express();

// Frontend URL from environment variable
const frontendURL = process.env.FRONTEND_URL;

app.use(
  cors({
    origin: frontendURL, // Only allow requests from the frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// In-memory storage for user data (simulating a database)
let storedData = [];

// Middleware to verify Firebase ID token
const verifyToken = async (req, res, next) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];
  if (!idToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

// Route to fetch the stored data
app.get("/api/getData", verifyToken, (req, res) => {
  res.json({ data: storedData });
});

// Route to store data
app.post("/api/storeData", verifyToken, (req, res) => {
  const { data } = req.body;
  if (!data) {
    return res.status(400).json({ message: "Data is required" });
  }

  // Store the data in memory
  storedData.push(data);
  res.json({ message: "Data stored successfully", data: storedData });
});

// Protected route example
app.get("/api/protected", verifyToken, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
