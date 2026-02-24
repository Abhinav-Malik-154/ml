import express from 'express';
import cors from 'cors';
import axios from 'axios';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Prediction from '../models/Prediction';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const ML_URL = 'http://localhost:8000';

// MongoDB connect
mongoose.connect(process.env.MONGO_URI!)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// Predict + save
app.post('/api/predict', async (req, res) => {
  try {
    const { symbol, horizon = 7 } = req.body;
    const mlRes = await axios.post(`${ML_URL}/predict`, { symbol, horizon });
    const data = mlRes.data;

    const newPred = new Prediction({
      symbol: data.symbol,
      currentPrice: data.current_price,
      predictedPrice: data.predicted_price,
      predictedChange: data.predicted_change,
      horizonDays: data.horizon_days,
      confidence: data.confidence,
      recommendation: data.recommendation,
    });
    await newPred.save();

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Service error" });
  }
});

// Saved predictions for History page
app.get('/api/predictions', async (req, res) => {
  try {
    const history = await Prediction.find().sort({ createdAt: -1 }).limit(50);
    res.json(history);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Chart data for all symbols (stocks + crypto)
app.get('/api/chart', async (req, res) => {
  try {
    const { symbol } = req.query;
    const mlRes = await axios.get(`http://localhost:8000/history?symbol=${symbol}`);
    res.json(mlRes.data);
  } catch (e) {
    res.status(500).json([]);
  }
});

// Current price
app.get('/api/current-price', async (req, res) => {
  try {
    const { symbol } = req.query;
    const mlRes = await axios.get(`http://localhost:8000/current-price?symbol=${symbol}`);
    res.json(mlRes.data);
  } catch (e) {
    res.status(500).json({ error: "Price error" });
  }
});

// News
app.get('/api/news', async (req, res) => {
  try {
    const { symbol } = req.query;
    const mlRes = await axios.get(`http://localhost:8000/news?symbol=${symbol}`);
    res.json(mlRes.data);
  } catch (e) {
    res.json([]);
  }
});

app.delete('/api/predictions', async (req, res) => {
  try {
    await Prediction.deleteMany({});
    res.json({ message: 'History cleared' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});