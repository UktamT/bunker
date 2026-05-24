import { create } from "zustand";
import { io, Socket } from "socket.io-client";

interface Message {
  id: string;
  username: string;
  text: string;
  time: string;
  replyTo?: {
    username: string;
    text: string;
  } | null;
}

interface ChatState {
  username: string;
  message: string;
  onlineCount: number;
  chatHistory: Message[];
  socket: Socket | null;
  initializeSocket: (username: string) => void;
  sendMessage: (text: string) => void;
  setUserName: (username: string) => void;
  logout: () => void;
  replyTo: Message | null;
  setReplyTo: (message: Message | null) => void;
  clearChatHistory: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  username: localStorage.getItem("username") || "",
  message: "",
  onlineCount: 0,
  chatHistory: [],
  socket: null,
  replyTo: null,
  initializeSocket: (username) => {
    if (get().socket) return;

    const socket = io("https://bunker-back-g96b.onrender.com");

    socket.on("message_history", (history: Message[]) => {
      set({ chatHistory: history });
    });

    socket.on("receive_message", (message: Message) => {
      set((state) => ({ chatHistory: [...state.chatHistory, message] }));
    });

    socket.on("online_count", (onlineCount: number) => {
      set({ onlineCount });
    });

    socket.on("messages_cleared", () => {
      set({ chatHistory: [] });
    });

    set({ socket, username });
  },

  clearChatHistory: () => {
    const socket = get().socket;

    const password = prompt("Введите пароль");

    if (password === "forreal76") {
      if (socket) {
        socket.emit("clear_messages");
      }
    } else {
      alert("Неверный пароль");
    }
  },

  sendMessage: (text) => {
    const socket = get().socket;
    const username = get().username;
    const replyingTo = get().replyTo;

    if (socket && username) {
      socket.emit("send_message", {
        username,
        text: text.trim(),
        replyTo: replyingTo
          ? { username: replyingTo.username, text: replyingTo.text }
          : null,
      });
    }
    set({ message: "", replyTo: null });
  },
  setUserName: (username) => set({ username }),
  logout: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
    }
    localStorage.removeItem("username");
    set({ username: "", socket: null, chatHistory: [] });
  },

  setReplyTo: (message) => set({ replyTo: message }),
}));
