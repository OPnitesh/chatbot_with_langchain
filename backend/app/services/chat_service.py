from langchain_core.messages import HumanMessage
from app.llm.graph import graph  # compiled graph

# 🔒 In-memory session store (DEV ONLY)
SESSION_STORE = {}


def generate_response(user_message: str, session_id: str) -> str:
    # 1️⃣ Initialize memory if new session
    if session_id not in SESSION_STORE:
        SESSION_STORE[session_id] = {
            "messages": []
        }

    # 2️⃣ Append user message to memory
    SESSION_STORE[session_id]["messages"].append(
        HumanMessage(content=user_message)
    )

    # 3️⃣ Invoke LangGraph WITH FULL STATE
    result = graph.invoke(SESSION_STORE[session_id])

    # 4️⃣ Persist updated state
    SESSION_STORE[session_id] = result

    # 5️⃣ Return last AI message
    return result["messages"][-1].content
