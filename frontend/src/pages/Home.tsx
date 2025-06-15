import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Download, 
  Zap, 
  Shield, 
  Database, 
  Clock, 
  ArrowRight,
  Code,
  BarChart3,
  CheckCircle,
  ShoppingBag
} from 'lucide-react';

const Home: React.FC = () => {
  const handleGetStarted = () => {
    // Navigate to scraper page - replace with your routing logic
    window.location.href = '/scraper';
  };
  const [isVisible, setIsVisible] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      icon: Globe,
      title: 'Smart Product Search',
      desc: 'Allows users to search for any product keyword on Amazon.in. Automatically fetches relevant search results based on the query.'
    },
    {
      icon: Zap,
      title: 'Multi-Page Scraping',
      desc: 'Supports scraping across multiple Amazon pages (up to 20 by default). Collects a large number of product listings (up to 100 items or more).'
    },
    {
      icon: ShoppingBag,
      title: 'Rich Product Information',
      desc: 'Each product entry includes: Name, Price, Rating, Number of Reviews, Direct Link to Product, Product Image, Availability Status, Amazon Prime Eligibility, Discount Tag (if any).'
    },
    {
      icon: Shield,
      title: 'Robust Error Handling',
      desc: 'Automatically handles request timeouts, failed connections, and page errors. Logs any issues during scraping and continues processing remaining products.'
    },
    {
      icon: Clock,
      title: 'Rate-Limiting Friendly',
      desc: 'Uses randomized sleep delays to mimic human browsing and avoid being blocked by Amazon.'
    },
    {
      icon: Database,
      title: 'Clean Data Structure',
      desc: 'Collected data is structured into dictionaries and ready for display on a frontend, exporting to CSV/JSON, or feeding into analytics dashboards.'
    },
    {
      icon: Shield,
      title: 'Safe Web Interaction',
      desc: 'Includes request headers that simulate real user behavior, reducing the risk of detection.'
    },
    {
      icon: BarChart3,
      title: 'Ideal for Price & Trend Monitoring',
      desc: 'This scraper can be used as a backend engine for price comparison tools or daily product trend analysis.'
    }
  ];


  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden relative">
      {/* Static Background Image */}
      <img
        src="/Circle_Background_4k.png"
        alt="Background"
        className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none select-none"
        style={{ minHeight: '100vh', minWidth: '100vw' }}
        aria-hidden="true"
      />
      
      {/* Navigation */}
      <nav className="relative z-20 flex justify-between items-center px-8 py-6 bg-black/40 backdrop-blur-lg border-b border-pink-400/30 shadow-lg shadow-pink-500/10">
        <div className="flex items-center space-x-0.5">
          <img src="/quantai_logo.png" alt="QuantAI Logo" className="w-24 h-24 object-contain" />
          <div>
            <span className="text-3xl font-bold bg-gradient-to-r from-white via-white to-white bg-clip-text text-transparent drop-shadow-lg">QuantAI</span>
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <a
            href="/features"
            className="hover:text-cyan-400 transition-colors"
          >
            Features
          </a>
          <button
            onClick={handleGetStarted}
            className="px-4 py-2 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-lg hover:from-pink-600 hover:to-cyan-600 transition-all duration-300 shadow-lg shadow-pink-500/20 border border-pink-400/30"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Main Heading */}
      <header className="w-full py-1 text-center z-20 relative">
        <h1 className="text-3xl md:text-4xl font-bold tracking-wide bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-200 bg-clip-text text-transparent drop-shadow-lg">Scraper Master</h1>
      </header>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-8">
        <div className={`text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 rounded-full text-xs font-medium border border-pink-400/30 text-pink-100">
              ✨ Advanced Web Scraping Platform
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-200 bg-clip-text text-transparent leading-tight drop-shadow-lg">
            WEB SCRAPING
            <br />
          </h1>
          
          <p className="text-lg md:text-xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed">
            Extract, transform, and analyze web data with our cutting-edge scraping platform. <br/>
            Built for developers, trusted by enterprises.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button
              onClick={handleGetStarted}
              className="group px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white font-bold rounded-xl shadow-2xl hover:from-pink-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 border border-pink-400/30"
            >
              <span className="text-lg">Get Started</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-8 bg-black/40 backdrop-blur-lg border-t border-pink-400/30 shadow-lg shadow-pink-500/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-8">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700/50 text-center text-gray-400">
            <p>Powered By QuantAI</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;