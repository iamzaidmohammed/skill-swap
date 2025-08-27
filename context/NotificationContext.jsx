import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import API from "../api";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notifications");
      setNotifications(res.data || []);
    } catch (err) {
      console.log(
        "Fetch notifications error:",
        err.response?.data || err.message
      );
    }
  };

  useEffect(() => {
    let s;
    let mounted = true;
    const setup = async () => {
      if (!user) return;

      // initial load
      await fetchNotifications();

      try {
        const token = await AsyncStorage.getItem("token");
        const base =
          API.defaults.baseURL?.replace(/\/api$/, "") ||
          "http://localhost:5000";
        s = io(base, { auth: { token } });
        s.on("connect", () => console.log("socket connected"));
        s.on("notification", (n) => {
          if (!mounted) return;
          setNotifications((p) => [n, ...p]);
        });
        setSocket(s);
      } catch (e) {
        console.log("Socket error:", e.message || e);
      }
    };

    setup();

    return () => {
      mounted = false;
      if (s) s.disconnect();
    };
  }, [user]);

  const markAllRead = async () => {
    try {
      await API.post("/notifications/read-all");
      setNotifications((p) => p.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.log("Mark all read error:", err.response?.data || err.message);
    }
  };

  const markRead = async (id) => {
    try {
      await API.post(`/notifications/${id}/read`);
      setNotifications((p) =>
        p.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.log("Mark read error:", err.response?.data || err.message);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        fetchNotifications,
        markRead,
        markAllRead,
        unreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
