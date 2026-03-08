import { createContext, useContext, useEffect, useState } from "react";
import { getCookie } from "../api/utils/auth/cookies";


const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState({ first_name: "", last_name: "", email: "" });

  const value = {
    isAuth,
    user,
    setUser,
    setIsAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};