# Deployment Guide - Philosopher Chatbot

## Quick Deployment to Vercel

### Prerequisites
- GitHub account
- Vercel account (free tier works)
- Google Gemini API key

---

## Step 1: Prepare Repository

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit - Philosopher Chatbot"

# Create GitHub repository and push
git remote add origin https://github.com/YOUR_USERNAME/philosopher-chatbot.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy Backend to Vercel

### Option A: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to backend
cd backend

# Deploy
vercel --prod

# Add environment variables
vercel env add GOOGLE_API_KEY
# Paste your API key when prompted

vercel env add MODEL_NAME
# Enter: gemini-1.5-flash

vercel env add TEMPERATURE
# Enter: 0.7

# Redeploy with env vars
vercel --prod
```

### Option B: Via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - **Root Directory**: `backend`
   - **Framework Preset**: Other
   - **Build Command**: (leave empty)
   - **Output Directory**: (leave empty)
5. Add Environment Variables:
   ```
   GOOGLE_API_KEY=your_actual_api_key
   MODEL_NAME=gemini-1.5-flash
   TEMPERATURE=0.7
   ```
6. Click "Deploy"
7. Copy the deployment URL (e.g., `https://your-backend.vercel.app`)

---

## Step 3: Deploy Frontend to Vercel

### Via Vercel Dashboard

1. Click "Add New Project" again
2. Import the same GitHub repository
3. Configure:
   - **Root Directory**: `frontend-web`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variable:
   ```
   VITE_API_BASE_URL=https://your-backend.vercel.app/api/v1/chat
   ```
   (Use the backend URL from Step 2)
5. Click "Deploy"
6. Your chatbot is now live! 🎉

---

## Step 4: Test Deployment

Visit your frontend URL (e.g., `https://your-chatbot.vercel.app`)

### Test Cases:

1. **Authentication**
   - Try: `test@gmail.com` → Should fail
   - Try: `test@petasight.com` → Should succeed

2. **Temperature Gradient**
   - Input: `Paris 25°C`
   - Expected: Orange/red background

3. **Decimal Grayscale**
   - Input: `3.14159`
   - Expected: Grey background

4. **Urgency Analysis**
   - Input: `Help! Emergency!`
   - Expected: Violet background

5. **Normal Chat**
   - Input: `Hello, how are you?`
   - Expected: Yellow background with Arabic + English response

---

## Alternative Deployment Options

### Backend Alternatives

#### Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy
cd backend
railway init
railway up
```

#### Render
1. Go to [render.com](https://render.com)
2. New Web Service
3. Connect GitHub repo
4. Root Directory: `backend`
5. Build Command: `pip install -r requirements.txt`
6. Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

#### AWS Lambda (Advanced)
```bash
# Install Mangum
pip install mangum

# Update main.py
from mangum import Mangum
handler = Mangum(app)

# Deploy with SAM or Serverless Framework
```

---

## Environment Variables Reference

### Backend
| Variable | Description | Example |
|----------|-------------|---------|
| `GOOGLE_API_KEY` | Google Gemini API key | `AIza...` |
| `MODEL_NAME` | Gemini model name | `gemini-1.5-flash` |
| `TEMPERATURE` | LLM temperature | `0.7` |

### Frontend
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API endpoint | `https://api.example.com/api/v1/chat` |

---

## Troubleshooting

### CORS Errors
- Ensure backend CORS allows your frontend domain
- Check `app/main.py` CORS configuration
- Redeploy backend after changes

### API Key Issues
- Verify API key is correct in Vercel dashboard
- Check Google Cloud Console for API quotas
- Ensure Gemini API is enabled

### Build Failures
- Check build logs in Vercel dashboard
- Verify all dependencies are in package.json/requirements.txt
- Ensure Node.js version is 18+ (set in Vercel settings)

### 404 Errors
- Frontend: Check vercel.json rewrites configuration
- Backend: Verify API routes in FastAPI

---

## Post-Deployment Checklist

- [ ] Frontend loads without errors
- [ ] Authentication works with @petasight.com email
- [ ] Temperature gradient colors work
- [ ] Decimal grayscale colors work
- [ ] Urgency analysis colors work
- [ ] Arabic text displays correctly
- [ ] English translation appears
- [ ] Keyboard navigation works (Tab, Enter)
- [ ] Contrast ratios are accessible
- [ ] Mobile responsive design works

---

## Monitoring & Maintenance

### Vercel Analytics
- Enable in Vercel dashboard for free
- Monitor page views and performance

### API Usage
- Monitor Google Gemini API usage in Google Cloud Console
- Set up billing alerts

### Disable After Submission
```bash
# After one week, disable the project
vercel remove your-project-name
```

Or in Vercel dashboard:
1. Project Settings
2. General
3. Delete Project

---

## Support

For issues or questions:
- Check Vercel documentation: https://vercel.com/docs
- FastAPI docs: https://fastapi.tiangolo.com
- LangChain docs: https://python.langchain.com

---

**Estimated Deployment Time**: 15-20 minutes

**Cost**: $0 (using free tiers)
