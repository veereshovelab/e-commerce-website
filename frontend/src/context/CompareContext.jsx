import React, { createContext, useState, useEffect } from 'react';

export const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
  const [compareList, setCompareList] = useState([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  useEffect(() => {
    const savedCompare = localStorage.getItem('compareList');
    if (savedCompare) {
      try {
        setCompareList(JSON.parse(savedCompare));
      } catch (err) {
        console.error('Failed to parse compareList from localStorage:', err);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('compareList', JSON.stringify(compareList));
  }, [compareList]);

  const addToCompare = (product) => {
    if (compareList.some(item => item._id === product._id)) {
      return { success: false, reason: 'already_added' };
    }
    if (compareList.length >= 4) {
      return { success: false, reason: 'limit_reached' };
    }
    setCompareList(prev => [...prev, product]);
    return { success: true };
  };

  const removeFromCompare = (productId) => {
    setCompareList(prev => prev.filter(item => item._id !== productId));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const isInCompare = (productId) => {
    return compareList.some(item => item._id === productId);
  };

  const openCompareModal = () => setIsCompareModalOpen(true);
  const closeCompareModal = () => setIsCompareModalOpen(false);

  return (
    <CompareContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        isCompareModalOpen,
        openCompareModal,
        closeCompareModal
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};
