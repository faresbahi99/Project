import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Web3Provider, useWeb3 } from './contexts/Web3Context';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import Features from './components/Features/Features';
import HowItWorks from './components/HowItWorks/HowItWorks';
import About from './components/About/About';
import Contact from './components/Contact/Contact';
import Testimonials from './components/Testimonials/Testimonials';
import CTA from './components/CTA/CTA';
import Footer from './components/Footer/Footer';
import LoginModal from './components/Auth/LoginModal';
import PatientDashboard from './components/Dashboard/PatientDashboard';
import DoctorDashboard from './components/Dashboard/DoctorDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import Profile from './components/Profile/Profile';
import './index.css';

// مكون الصفحة الرئيسية
const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="home-page">
      <Hero />
      <Features />
      <HowItWorks />
      <About />
      <Testimonials />
      <Contact />
      {!isAuthenticated && <CTA />}
    </div>
  );
};

// مكون التطبيق الداخلي
function AppContent() {
  const { isAuthenticated, user } = useAuth();
  const { isConnected } = useWeb3();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [loginAction, setLoginAction] = useState('connect');

  // التعامل مع hash changes للروابط
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      
      if (hash === 'profile' && isAuthenticated) {
        setCurrentView('profile');
      } else if (hash === 'dashboard' && isAuthenticated) {
        setCurrentView('dashboard');
      } else if (['features', 'how-it-works', 'about', 'contact', 'testimonials'].includes(hash)) {
        setCurrentView('home');
        // الانتقال إلى القسم المطلوب بعد تحديث الواجهة
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        setCurrentView('home');
        // الانتقال إلى الأعلى إذا كان الهاش home أو فارغ
        if (hash === 'home' || hash === '') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // معالجة الهاش الحالي عند التحميل

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [isAuthenticated]);

  const handleConnectWallet = (action = 'connect') => {
    setLoginAction(action);
    setShowLoginModal(true);
  };

  // إذا كان المستخدم أدمن
  if (isAuthenticated && user?.isAdmin) {
    return (
      <div className="App">
        <Header onConnectWallet={handleConnectWallet} />
        <AdminDashboard />
        <Footer />
        {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
      </div>
    );
  }

  // إذا كان المستخدم طبيباً معتمداً
  if (isAuthenticated && user?.role === 'doctor' && user?.approvalStatus === 'approved') {
    return (
      <div className="App">
        <Header onConnectWallet={handleConnectWallet} />
        <DoctorDashboard />
        <Footer />
        {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
      </div>
    );
  }

  // إذا كان المستخدم طبيباً في انتظار الموافقة
  if (isAuthenticated && user?.role === 'doctor' && user?.approvalStatus !== 'approved') {
    return (
      <div className="App">
        <Header onConnectWallet={handleConnectWallet} />
        <Profile />
        <Footer />
        {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
      </div>
    );
  }

  // إذا كان المستخدم مسجل الدخول وعرض البروفايل
  if (isAuthenticated && user && currentView === 'profile') {
    return (
      <div className="App">
        <Header onConnectWallet={handleConnectWallet} />
        <Profile />
        <Footer />
        {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
      </div>
    );
  }

  // إذا كان المستخدم مسجل الدخول وعرض Dashboard
  if (isAuthenticated && user && currentView === 'dashboard') {
    return (
      <div className="App">
        <Header onConnectWallet={handleConnectWallet} />
        {user.role === 'patient' && <PatientDashboard />}
        {user.role === 'doctor' && user.approvalStatus === 'approved' && <DoctorDashboard />}
        <Footer />
        {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
      </div>
    );
  }

  // إذا كان المستخدم مسجل الدخول ولكن في الصفحة الرئيسية
  if (isAuthenticated && user) {
    return (
      <div className="App">
        <Header onConnectWallet={handleConnectWallet} />
        {user.role === 'patient' && <PatientDashboard />}
        {user.role === 'doctor' && user.approvalStatus === 'approved' && <DoctorDashboard />}
        {user.role === 'doctor' && user.approvalStatus !== 'approved' && <Profile />}
        <Footer />
        {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
      </div>
    );
  }

  // إذا لم يكن مسجل الدخول، اعرض الصفحة الرئيسية
  return (
    <div className="App">
      <Header onConnectWallet={handleConnectWallet} />
      <HomePage />
      <Footer />
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </div>
  );
}

// مكون التطبيق الرئيسي مع Providers
function App() {
  return (
    <Web3Provider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Web3Provider>
  );
}

export default App;