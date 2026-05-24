import { useEffect, useState } from "react";
import { ChatWindow } from "./components/ChatWindow";
import { useChatStore } from "./store/chatStore";

export const App = () => {
  const { initializeSocket, username, setUserName } = useChatStore();
  const [tempInput, setTempInput] = useState("");

  useEffect(() => {
    if (username) {
      initializeSocket(username);
    }
  }, [initializeSocket, username]);

  const handleLogin = () => {
    if (tempInput.trim()) {
      localStorage.setItem("username", tempInput.trim());
      setUserName(tempInput.trim());
    }
  };

  if (!username) {
    return (
      <div className="login-container">
        <h2 className="login-title">Введите ник</h2>
        <div className="login-input">
          <input
            type="text"
            placeholder="введи ник..."
            value={tempInput}
            onChange={(e) => setTempInput(e.target.value)}
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
      <ChatWindow />
    </div>
  );
};
