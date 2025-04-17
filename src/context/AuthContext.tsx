
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/types";
import usersData from "@/data/users.json";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for user in localStorage on initial load
    const storedUser = localStorage.getItem("bookverse_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const updateLocalUsers = (updatedUsers: User[]) => {
    // In a real app, this would update the server
    // For our demo, we'll just store in localStorage
    localStorage.setItem("bookverse_users", JSON.stringify(updatedUsers));
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // Get users from localStorage or use default if none exist
    const storedUsers = localStorage.getItem("bookverse_users");
    const users = storedUsers ? JSON.parse(storedUsers) : usersData.users;
    
    const foundUser = users.find((u: User) => u.email === email && u.password === password);
    
    if (foundUser) {
      const userWithoutPassword = { ...foundUser };
      delete userWithoutPassword.password;
      
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      localStorage.setItem("bookverse_user", JSON.stringify(userWithoutPassword));
      return true;
    }
    
    return false;
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    // Get users from localStorage or use default if none exist
    const storedUsers = localStorage.getItem("bookverse_users");
    const users = storedUsers ? JSON.parse(storedUsers) : usersData.users;
    
    // Check if user already exists
    const userExists = users.some((u: User) => u.email === email);
    
    if (userExists) {
      return false;
    }
    
    // Create new user
    const newUser = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
      createdAt: new Date().toISOString()
    };
    
    // Add to users array
    const updatedUsers = [...users, newUser];
    updateLocalUsers(updatedUsers);
    
    // Login the user
    const userWithoutPassword = { ...newUser };
    delete userWithoutPassword.password;
    
    setUser(userWithoutPassword);
    setIsAuthenticated(true);
    localStorage.setItem("bookverse_user", JSON.stringify(userWithoutPassword));
    
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("bookverse_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
