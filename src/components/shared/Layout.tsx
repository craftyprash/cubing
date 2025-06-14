import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import IntroModal from './IntroModal';
import { Analytics } from "@vercel/analytics/react"


const Layout: React.FC = () => {
  const [showIntro, setShowIntro] = useState(false);

  // Check if this is the first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem('craftycubing-visited');
    if (!hasVisited) {
      setShowIntro(true);
      localStorage.setItem('craftycubing-visited', 'true');
    }
  }, []);

  const handleShowIntro = () => {
    setShowIntro(true);
  };

  const handleCloseIntro = () => {
    setShowIntro(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header onShowIntro={handleShowIntro} />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <IntroModal isOpen={showIntro} onClose={handleCloseIntro} />
      <Analytics />
    </div>
  );
};

export default Layout;