import { create } from "zustand";
import { io, Socket } from "socket.io-client";

interface Message {
  username: string;
  text: string;
  time: string;
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
}

export const useChatStore = create<ChatState>((set, get) => ({
  username: localStorage.getItem("username") || "",
  message: "",
  onlineCount: 0,
  chatHistory: [],
  socket: null,
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

    set({ socket, username });
  },
  sendMessage: (text) => {
    const socket = get().socket;
    const username = get().username;

    if (socket && username) {
      socket.emit("send_message", { username, text: text.trim() });
    }
    set({ message: "" });
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
}));
