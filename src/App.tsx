import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import tg from "./assets/telegram_logo_paper_plane_icon_258977.svg";

const socket = io("http://localhost:3000");

interface Message {
  username: string;
  text: string;
  time: string;
}

export const App = () => {
  const [username, setUsername] = useState(() => {
    return localStorage.getItem("username") || "";
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("username") ? true : false;
  });
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Message[]>([]);

  useEffect(() => {
    socket.on("message_history", (history: Message[]) => {
      setChatHistory(history);
    });
    socket.on("receive_message", (message: Message) => {
      setChatHistory((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receive_message");
      socket.off("message_history");
    };
  }, []);

  const handleLogin = () => {
    if (username.trim()) {
      localStorage.setItem("username", username.trim());
      setIsAuthenticated(true);
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("send_message", {
        username,
        text: message,
      });
      setMessage("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    setIsAuthenticated(false);
    setUsername("");
  };

  if (!isAuthenticated) {
    return (
      <div className="login-container">
        <h2 className="login-title">Введите ник</h2>
        <div className="login-input">
          <input
            type="text"
            placeholder="введи ник..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="login-field"
          />
          <button className="login-btn" onClick={handleLogin}>
            Войти
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Шапка чата с ником и кнопкой Выйти */}
      <header className="chat-header">
        <div className="user-info">
          <span className="status-dot"></span>
          <span>
            Вы вошли как: <strong>{username}</strong>
          </span>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Выйти
        </button>
      </header>

      {/* Лента сообщений в виде облачков */}
      <main className="messages-list">
        {chatHistory.map((msg, index) => {
          // Проверяем, моё ли это сообщение
          const isMe = msg.username === username;

          return (
            <div
              key={index}
              className={`message-wrapper ${isMe ? "me" : "other"}`}
            >
              {/* Показываем ник только над чужими сообщениями */}
              {!isMe && <span className="message-author">{msg.username}</span>}

              <div className="message-bubble">
                <p className="message-text">{msg.text}</p>
                <span className="message-time">{msg.time}</span>
              </div>
            </div>
          );
        })}
      </main>

      {/* Нижняя панель с полем ввода */}
      <footer className="chat-footer">
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="Введите сообщение..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="chat-input"
          />
          <button onClick={sendMessage} className="send-btn">
            <img src={tg} alt="Send" className="send-icon" />
          </button>
        </div>
      </footer>
    </div>
  );
};
