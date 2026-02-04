import os
from dotenv import load_dotenv
from langchain.agents import create_agent
from langchain_google_genai import ChatGoogleGenerativeAI

# --------------------------------------------------
# Load environment variables FIRST
# --------------------------------------------------
load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise RuntimeError(
        "GOOGLE_API_KEY is not set. "
        "Add it to .env or export it before running the app."
    )

# --------------------------------------------------
# Singleton Agent
# --------------------------------------------------
_agent = None

def get_agent():
    global _agent

    if _agent is None:
        # ✅ Create Gemini model explicitly
        llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            api_key=GOOGLE_API_KEY,
        )

        # ✅ Pass model OBJECT (not string) to agent
        _agent = create_agent(
            model=llm,
            tools=[],
        )

    return _agent
