import React, { createContext, useState, useContext, useEffect } from 'react';

const Web3Context = createContext();

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    setLoading(true);
    try {
      // محاكاة اتصال الميتاماسك
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        setAccount(accounts[0]);
        setIsConnected(true);
        
        // استمع لتغيير الحسابات
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        
        return accounts[0];
      } else {
        throw new Error('MetaMask is not installed');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      // المستخدم قام بفصل المحفظة
      disconnectWallet();
    } else {
      setAccount(accounts[0]);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setIsConnected(false);
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    }
  };

  useEffect(() => {
    // تحقق من اتصال سابق
    const checkConnection = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ 
          method: 'eth_accounts' 
        });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
          window.ethereum.on('accountsChanged', handleAccountsChanged);
        }
      }
    };

    checkConnection();
  }, []);

  const value = {
    account,
    isConnected,
    loading,
    connectWallet,
    disconnectWallet
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};