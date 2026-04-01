# Quick Start Guide

Get the Philosopher Chatbot running locally in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- Python 3.11+ installed
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

## 🚀 Quick Setup

### 1. Clone & Install

```bash
# Navigate to project
cd langchain_Practice

# Install backend dependencies
cd backend
pip install -r requirements.txt

# Install frontend dependencies
cd ../frontend-web
npm install
```

### 2. Configure Environment

**Backend** (`backend/.env`):
```bash
GOOGLE_API_KEY=your_actual_api_key_here
MODEL_NAME=gemini-1.5-flash
TEMPERATURE=0.7
```

**Frontend** (`frontend-web/.env`):
```bash
VITE_API_BASE_URL=http://localhost:8000/api/v1/chat
```

### 3. Start Servers

**Terminal 1 - Backend**:
```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 - Frontend**:
```bash
cd frontend-web
npm run dev
```

### 4. Test It Out

1. Open http://localhost:5173
2. Login with: `test@petasight.com`
3. Try these inputs:

```
Paris 25°C          → Orange background
3.14159             → Grey background
Help! Emergency!    → Violet background
Hello, how are you? → Yellow background with Arabic response
```

## 🎯 Quick Test Cases

### Temperature Gradient
```
Input: "Tokyo 15°C"
Expected: Light purple background
```

### Decimal Grayscale
```
Input: "2.50"
Expected: Mid-grey background
```

### Urgency Analysis
```
Input: "I'm worried about this"
Expected: Magenta background
```

### Normal Chat
```
Input: "Tell me about wisdom"
Expected: Yellow background + Arabic + English response
```

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check Python version
python --version  # Should be 3.11+

# Reinstall dependencies
pip install --upgrade -r requirements.txt
```

### Frontend won't start
```bash
# Check Node version
node --version  # Should be 18+

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### CORS errors
- Ensure backend is running on port 8000
- Check `.env` file has correct URL
- Restart both servers

### No LLM response
- Verify Google API key is correct
- Check API key has Gemini API enabled
- Look at backend terminal for errors

## 📚 Next Steps

- Read [README_CHATBOT.md](README_CHATBOT.md) for full documentation
- Check [TESTING_GUIDE.md](TESTING_GUIDE.md) for comprehensive tests
- See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for Vercel deployment

## 🎉 You're Ready!

The chatbot should now be running locally. Enjoy testing!

---

**Need help?** Check the troubleshooting section or review the full documentation.
