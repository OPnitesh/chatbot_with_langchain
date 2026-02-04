import streamlit as st
import requests

BACKEND_URL = "http://localhost:8000/chat"

st.set_page_config(
    page_title="Chatbot",
    page_icon="🤖",
    layout="centered",
)

# -----------------------------
# SESSION STATE
# -----------------------------
if "messages" not in st.session_state:
    st.session_state.messages = []

# -----------------------------
# HEADER
# -----------------------------
st.title("🤖 Chatbot")
st.caption("FastAPI · LangChain · Gemini")

# -----------------------------
# CHAT HISTORY
# -----------------------------
for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])

# 👇 Invisible anchor (scroll target)
st.markdown('<div id="chat-bottom"></div>', unsafe_allow_html=True)

# -----------------------------
# AUTO SCROLL SCRIPT
# -----------------------------
def auto_scroll():
    st.markdown(
        """
        <script>
            const chatBottom = document.getElementById("chat-bottom");
            if (chatBottom) {
                chatBottom.scrollIntoView({ behavior: "smooth" });
            }
        </script>
        """,
        unsafe_allow_html=True,
    )

# -----------------------------
# CHAT INPUT
# -----------------------------
user_input = st.chat_input("Type your message…")

if user_input:
    # Save user message
    st.session_state.messages.append(
        {"role": "user", "content": user_input}
    )

    with st.chat_message("user"):
        st.markdown(user_input)

    # Call backend
    with st.chat_message("assistant"):
        with st.spinner("Thinking..."):
            try:
                response = requests.post(
                    BACKEND_URL,
                    json={"messages": st.session_state.messages},
                    timeout=60,
                )
                response.raise_for_status()
                assistant_reply = response.json()["response"]
            except Exception as e:
                assistant_reply = f"❌ Error: {e}"

        st.markdown(assistant_reply)

    # Save assistant reply
    st.session_state.messages.append(
        {"role": "assistant", "content": assistant_reply}
    )

    # ✅ AUTO SCROLL AFTER MESSAGE
    auto_scroll()
