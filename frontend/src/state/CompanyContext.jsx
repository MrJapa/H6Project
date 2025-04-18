// src/state/CompanyContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const CompanyContext = createContext();

export const CompanyProvider = ({ children }) => {
  const [selectedCompany, setSelectedCompany] = useState(() => {
    return localStorage.getItem('selectedCompany') || '';
  });

  useEffect(() => {
    if (selectedCompany) {
      localStorage.setItem('selectedCompany', selectedCompany);
    }
  }, [selectedCompany]);

  return (
    <CompanyContext.Provider value={{ selectedCompany, setSelectedCompany }}>
      {children}
    </CompanyContext.Provider>
  );
};
