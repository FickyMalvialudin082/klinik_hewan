import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Sticky header navbar */}
      <Navbar />
      
      {/* Main viewport */}
      <main className="flex-grow">
        <Outlet />
      </main>
      
      {/* Footer information */}
      <Footer />
    </div>
  );
};

export default PublicLayout;
