"use client"

import React, { ReactNode, useState, useEffect, createContext } from 'react';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  // Initialize variables
  const [items, setItems] = useState({});
  const [people, setPeople] = useState({});
  const [total, setTotal] = useState(0.00);
  const [subtotal, setSubtotal] = useState(0.00);

  const noEmailPlaceholder = "No email";

  // Called when component mounts; Initializes variables with values stored in localStorage (default value if not available)
  useEffect(() => {
    try {
      const storedItems = localStorage.getItem("items");
      setItems(storedItems ? JSON.parse(storedItems) : {});
    } catch (error) {
      setItems({});
    }
    setPeople(JSON.parse(localStorage.getItem("people")) || {});
    setTotal(parseFloat(localStorage.getItem("total")) || 0.00);
  }, []);

  // Called when items is updated; Updates items in localStorage and updates subtotal
  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
    setSubtotal(
      +Object.keys(items).reduce((sum, key) => {
        return sum + items[key].price;
      }, 0).toFixed(2)
    )
  }, [items]);

  // Called when people is updated; Updates people in localStorage
  useEffect(() => {
    localStorage.setItem("people", JSON.stringify(people));
  }, [people]);

  // Called when total is updated; Updates petotalople in localStorage
  useEffect(() => {
    localStorage.setItem("total", total.toString());
  }, [total]);

  // Called when subtotal is updated; Updates subtotal in localStorage
  useEffect(() => {
    localStorage.setItem("subtotal", subtotal.toString());
  }, [subtotal]);
  
  return (
    <GlobalContext.Provider value={{ items, setItems, people, setPeople, total, setTotal, subtotal, setSubtotal, noEmailPlaceholder }}>
      {children}
    </GlobalContext.Provider>
  );
};