from fastapi import FastAPI
from pydantic import BaseModel
import yfinance as yf
import pandas as pd
from lightgbm import LGBMRegressor
import feedparser

app = FastAPI(title="TradePro AI Predict Service")


def compute_rsi(close: pd.Series, period: int = 14) -> pd.Series:
    delta = close.diff()
    gain = delta.clip(lower=0)
    loss = -delta.clip(upper=0)

    avg_gain = gain.ewm(alpha=1 / period, min_periods=period, adjust=False).mean()
    avg_loss = loss.ewm(alpha=1 / period, min_periods=period, adjust=False).mean()

    rs = avg_gain / avg_loss.replace(0, pd.NA)
    rsi = 100 - (100 / (1 + rs))
    return rsi.fillna(50.0)


def compute_macd(close: pd.Series) -> pd.Series:
    ema_fast = close.ewm(span=12, adjust=False).mean()
    ema_slow = close.ewm(span=26, adjust=False).mean()
    return ema_fast - ema_slow


def normalize_ticker(symbol: str) -> str:
    raw = symbol.upper().strip()

    crypto_bases = {"BTC", "ETH", "SOL", "XRP"}
    if raw in crypto_bases:
        return f"{raw}-USD"

    if raw.endswith("USDT"):
        base = raw[:-4]
        if base in crypto_bases:
            return f"{base}-USD"

    if raw.endswith("-USD"):
        return raw

    return raw


def normalize_news_symbol(symbol: str) -> str:
    normalized = normalize_ticker(symbol)
    return normalized if normalized.endswith("-USD") else normalized


def infer_sentiment(text: str) -> str:
    value = text.lower()
    positive_words = ["surge", "gain", "beat", "rally", "bull", "growth", "up"]
    negative_words = ["drop", "fall", "miss", "bear", "risk", "down", "selloff"]

    pos = sum(1 for word in positive_words if word in value)
    neg = sum(1 for word in negative_words if word in value)

    if pos > neg:
        return "POSITIVE"
    if neg > pos:
        return "NEGATIVE"
    return "NEUTRAL"


def fetch_rss_news(symbol: str, limit: int = 8):
    clean_symbol = normalize_news_symbol(symbol)
    yahoo_url = f"https://feeds.finance.yahoo.com/rss/2.0/headline?s={clean_symbol}&region=US&lang=en-US"
    sa_url = f"https://seekingalpha.com/api/sa/combined/{clean_symbol}.xml"

    articles = []
    seen_titles = set()

    for source_name, url in [("Yahoo Finance", yahoo_url), ("Seeking Alpha", sa_url)]:
        try:
            feed = feedparser.parse(url)
            for entry in feed.entries[:limit]:
                title = str(getattr(entry, "title", "")).strip()
                if not title or title in seen_titles:
                    continue

                summary = str(
                    getattr(entry, "summary", "") or getattr(entry, "description", "")
                ).strip()
                sentiment = infer_sentiment(f"{title}. {summary}")

                articles.append(
                    {
                        "title": title,
                        "source": source_name,
                        "sentiment": sentiment,
                    }
                )
                seen_titles.add(title)

                if len(articles) >= limit:
                    return articles
        except Exception:
            continue

    return articles

class PredictRequest(BaseModel):
    symbol: str
    horizon: int = 7

@app.post("/predict")
async def predict(req: PredictRequest):
    ticker = normalize_ticker(req.symbol)
    
    df = yf.download(ticker, period="2y", progress=False)
    if df.empty:
        return {"error": "Symbol not found"}

    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.get_level_values(0)

    df = df[['Open', 'High', 'Low', 'Close', 'Volume']].copy()

    df['RSI'] = compute_rsi(df['Close'], period=14)
    df['MACD'] = compute_macd(df['Close'])

    df['Return'] = df['Close'].pct_change()
    df['MA7'] = df['Close'].rolling(7).mean()
    for lag in [1,3,7]:
        df[f'Lag_{lag}'] = df['Close'].shift(lag)
    
    df.dropna(inplace=True)

    df['Target'] = df['Close'].shift(-req.horizon) / df['Close'] - 1
    df.dropna(inplace=True)

    feature_cols = [col for col in df.columns if col not in ['Target','Open','High','Low','Close']]
    X = df[feature_cols]
    y = df['Target']

    model = LGBMRegressor(n_estimators=300, learning_rate=0.05, max_depth=7, random_state=42)
    model.fit(X, y)

    latest = X.iloc[-1:].copy()
    pred_return = model.predict(latest)[0]
    current = float(df['Close'].iloc[-1])
    predicted = current * (1 + pred_return)
    confidence = max(0, min(100, model.score(X[-30:], y[-30:]) * 100))

    rec = "BUY" if pred_return > 0.015 else "SELL" if pred_return < -0.015 else "HOLD"

    return {
        "symbol": req.symbol.upper(),
        "current_price": round(current, 4),
        "predicted_price": round(predicted, 4),
        "predicted_change": round(pred_return * 100, 2),
        "horizon_days": req.horizon,
        "confidence": round(confidence, 1),
        "recommendation": rec
    }

# Current price for all symbols
@app.get("/current-price")
async def current_price(symbol: str):
    ticker = normalize_ticker(symbol)
    try:
        price = yf.Ticker(ticker).history(period="1d")['Close'].iloc[-1]
        return {"symbol": symbol.upper(), "price": round(float(price), 4)}
    except:
        return {"symbol": symbol.upper(), "price": 0}

# History for chart (works for stocks + crypto)
@app.get("/history")
async def get_history(symbol: str):
    ticker = normalize_ticker(symbol)
    try:
        df = yf.download(ticker, period="3mo", progress=False)
        if isinstance(df.columns, pd.MultiIndex):
            df.columns = df.columns.get_level_values(0)
        formatted = df.reset_index().apply(lambda x: {
            "time": int(x['Date'].timestamp()),
            "open": round(float(x['Open']), 4),
            "high": round(float(x['High']), 4),
            "low": round(float(x['Low']), 4),
            "close": round(float(x['Close']), 4)
        }, axis=1).tolist()
        return formatted
    except:
        return []

# News (real titles like Yogesh repo)
@app.get("/news")
async def get_news(symbol: str):
    rss_news = fetch_rss_news(symbol, limit=8)
    if rss_news:
        return rss_news

    try:
        ticker = yf.Ticker(normalize_ticker(symbol))
        news_list = ticker.news[:8]
        result = []
        for item in news_list:
            title = item.get('title')
            if not title:
                continue
            summary = item.get('summary') or item.get('publisher') or ''
            result.append({
                "title": title,
                "source": item.get('publisher', 'Yahoo Finance'),
                "sentiment": infer_sentiment(f"{title}. {summary}")
            })
        if result:
            return result
    except:
        pass

    return [{"title": "Market news loading...", "source": "TradePro", "sentiment": "NEUTRAL"}]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)