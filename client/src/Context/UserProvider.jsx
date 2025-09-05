import React, { useState } from "react";
import UserContext from "./UserContext";

const UserProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState({});

  return (
    <UserContext.Provider value={{ isLogin, setIsLogin, user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
