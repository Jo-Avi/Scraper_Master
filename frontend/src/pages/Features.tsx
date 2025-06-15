import React from 'react';
import { Globe, Zap, ShoppingBag, Shield, Clock, Database, BarChart3 } from 'lucide-react';

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

const Features: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden relative">
      <img
        src="/Circle_Background_4k.png"
        alt="Background"
        className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none select-none"
        style={{ minHeight: '100vh', minWidth: '100vw' }}
        aria-hidden="true"
      />

      {/* Header */}
      <header className="relative z-20 bg-black/40 backdrop-blur-lg border-b border-pink-400/30 shadow-lg shadow-pink-500/10 sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-0.5">
              <img src="/quantai_logo.png" alt="QuantAI Logo" className="w-24 h-24 object-contain" />
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-white to-white bg-clip-text text-transparent drop-shadow-lg">
                  QuantAI
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.location.href = '/'}
                className="px-4 py-2 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-cyan-600 transition-all shadow-lg shadow-pink-500/20 border border-pink-400/30"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-200 bg-clip-text text-transparent drop-shadow-lg">
              Why Choose <span className="bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">ScrapeMaster</span>?
            </h2>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Powerful features designed to make web scraping effortless and efficient
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl backdrop-saturate-150 border border-pink-400/10 hover:border-cyan-400/30 transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-pink-100">{feature.title}</h3>
                <p className="text-gray-300 whitespace-pre-line">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-black/40 backdrop-blur-lg border-t border-pink-400/30 mt-20 shadow-lg shadow-pink-500/10">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
            </div>
            <p className="text-gray-300 mb-2">Powered By QuantAI</p>
            <p className="text-gray-400 text-sm">
              Experience the future of product discovery with intelligent search and real-time data.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Features; 