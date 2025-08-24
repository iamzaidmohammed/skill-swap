import { createContext, useContext, useEffect, useState } from "react";
import API from "../api";
import { useAuth } from "./AuthContext";

const SkillContext = createContext();

export const SkillProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth(); // <-- use auth state
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSkills = async (signal) => {
    if (!user) {
      setSkills([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await API.get("/skills", { signal });
      setSkills(res.data);
    } catch (err) {
      // ignore aborts
      if (err.name === "CanceledError" || err.message === "canceled") return;
      console.log("Fetch error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const addSkill = async (offered, wanted) => {
    try {
      const res = await API.post("/skills", { offered, wanted });
      setSkills((prev) => [...prev, res.data]);
    } catch (err) {
      console.log("Add error:", err.response?.data || err.message);
    }
  };

  const updateSkill = async (id, offered, wanted) => {
    try {
      const res = await API.put(`/skills/${id}`, { offered, wanted });
      setSkills((prev) => prev.map((s) => (s._id === id ? res.data : s)));
    } catch (err) {
      console.log("Update error:", err.response?.data || err.message);
    }
  };

  const deleteSkill = async (id) => {
    try {
      await API.delete(`/skills/${id}`);
      setSkills((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.log("Delete error:", err.response?.data || err.message);
    }
  };

  // Wait for auth to finish restoring before fetching skills
  useEffect(() => {
    const controller = new AbortController();
    if (!authLoading) {
      if (user) {
        fetchSkills(controller.signal);
      } else {
        // not logged in — clear list and stop loading
        setSkills([]);
        setLoading(false);
      }
    }
    return () => controller.abort();
  }, [authLoading, user]);

  return (
    <SkillContext.Provider
      value={{ skills, loading, addSkill, updateSkill, deleteSkill }}
    >
      {children}
    </SkillContext.Provider>
  );
};

export const useSkills = () => useContext(SkillContext);
