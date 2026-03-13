import { createContext, useContext, useEffect, useState } from "react";
import { check_token } from "../api/services/UserService/tokens";
import { read_profile } from "../api/services";

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
  const [userAuth, setUserAuth] = useState({ id: null, email: "", first_name: "", last_name: ""});

  const updateUserData = (data) => {
    const user_data = {
        id: data.id,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name
      }
    setUserAuth(user_data);
    sessionStorage.setItem('user_data', JSON.stringify(user_data));
  }

  const deleteUserData = () => {
    setUserAuth({});
    sessionStorage.removeItem('user_data');
  }

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        const isAuthenticated = await check_token();
        setIsAuth(isAuthenticated);

        if (isAuthenticated) {
          const cachedUser = sessionStorage.getItem('user_data');
          if (cachedUser) {
            setUserAuth(JSON.parse(cachedUser));
          }
          else {
            const userData = await read_profile();
            updateUserData(userData);
          }
        }
      } 
      catch (error) {
        console.error("Auth initialization failed:", error);
        setIsAuth(false);
        deleteUserData();
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
    userAuth,
    setIsAuth,
    setUserAuth,
    updateUserData,
    deleteUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};