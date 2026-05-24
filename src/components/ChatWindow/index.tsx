import tg from "../../assets/telegram_logo_paper_plane_icon_258977.svg";
import backTo from "../../assets/image_2026-05-24_18-44-40.png";
import closeIcon from "../../assets/icons8-отмена.svg";
import { useState, useEffect, useRef } from "react";
import { useChatStore } from "../../store/chatStore";

export const ChatWindow = () => {
  const {
    username,
    chatHistory,
    sendMessage,
    logout,
    onlineCount,
    replyTo,
    setReplyTo,
    clearChatHistory,
  } = useChatStore();
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
        <span
          style={{ cursor: "pointer" }}
          className="clear-chat"
          onClick={() => clearChatHistory()}
        >
          Очистить чат
        </span>
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
              {!isMe && (
                <span
                  onClick={() => setReplyTo(msg)}
                  style={{ cursor: "pointer" }}
                  className="message-author"
                >
                  {msg.username}⠀⠀Ответить
                </span>
              )}

              <div className="message-bubble">
                {msg.replyTo && (
                  <div
                    className="reply-quote"
                    style={{
                      borderLeft: "2px solid #5865f2",
                      paddingLeft: "6px",
                      marginBottom: "6px",
                      opacity: 0.7,
                      fontSize: "13px",
                    }}
                  >
                    <strong>{msg.replyTo.username}</strong>: {msg.replyTo.text}
                  </div>
                )}
                <p className="message-text">{msg.text}</p>
                <span className="message-time">{msg.time}</span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </main>

      <footer className="chat-footer">
        {replyTo && (
          <div
            className="reply-preview"
            style={{
              display: "flex",
              justifyContent: "space-between",

              padding: "8px",
              background: "#292a2c",
              borderRadius: "6px",
              marginBottom: "8px",
              fontSize: "13px",
            }}
          >
            <div>
              Ответ пользователю <strong>{replyTo.username}</strong>
            </div>

            <img
              onClick={() => setReplyTo(null)}
              style={{ width: "16px", height: "16px", cursor: "pointer" }}
              src={closeIcon}
              alt="Close"
            />
          </div>
        )}
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
