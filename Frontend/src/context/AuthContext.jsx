import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

// Temporary administrator account for frontend testing
const ADMIN_ACCOUNT = {
  id: "admin-001",
  name: "AgriNova Administrator",
  email: "admin@agrinova.rw",
  password: "Admin123",
  role: "admin",
};

export function AuthProvider({ children }) {
  // Restore logged-in user after refreshing the page
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("agrinova_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  // Restore registered farmers
  const [farmers, setFarmers] = useState(() => {
    try {
      const savedFarmers = localStorage.getItem("agrinova_farmers");
      return savedFarmers ? JSON.parse(savedFarmers) : [];
    } catch {
      return [];
    }
  });

  // Register a new farmer
  function register(farmerData) {
    const email = farmerData.email?.trim().toLowerCase();

    if (!farmerData.name || !email || !farmerData.password) {
      return {
        success: false,
        message: "Please complete all required fields.",
      };
    }

    const emailAlreadyUsed = farmers.some(
      (farmer) => farmer.email.toLowerCase() === email,
    );

    if (email === ADMIN_ACCOUNT.email || emailAlreadyUsed) {
      return {
        success: false,
        message: "This email is already registered.",
      };
    }

    const newFarmer = {
      id: `farmer-${Date.now()}`,
      ...farmerData,
      email,
      role: "farmer",
    };

    const updatedFarmers = [...farmers, newFarmer];

    setFarmers(updatedFarmers);

    localStorage.setItem("agrinova_farmers", JSON.stringify(updatedFarmers));

    return {
      success: true,
      message: "Registration successful. You can now log in.",
    };
  }

  // Login an administrator or farmer
  function login(identifier, password) {
    const enteredIdentifier = identifier.trim().toLowerCase();

    // Check administrator account
    if (
      enteredIdentifier === ADMIN_ACCOUNT.email &&
      password === ADMIN_ACCOUNT.password
    ) {
      const loggedInAdmin = {
        id: ADMIN_ACCOUNT.id,
        name: ADMIN_ACCOUNT.name,
        email: ADMIN_ACCOUNT.email,
        role: "admin",
      };

      setUser(loggedInAdmin);

      localStorage.setItem("agrinova_user", JSON.stringify(loggedInAdmin));

      return {
        success: true,
        role: "admin",
      };
    }

    // Check registered farmer accounts
    const farmer = farmers.find(
      (item) =>
        (item.email?.toLowerCase() === enteredIdentifier ||
          item.phone === identifier.trim()) &&
        item.password === password,
    );

    if (farmer) {
      const loggedInFarmer = {
        id: farmer.id,
        name: farmer.name,
        email: farmer.email,
        phone: farmer.phone,
        role: "farmer",
      };

      setUser(loggedInFarmer);

      localStorage.setItem("agrinova_user", JSON.stringify(loggedInFarmer));

      return {
        success: true,
        role: "farmer",
      };
    }

    return {
      success: false,
      message: "Incorrect email/phone number or password.",
    };
  }

  // Logout
  function logout() {
    setUser(null);
    localStorage.removeItem("agrinova_user");
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        farmers,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to access authentication
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider.");
  }

  return context;
}
