import React, { useCallback, useEffect, useState } from "react";

let logoutTimer;

export const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

const calculateRemainingTime = (timeLeft) => {
  const todayDate = new Date().getTime();
  const expirataionTime = new Date(timeLeft).getTime();

  const remainingTime = expirataionTime - todayDate;

  return remainingTime;
};

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem("token");
  const storedTimeLeft = localStorage.getItem("timeLeft");

  const remainingTime = calculateRemainingTime(storedTimeLeft);

  if (remainingTime < 120000) {
    localStorage.removeItem("timeLeft");
    return null;
  }

  return { token: storedToken, duration: remainingTime };
};

export const AuthContextProvider = (props) => {
  const tokenData = retrieveStoredToken();
  let initialToken;
  if (tokenData) {
    initialToken = tokenData.token;
  }

  const [token, setToken] = useState(initialToken);

  const userIsLoggedIn = !!token;

  const logoutHandler = useCallback(() => {
    setToken(null);
    localStorage.removeItem("token");

    if (logoutTimer) clearTimeout(logoutTimer);
  }, []);

  const loginHandler = (token, timeLeft) => {
    setToken(token);
    localStorage.setItem("token", token);
    localStorage.setItem("timeLeft", timeLeft);

    const remainingTime = calculateRemainingTime(timeLeft);
    logoutTimer = setTimeout(logoutHandler, remainingTime);
  };

  useEffect(() => {
    if (tokenData) {
      logoutTimer = setTimeout(logoutHandler, tokenData.duration);
    }
  }, [tokenData, logoutHandler]);

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};
