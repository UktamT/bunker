import tg from "../../assets/telegram_logo_paper_plane_icon_258977.svg";
import backTo from "../../assets/free-icon-left-arrow-329350.png";
import { useState, useEffect, useRef } from "react";
import { useChatStore } from "../../store/chatStore";

export const ChatWindow = () => {
  const { username, chatHistory, sendMessage, logout, onlineCount } =
    useChatStore();
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(message);
      setMessage("");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  return (
    <>
      <header className="chat-header">
        <div className="user-info">
          <img
            style={{ width: "24px", height: "24px", cursor: "pointer" }}
            src={backTo}
            alt="Back"
            className="back-icon"
          />
          <span>
            Вы вошли как: <strong>{username}</strong>
          </span>
          <span>
            Онлайн: <strong>{onlineCount}</strong>
          </span>
        </div>
        <button className="logout-btn" onClick={logout}>
          Выйти
        </button>
      </header>

      <main className="messages-list">
        {chatHistory.map((msg, index) => {
          const isMe = msg.username === username;

          return (
            <div
              key={index}
              className={`message-wrapper ${isMe ? "me" : "other"}`}
            >
              {!isMe && <span className="message-author">{msg.username}</span>}

              <div className="message-bubble">
                <p className="message-text">{msg.text}</p>
                <span className="message-time">{msg.time}</span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </main>

      <footer className="chat-footer">
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="Введите сообщение..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            className="chat-input"
          />
          <button onClick={handleSendMessage} className="send-btn">
            <img src={tg} alt="Send" className="send-icon" />
          </button>
        </div>
      </footer>
    </>
  );
};
