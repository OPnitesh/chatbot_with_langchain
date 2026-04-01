# Full-Stack AI Philosopher Chatbot

A sophisticated chatbot that responds in RTL languages (Arabic/Hebrew/Farsi/Urdu) with the persona of historical philosophers, featuring dynamic background colors based on user input patterns.

## 🎯 Requirements Implementation

### ✅ Core Chatbot Logic

1. **Temperature Gradient Mapping**
   - Detects city + temperature in Celsius
   - Color spectrum: Deep Blue (≤0°C) → Light Purple (15°C) → Bright Red (≥35°C)
   - Examples: "Paris 25°C", "Tokyo is 10°C", "New York: -5"

2. **Decimal Grayscale**
   - Parses standalone decimal numbers
   - Grayscale spectrum based on first two decimal digits
   - Examples: "3.14159", "0.50", "2.99"

3. **LLM Urgency Analysis**
   - Uses the LLM to score panic/urgency (0-10 scale)
   - Color spectrum: Bright Violet (high panic) → Magenta (moderate) → Pale Yellow (calm)

### ✅ Persona & Output

- **RTL Language**: Responds in Arabic with native script
- **Historical Philosopher**: Adopts personas like Ibn Sina, Al-Ghazali, Ibn Rushd, Maimonides, Rumi
- **Bilingual Output**: Native script followed by English translation

### ✅ Technical Requirements

- **WCAG 2.0 Compliance**: 
  - Keyboard navigation support
  - Dynamic contrast ratio calculation (4.5:1 minimum)
  - ARIA labels and semantic HTML
  - Focus indicators
  
- **LLM Integration**: Google Gemini via LangChain
  
- **Authentication**: Email restriction to @petasight.com domain

## 🏗️ Architecture

### Frontend (React + TypeScript + Vite)
- `src/auth.tsx` - Authentication with email validation
- `src/chatbot.tsx` - Main chat interface
- `src/colorUtils.ts` - Color calculation and parsing logic
- `src/styles.css` - WCAG-compliant styling

### Backend (FastAPI + LangChain)
- `app/api/v1/chat.py` - Chat endpoint
- `app/services/enhanced_chat_service.py` - LLM integration with philosopher persona
- `app/llm/providers/google_client.py` - Google Gemini client

## 🚀 Local Development

### Prerequisites
- Node.js 18+
- Python 3.11+
- Google Gemini API key

### Backend Setup

```bash
cd backend

# Install dependencies (using uv)
uv sync

# Or with pip
pip install -r requirements.txt

# Create .env file
cat > .env << EOF
GOOGLE_API_KEY=your_api_key_here
MODEL_NAME=gemini-1.5-flash
TEMPERATURE=0.7
EOF

# Run server
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend-web

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
VITE_API_BASE_URL=http://localhost:8000/api/v1/chat
EOF

# Run development server
npm run dev
```

Visit `http://localhost:5173` and login with any @petasight.com email.

## 📦 Deployment

### Deploy to Vercel

#### Frontend Deployment

1. Push code to GitHub
2. Import project in Vercel
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend-web`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables**:
     ```
     VITE_API_BASE_URL=https://your-backend-url.com/api/v1/chat
     ```

#### Backend Deployment Options

**Option 1: Vercel Serverless**
```bash
cd backend
vercel --prod
```

**Option 2: Railway/Render**
- Connect GitHub repository
- Set environment variables
- Deploy with auto-scaling

**Option 3: AWS Lambda + API Gateway**
- Use Mangum adapter for FastAPI
- Deploy via SAM or CDK

### Environment Variables

**Backend:**
- `GOOGLE_API_KEY` - Your Google Gemini API key
- `MODEL_NAME` - Model name (default: gemini-1.5-flash)
- `TEMPERATURE` - LLM temperature (default: 0.7)

**Frontend:**
- `VITE_API_BASE_URL` - Backend API endpoint URL

## 🧪 Testing Examples

### Temperature Gradient
```
User: "Paris 25°C"
Response: Light orange/red background with philosopher wisdom
```

### Decimal Grayscale
```
User: "3.14159"
Response: Mid-grey background (based on .14)
```

### Urgency Analysis
```
User: "Help! Emergency!"
Response: Bright violet background with urgent philosophical guidance
```

## 🎨 Color Logic

### Temperature Calculation
- ≤0°C: `rgb(0, 0, 139)` - Deep Blue
- 15°C: `rgb(147, 112, 219)` - Light Purple
- ≥35°C: `rgb(255, 0, 0)` - Bright Red
- Linear interpolation between ranges

### Decimal Calculation
- Extract first 2 decimal digits
- Map to grayscale: `rgb(intensity, intensity, intensity)`
- .00 = white (255), .99 = black (0)

### Urgency Calculation
- LLM-scored urgency from 0 to 10
- 0-2: Pale Yellow `rgb(255, 255, 224)`
- 5-7: Magenta `rgb(255, 0, 255)`
- 8-10: Bright Violet `rgb(138, 43, 226)`

## 🔒 Security

- Email domain validation (@petasight.com only)
- CORS configuration for production domains
- API key stored in environment variables
- Input sanitization and validation

## ♿ Accessibility Features

- Semantic HTML5 elements
- ARIA labels and roles
- Keyboard navigation (Tab, Enter, Shift+Tab)
- Dynamic contrast ratio calculation
- Focus indicators
- Screen reader support
- Responsive design

## 🛠️ Tech Stack

**Frontend:**
- React 18
- TypeScript
- Vite
- CSS3 (Custom properties)

**Backend:**
- FastAPI
- LangChain
- Google Gemini
- Pydantic

## 📝 Development Process & AI Tools Used

This project was built using modern AI-assisted development tools:

### AI Tools & Workflow
- **Amazon Q Developer**: Primary AI assistant for code generation, architecture decisions, and debugging
- **Cursor IDE**: AI-powered code editor for rapid prototyping
- **GitHub Copilot**: Code completion and suggestions

### Development Approach
1. **Requirements Analysis**: Broke down complex requirements into modular components
2. **Architecture Design**: Separated concerns (auth, color logic, LLM integration)
3. **Iterative Development**: Built and tested each feature independently
4. **Accessibility First**: Implemented WCAG compliance from the start
5. **Testing**: Manual testing with various input patterns

### Key Decisions
- **React over Vue/Angular**: Better TypeScript support and ecosystem
- **FastAPI over Flask**: Modern async support and automatic API docs
- **Google Gemini**: Cost-effective LLM with good multilingual support
- **Vite over CRA**: Faster build times and better DX
- **CSS over Tailwind**: More control over dynamic color calculations

## 📄 License

MIT

## 👤 Author

Built as part of the Full-Stack AI Engineering Challenge for Petasight.

---

**Note**: Remember to disable the API key one week after submission as requested.
