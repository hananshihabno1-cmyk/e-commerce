import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

const defaultUser = {
  name: 'Hanan Shihab',
  email: 'hanan@deniosports.com',
  phone: '+91 98765 43210',
  avatar: null,
};

const defaultAddresses = [
  {
    id: 'addr-1',
    name: 'Hanan Shihab',
    phone: '+91 98765 43210',
    line1: '42, Park View Apartments',
    line2: 'MG Road, Kozhikode',
    city: 'Kozhikode',
    state: 'Kerala',
    pincode: '673001',
    isDefault: true,
  },
  {
    id: 'addr-2',
    name: 'Hanan Shihab',
    phone: '+91 98765 43210',
    line1: '15, Tech Park Tower B',
    line2: 'Infopark, Kakkanad',
    city: 'Kochi',
    state: 'Kerala',
    pincode: '682030',
    isDefault: false,
  },
];

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Demo default: logged in
  const [user, setUser] = useState(defaultUser);
  const [addresses, setAddresses] = useState(defaultAddresses);

  const login = (email, password) => {
    // Mock login — always succeeds
    setIsAuthenticated(true);
    setUser({ ...defaultUser, email });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const updateProfile = (data) => {
    setUser((prev) => ({ ...prev, ...data }));
  };

  const addAddress = (address) => {
    const newAddr = { ...address, id: `addr-${Date.now()}` };
    if (newAddr.isDefault) {
      setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: false })).concat(newAddr));
    } else {
      setAddresses((prev) => [...prev, newAddr]);
    }
  };

  const updateAddress = (id, data) => {
    setAddresses((prev) => {
      let updated = prev.map((a) => (a.id === id ? { ...a, ...data } : a));
      if (data.isDefault) {
        updated = updated.map((a) => ({ ...a, isDefault: a.id === id }));
      }
      return updated;
    });
  };

  const deleteAddress = (id) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        addresses,
        login,
        logout,
        updateProfile,
        addAddress,
        updateAddress,
        deleteAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
