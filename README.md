# 🤖 Zylo-AI

Zylo-AI is an AI-powered search wrapper that filters real, human conversations from platforms like Reddit, Quora, Twitter, Hacker News, and Lemmy. It strips away SEO-driven junk and distills genuine insights using OpenAI GPT.

## 🔍 What Makes It Different?

- Fetches real-time discussions (scraping + API)
- Summarizes and organizes content using GPT-3.5 Turbo
- Preserves original voices and thread structures
- Ideal for unfiltered opinions, not ads or blog spam

## 🛠️ Tech Stack

- Frontend: React
- Backend: Django REST Framework
- AI: OpenAI GPT-3.5 Turbo
- Data Sources: Reddit, Quora, Twitter, Hacker News (via scraping + APIs)

## 🚀 Getting Started

### Prerequisites

- Node.js + npm
- Python 3.8+
- Django 4.x
- OpenAI API key
- API keys (Reddit, Twitter etc. where needed)

### Backend Setup

```bash
git clone https://github.com/0xarun/Zylo-AI.git
cd zylo-ai/backend
pip install -r requirements.txt
python manage.py runserver
```

### Frontend Setup

```bash
cd ../frontend
npm install
npm start
```

### .env Configuration

Create .env files in both /backend and /frontend:

Backend:
```ini
OPENAI_API_KEY=your_openai_key
```

## 💡 How It Works

1. User enters a query
2. Backend fetches discussions via APIs and scraping
3. GPT summarizes and filters noise
4. Frontend renders structured and human-like output

## 📦 Deployment

- Frontend: Vercel or Netlify
- Backend: Render, Railway, or Docker VPS
---

Creator: [@0xarun](https://x.com/0xarun)
