import express from "express";
import cors from "cors";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check (OBLIGATOIRE pour Railway)
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// Test endpoint simple
app.post("/api/generate-pptx", (req, res) => {
  const apiKey = req.headers["x-api-key"];

  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  return res.status(200).json({ message: "PPTX generation endpoint OK" });
});

// 🚨 PORT RAILWAY (CRITIQUE)
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
