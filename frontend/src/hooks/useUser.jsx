import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    isLoggedIn: false,
    apiKey: null,
    username: null
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser({
        isLoggedIn: true,
        apiKey: parsedUser.apiKey,
        username: parsedUser.username
      });
    }
  }, []);

  useEffect(() => {
    if (user.isLoggedIn && user.username) {
      localStorage.setItem('user', JSON.stringify({ apiKey: user.apiKey, username: user.username }));
    }
  }, [user]);

  const loginUser = (apiKey, username) => {
    setUser({
      isLoggedIn: true,
      apiKey,
      username
    });
  };

  const logoutUser = () => {
    localStorage.removeItem('user');
    setUser({
      isLoggedIn: false,
      apiKey: null,
      username: null
    });
  };

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);