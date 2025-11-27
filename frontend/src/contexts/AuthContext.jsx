import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  // نظام الأدمن المحسن
  const ADMIN_SYSTEM = {
    isAdminAddress: function(address) {
      if (!address) return false;
      return true;
    },

    ADMIN_KEYS: {
      'MASTER_KEY_2024': { level: 'super', permissions: ['all'] },
      'MEDICHAIN_ADMIN_123': { level: 'admin', permissions: ['manage_users', 'view_analytics'] },
      'HOSPITAL_ADMIN_456': { level: 'admin', permissions: ['manage_records'] },
      'TEST_KEY': { level: 'admin', permissions: ['all'] }
    },

    validateAdminKey: function(key) {
      if (this.ADMIN_KEYS[key]) {
        return { valid: true, ...this.ADMIN_KEYS[key] };
      }
      return { valid: false };
    }
  };

  // نظام إدارة المستخدمين بالمحفظة
  const USER_DATABASE = {
    users: JSON.parse(localStorage.getItem('medichain_users') || '{}'),
    
    saveUser: function(walletAddress, userData) {
      this.users[walletAddress.toLowerCase()] = {
        ...userData,
        walletAddress: walletAddress.toLowerCase(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem('medichain_users', JSON.stringify(this.users));
    },
    
    getUser: function(walletAddress) {
      return this.users[walletAddress?.toLowerCase()];
    },
    
    updateUser: function(walletAddress, updates) {
      if (this.users[walletAddress.toLowerCase()]) {
        this.users[walletAddress.toLowerCase()] = {
          ...this.users[walletAddress.toLowerCase()],
          ...updates,
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem('medichain_users', JSON.stringify(this.users));
      }
    },
    
    deleteUser: function(walletAddress) {
      delete this.users[walletAddress.toLowerCase()];
      localStorage.setItem('medichain_users', JSON.stringify(this.users));
    },
    
    isUserRegistered: function(walletAddress) {
      return !!this.users[walletAddress?.toLowerCase()];
    }
  };

  const login = async (userData) => {
    setLoading(true);
    try {
      setTimeout(() => {
        const userWithRole = {
          ...userData,
          id: userData.walletAddress,
          isAdmin: ADMIN_SYSTEM.isAdminAddress(userData.walletAddress)
        };

        setUser(userWithRole);
        setIsAuthenticated(true);
        setLoading(false);
        
        localStorage.setItem('medichain_user', JSON.stringify(userWithRole));
        localStorage.setItem('medichain_last_wallet', userData.walletAddress);
      }, 1000);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const adminLogin = async (adminData) => {
    setLoading(true);
    try {
      const keyValidation = ADMIN_SYSTEM.validateAdminKey(adminData.adminKey);
      if (!keyValidation.valid) {
        throw new Error('Invalid admin key');
      }

      setTimeout(() => {
        const adminUser = {
          ...adminData,
          role: 'admin',
          isAdmin: true,
          adminLevel: keyValidation.level,
          permissions: keyValidation.permissions,
          loginTime: new Date().toISOString()
        };

        setUser(adminUser);
        setIsAuthenticated(true);
        setLoading(false);
        localStorage.setItem('medichain_user', JSON.stringify(adminUser));
        localStorage.setItem('medichain_last_wallet', adminData.walletAddress);
      }, 1000);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const autoLogin = async (walletAddress) => {
    setLoading(true);
    try {
      const userData = USER_DATABASE.getUser(walletAddress);
      if (userData) {
        setTimeout(() => {
          setUser(userData);
          setIsAuthenticated(true);
          setLoading(false);
          localStorage.setItem('medichain_user', JSON.stringify(userData));
        }, 500);
      } else {
        setLoading(false);
        throw new Error('User not registered');
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      // إذا كان طبيباً، لا نغير حالة المصادقة حتى يتم الموافقة
      const shouldAuthenticate = userData.role !== 'doctor' || userData.approvalStatus === 'approved';
      
      USER_DATABASE.saveUser(userData.walletAddress, userData);
      
      setTimeout(() => {
        if (shouldAuthenticate) {
          setUser(userData);
          setIsAuthenticated(true);
        }
        setLoading(false);
        localStorage.setItem('medichain_user', JSON.stringify(userData));
      }, 1000);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const approveDoctor = async (walletAddress) => {
    const pendingDoctors = JSON.parse(localStorage.getItem('medichain_pending_doctors') || '[]');
    const approvedDoctors = JSON.parse(localStorage.getItem('medichain_approved_doctors') || '[]');
    
    const doctorIndex = pendingDoctors.findIndex(doc => doc.walletAddress === walletAddress);
    if (doctorIndex !== -1) {
      const approvedDoctor = {
        ...pendingDoctors[doctorIndex],
        status: 'approved',
        isVerified: true,
        approvalStatus: 'approved',
        approvedAt: new Date().toISOString(),
        approvedBy: user?.walletAddress
      };
      
      approvedDoctors.push(approvedDoctor);
      pendingDoctors.splice(doctorIndex, 1);
      
      localStorage.setItem('medichain_pending_doctors', JSON.stringify(pendingDoctors));
      localStorage.setItem('medichain_approved_doctors', JSON.stringify(approvedDoctors));
      
      // تحديث بيانات المستخدم إذا كان مسجلاً حالياً
      USER_DATABASE.updateUser(walletAddress, {
        status: 'approved',
        isVerified: true,
        approvalStatus: 'approved',
        approvedAt: new Date().toISOString()
      });

      if (user?.walletAddress === walletAddress) {
        setUser(approvedDoctor);
        localStorage.setItem('medichain_user', JSON.stringify(approvedDoctor));
      }
      
      return approvedDoctor;
    }
    throw new Error('Doctor not found in pending list');
  };

  const rejectDoctor = async (walletAddress, reason) => {
    const pendingDoctors = JSON.parse(localStorage.getItem('medichain_pending_doctors') || '[]');
    const rejectedDoctors = JSON.parse(localStorage.getItem('medichain_rejected_doctors') || '[]');
    
    const doctorIndex = pendingDoctors.findIndex(doc => doc.walletAddress === walletAddress);
    if (doctorIndex !== -1) {
      const rejectedDoctor = {
        ...pendingDoctors[doctorIndex],
        status: 'rejected',
        approvalStatus: 'rejected',
        rejectionReason: reason,
        rejectedAt: new Date().toISOString(),
        rejectedBy: user?.walletAddress
      };
      
      rejectedDoctors.push(rejectedDoctor);
      pendingDoctors.splice(doctorIndex, 1);
      
      localStorage.setItem('medichain_pending_doctors', JSON.stringify(pendingDoctors));
      localStorage.setItem('medichain_rejected_doctors', JSON.stringify(rejectedDoctors));
      
      return rejectedDoctor;
    }
    throw new Error('Doctor not found in pending list');
  };

  const getPendingDoctors = () => {
    return JSON.parse(localStorage.getItem('medichain_pending_doctors') || '[]');
  };

  const getApprovedDoctors = () => {
    return JSON.parse(localStorage.getItem('medichain_approved_doctors') || '[]');
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('medichain_user');
  };

  const updateProfile = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    USER_DATABASE.updateUser(user.walletAddress, updatedData);
    localStorage.setItem('medichain_user', JSON.stringify(updatedUser));
  };

  const deleteAccount = () => {
    USER_DATABASE.deleteUser(user.walletAddress);
    logout();
  };

  // محاولة تسجيل الدخول التلقائي عند التحميل
  useEffect(() => {
    const savedUser = localStorage.getItem('medichain_user');
    const lastWallet = localStorage.getItem('medichain_last_wallet');
    
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsAuthenticated(true);
    } else if (lastWallet) {
      autoLogin(lastWallet).catch(() => {});
    }
  }, []);

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    adminLogin,
    autoLogin,
    register,
    logout,
    updateProfile,
    deleteAccount,
    approveDoctor,
    rejectDoctor,
    getPendingDoctors,
    getApprovedDoctors,
    adminSystem: ADMIN_SYSTEM,
    userDatabase: USER_DATABASE
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};