import React, { createContext, useState } from "react";

// Context oluştur
export const MyContext = createContext();

const MyProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState([]);
  const [amountType, setAmountType] = useState(1);
  const [amountHistoryType, setAmountHistoryType] = useState(1);

  return (
    <MyContext.Provider
      value={{
        users,
        setUsers,
        name,
        setName,
        amountType,
        setAmountType,
        amountHistoryType,
        setAmountHistoryType,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export default MyProvider;
