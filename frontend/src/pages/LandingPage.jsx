import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Stats from '../components/Stats';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

const LandingPage = () => {
  return (
    <>
      <SEO 
        title="Premium Gourmet Tiffin Services" 
        description="Experience the finest tiffin subscription service in India. Nutritious, chef-prepared meals delivered fresh to your doorstep."
      />
      <Navbar />
      <Hero />
      <Features />
      <Stats />
      <Testimonials />
      <Footer />
    </>
  );
};

export default LandingPage;

