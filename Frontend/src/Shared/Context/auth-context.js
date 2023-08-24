import React, { useCallback, useEffect, useState } from "react";

const AuthContext = React.createContext({
  isLoggedIn: false,
  userId: null,
  token: null,
  login: () => {},
  logout: () => {},
});

let logoutTimer;

export const AuthContextProvider = (props) => {
  const [token, setToken] = useState();
  const [userId, setUserId] = useState();
  const [expirationTime, setExpirationTime] = useState();

  const login = useCallback((userId, token, expirationTime) => {
    setToken(token);
    setUserId(userId);
    const tokenExpirationTime =
      expirationTime || new Date(new Date().getTime() + 1000 * 60 * 60);
    setExpirationTime(tokenExpirationTime);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: userId,
        token: token,
        expirationTime: tokenExpirationTime.toISOString(),
      })
    );
  }, []);

  const logout = useCallback((userId) => {
    setToken(null);
    setExpirationTime(null);
    setUserId(userId);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    if (token && expirationTime) {
      const remainingTime = expirationTime.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, expirationTime]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expirationTime) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        new Date(storedData.expirationTime)
      );
    }
  }, [login]);

  const value = {
    isLoggedIn: !!token,
    token,
    userId,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
};

export default AuthContext;
