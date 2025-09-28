import { createContext, useState, useContext } from "react";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  console.log(user);

  const signup = async (formDataToSend) => {
    try {
      const response = await axiosInstance.post(
        "/auth/register",
        formDataToSend
      );
      const data = response.data;

      if (!data.success) {
        throw new Error(data.message || "Registration failed");
      }

      setUser(data.user || data);
      localStorage.setItem("user", JSON.stringify(data.user || data));

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        message: error?.response?.data?.message || error.message,
      };
    }
  };

  const login = async (formDataToSend) => {
    try {
      const response = await axiosInstance.post("/auth/login", formDataToSend);
      const data = response.data;

      if (!data.success) {
        throw new Error(data.message || "Login failed");
      }

      setUser(data.data);
      localStorage.setItem("user", JSON.stringify(data.user || data));

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        message: error?.response?.data?.message || error.message,
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.success("Login successful!");
  };

  return (
    <UserContext.Provider value={{ user, setUser, signup, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
