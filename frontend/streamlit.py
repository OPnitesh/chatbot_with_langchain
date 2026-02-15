import streamlit as st
import json
import requests
import uuid

# -----------------------------
# SESSION STATE (MUST BE FIRST)
# -----------------------------
if "messages" not in st.session_state:
    st.session_state.messages = []

if "session_id" not in st.session_state:
    st.session_state.session_id = str(uuid.uuid4())

# -----------------------------
# CONFIG
# -----------------------------
BACKEND_STREAM_URL = "http://localhost:8000/chat/stream"

st.set_page_config(
    page_title="Chatbot",
    page_icon="🤖",
    layout="centered",
)

# -----------------------------
# HEADER
# -----------------------------
st.title("🤖 Chatbot")
st.caption("FastAPI · LangGraph · Gemini")

# -----------------------------
# CHAT HISTORY
# -----------------------------
for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])

# -----------------------------
# CHAT INPUT
# -----------------------------
user_input = st.chat_input("Type your message…")

if user_input:
    # Save user message (UI only)
    st.session_state.messages.append(
        {"role": "user", "content": user_input}
    )

    with st.chat_message("user"):
        st.markdown(user_input)

    def stream_assistant_reply():
        response = requests.post(
            BACKEND_STREAM_URL,
            json={
                "message": user_input,
                "session_id": st.session_state.session_id,
            },
            stream=True,
            timeout=120,
        )
        response.raise_for_status()

        for line in response.iter_lines(decode_unicode=True):
            if not line or not line.startswith("data: "):
                continue

            payload = json.loads(line[6:])
            event_type = payload.get("type")
            content = payload.get("content", "")

            if event_type == "token" and content:
                yield content

            if event_type == "end":
                break

            if event_type == "error":
                raise RuntimeError(content or "Streaming failed.")

    # Call backend stream (LangGraph memory)
    with st.chat_message("assistant"):
        with st.spinner("Thinking..."):
            try:
                assistant_reply = st.write_stream(stream_assistant_reply)
            except Exception as e:
                assistant_reply = f"❌ Error: {e}"
                st.markdown(assistant_reply)

    # Save assistant reply (UI only)
    st.session_state.messages.append(
        {"role": "assistant", "content": assistant_reply}
    )
