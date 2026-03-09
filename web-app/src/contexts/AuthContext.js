import { createContext, useContext, useEffect, useState } from "react";
import { check_token } from "../api/services/UserService/tokens";


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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        const isAuthenticated = await check_token();
        setIsAuth(isAuthenticated);
      } 
      catch (error) {
        console.error("Auth initialization failed:", error);
        setIsAuth(false);
      }
      finally{
        setIsLoading(false);
      }
  };
    
    initializeAuth();
  }, [isAuth]);

  const value = {
    isAuth,
    isLoading,
    setIsAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};