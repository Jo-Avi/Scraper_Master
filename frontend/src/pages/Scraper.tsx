import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, Star, ExternalLink, Zap, Package, AlertCircle, Loader2, TrendingUp, Filter, Grid, List, Eye, Heart, Share2, Download } from 'lucide-react';

interface Product {
  name: string;
  price: string;
  link: string;
  image: string;
  rating: string;
  review_count: string;
  availability: string;
  is_prime: boolean;
  discount: string;
}

const Scraper = () => {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [filterPrime, setFilterPrime] = useState(false);
  const [animatedProducts, setAnimatedProducts] = useState<number[]>([]);
  const [searchSuggestions] = useState(['iPhone 15', 'MacBook Pro', 'Sony Headphones', 'Samsung TV', 'Nike Shoes', 'Gaming Chair']);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState(0);
  const searchRef = useRef(null);

  const loadingSteps = [
    {
      icon: <Search className="animate-spin-slow text-cyan-400" size={40} />,
      message: 'Searching for products...'
    },
    {
      icon: <Zap className="animate-bounce text-pink-400" size={40} />,
      message: 'Connecting to Amazon...'
    },
    {
      icon: <TrendingUp className="animate-pulse text-purple-400" size={40} />,
      message: 'Analyzing product trends...'
    },
    {
      icon: <Package className="animate-bounce text-yellow-400" size={40} />,
      message: 'Almost done! Preparing results...'
    }
  ];
  const [loadingStep, setLoadingStep] = useState(0);

  // Floating particles animation
  const generateParticles = () => {
    return [...Array(20)].map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full opacity-20 animate-float"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: `${Math.random() * 10 + 5}px`,
          height: `${Math.random() * 10 + 5}px`,
          backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`,
          animationDelay: `${Math.random() * 3}s`,
          animationDuration: `${Math.random() * 3 + 2}s`
        }}
      />
    ));
  };

  // Auto-rotate suggestions
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSuggestion(prev => (prev + 1) % searchSuggestions.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [searchSuggestions.length]);

  // Animate products on load
  useEffect(() => {
    if (products.length > 0) {
      setAnimatedProducts([]);
      products.forEach((_, index) => {
        setTimeout(() => {
          setAnimatedProducts(prev => [...prev, index]);
        }, index * 100);
      });
    }
  }, [products]);

  useEffect(() => {
    if (loading) {
      setLoadingStep(0);
      const interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingSteps.length);
      }, 1200);
      return () => clearInterval(interval);
    }
  }, [loading]);

  const handleSearch = async (searchQuery?: string) => {
    const queryToUse = searchQuery || query;

    if (!queryToUse.trim()) {
      setError('Please enter a search query');
      return;
    }

    setLoading(true);
    setError('');
    setSearchPerformed(true);
    setProducts([]);
    setAnimatedProducts([]);
    setShowSuggestions(false);

    try {
      const response = await fetch(`https://scraper-master-5.onrender.com/scrape?query=${encodeURIComponent(queryToUse)}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch products');
      }

      setProducts(data);
    } catch (err: any) {
      setError('Failed to fetch products. Please check if the backend server is running.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    handleSearch(suggestion);
  };

  const sortProducts = (products: Product[]) => {
    const sorted = [...products];
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => {
          const priceA = parseFloat(a.price?.replace(/[^\d.]/g, '') || '0');
          const priceB = parseFloat(b.price?.replace(/[^\d.]/g, '') || '0');
          return priceA - priceB;
        });
      case 'price-high':
        return sorted.sort((a, b) => {
          const priceA = parseFloat(a.price?.replace(/[^\d.]/g, '') || '0');
          const priceB = parseFloat(b.price?.replace(/[^\d.]/g, '') || '0');
          return priceB - priceA;
        });
      case 'rating':
        return sorted.sort((a, b) => {
          const ratingA = parseFloat(a.rating?.match(/(\d+\.?\d*)/)?.[1] || '0');
          const ratingB = parseFloat(b.rating?.match(/(\d+\.?\d*)/)?.[1] || '0');
          return ratingB - ratingA;
        });
      default:
        return sorted;
    }
  };

  const filterProducts = (products: Product[]) => {
    if (filterPrime) {
      return products.filter(product => product.is_prime);
    }
    return products;
  };

  const formatPrice = (price: string) => {
    if (price === 'N/A' || !price) return price;
    return `₹${price}`;
  };

  const formatRating = (rating: string) => {
    if (rating === 'No rating' || !rating) return null;
    const match = rating.match(/(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : null;
  };

  const renderStars = (rating: string) => {
    const numRating = formatRating(rating);
    if (!numRating) return <span className="text-gray-400 text-sm">No rating</span>;
    
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            className={`transition-all duration-300 ${i < Math.floor(numRating) ? 'fill-yellow-400 text-yellow-400 drop-shadow-md' : 'text-gray-300'}`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1 font-medium">{numRating}</span>
      </div>
    );
  };

  const processedProducts = sortProducts(filterProducts(products));

  const handleDownloadCSV = () => {
    if (processedProducts.length === 0) {
      alert('No products to download!');
      return;
    }

    const headers = [
      "Product Name", "Price", "Link", "Image URL", "Rating",
      "Number of Reviews", "Availability", "Is Prime", "Discount"
    ];

    const csvContent = [
      headers.join(','),
      ...processedProducts.map(p => 
        `"${p.name.replace(/"/g, '""')}",` +
        `"${p.price.replace(/"/g, '""')}",` +
        `"${p.link.replace(/"/g, '""')}",` +
        `"${p.image.replace(/"/g, '""')}",` +
        `"${p.rating.replace(/"/g, '""')}",` +
        `"${p.review_count.replace(/"/g, '""')}",` +
        `"${p.availability.replace(/"/g, '""')}",` +
        `${p.is_prime ? 'Yes' : 'No'},` +
        `"${p.discount.replace(/"/g, '""')}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'amazon_products.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

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

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Hero Search Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-200 bg-clip-text text-transparent drop-shadow-lg">
            Discover Amazing Products
          </h2>
          <p className="text-lg text-gray-200 max-w-3xl mx-auto mb-8 leading-relaxed">
            Harness the power of AI to find the perfect products from Amazon with real-time data, 
            comprehensive analysis, and intelligent recommendations.
          </p>
          
          {/* Search Interface */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="relative group">
              {/* Running Lighting Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-red-500 rounded-2xl blur opacity-75 animate-pulse-slow group-hover:opacity-100 transition duration-300"></div>
              <div className="absolute -inset-1 bg-gradient-to-l from-pink-400 to-cyan-400 rounded-2xl blur opacity-60 animate-pulse-slow-reverse group-hover:opacity-100 transition duration-300" style={{animationDelay: '1.5s'}}></div>
              
              <div className="relative bg-black/40 backdrop-blur-lg rounded-2xl p-6 border border-pink-400/30 shadow-lg">
                <div className="flex gap-4 mb-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
                    <input
                      ref={searchRef}
                      type="text"
                      value={query}
                      onChange={(e) => { setQuery(e.target.value); setShowSuggestions(e.target.value.length > 0); }}
                      onKeyPress={handleKeyPress}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      placeholder={`Try searching for "${searchSuggestions[currentSuggestion]}"...`}
                      className="w-full pl-16 pr-6 py-5 bg-black/30 border border-pink-400/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none transition-all text-lg backdrop-blur-md"
                      disabled={loading}
                    />
                    
                    {/* Search Suggestions */}
                    {showSuggestions && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-black/60 backdrop-blur-lg rounded-xl border border-pink-400/30 overflow-hidden z-20 shadow-xl">
                        {searchSuggestions
                          .filter(suggestion => suggestion.toLowerCase().includes(query.toLowerCase()))
                          .map((suggestion, index) => (
                            <button
                              key={index}
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="w-full text-left px-6 py-3 text-gray-300 hover:bg-black/30 hover:text-white transition-all"
                            >
                              <Search className="inline mr-3 text-gray-500" size={16} />
                              {suggestion}
                            </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handleSearch()}
                    disabled={loading || !query.trim()}
                    className="px-8 py-5 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white rounded-xl hover:from-pink-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold text-lg flex items-center gap-3 shadow-2xl shadow-pink-500/50 border border-pink-400/30"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" size={24} />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search size={24} />
                        Search
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-300 max-w-2xl mx-auto backdrop-blur-sm">
              <AlertCircle size={20} />
              {error}
            </div>
          )}
        </div>

        {/* Controls Bar */}
        {searchPerformed && !loading && (
          <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-6 mb-8 border border-white/10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="text-gray-400" size={20} />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white text-black border border-white/20 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-400 outline-none"
                  >
                    <option value="relevance">Most Relevant</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
                
                <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterPrime}
                    onChange={(e) => setFilterPrime(e.target.checked)}
                    className="w-4 h-4 text-cyan-400 rounded focus:ring-cyan-400"
                  />
                  <Zap size={16} className="text-cyan-400" />
                  Prime Only
                </label>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-cyan-500 text-white' : 'bg-white/10 text-gray-400'}`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-cyan-500 text-white' : 'bg-white/10 text-gray-400'}`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="flex flex-col items-center justify-center gap-6">
              <div className="w-24 h-24 flex items-center justify-center mb-2">
                {loadingSteps[loadingStep].icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 animate-pulse">
                {loadingSteps[loadingStep].message}
              </h3>
              <p className="text-gray-300 text-lg">Please wait while we fetch and analyze the best products for you...</p>
            </div>
          </div>
        )}

        {/* No Results */}
        {searchPerformed && !loading && processedProducts.length === 0 && !error && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center">
              <Package className="text-white" size={40} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No Products Found</h3>
            <p className="text-gray-300 text-lg">Try adjusting your search terms or filters</p>
          </div>
        )}

        {/* Results */}
        {processedProducts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-3xl font-bold text-white mb-2">
                  Found {processedProducts.length} Amazing Products
                </h3>
                <p className="text-gray-300">Scraped from Amazon India with AI precision</p>
              </div>
            </div>

            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              : "space-y-6"
            }>
              {processedProducts.map((product, index) => (
                <div
                  key={index}
                  className={`group relative transition-all duration-500 ${
                    animatedProducts.includes(index) 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-8'
                  } ${viewMode === 'list' ? 'flex gap-6 bg-black/30 backdrop-blur-xl rounded-2xl p-6 border border-white/10' : ''}`}
                >
                  {viewMode === 'grid' ? (
                    // Grid View
                    <>
                      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400/50 to-purple-500/50 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                      <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl overflow-hidden border border-pink-400/20 group-hover:border-cyan-400/40 transition-all duration-300 shadow-lg" style={{background: 'rgba(30, 27, 46, 0.45)'}}>
                        {/* Product Image */}
                        <div className="aspect-square bg-black/30 backdrop-blur-lg rounded-2xl flex items-center justify-center p-6 relative overflow-hidden border border-pink-400/20 shadow-md">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="max-w-full max-h-full object-contain rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-md"
                              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik0xMDAgODBMMTIwIDEwMEgxMDhWMTIwSDkyVjEwMEg4MEwxMDAgODBaIiBmaWxsPSIjNkI3MjgwIi8+PHRleHQgeD0iMTAwIiB5PSIxNDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2QjcyODAiIGZvbnQtc2l6ZT0iMTIiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4=';
                              }}
                            />
                          ) : (
                            <Package className="text-gray-500" size={60} />
                          )}
                          
                          {/* Floating Action Buttons */}
                          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col gap-2">
                            <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all">
                              <Heart size={16} />
                            </button>
                            <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all">
                              <Share2 size={16} />
                            </button>
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="p-6">
                          <h4 className="font-semibold text-white text-sm leading-6 mb-4 line-clamp-2 min-h-[3rem] group-hover:text-cyan-400 transition-colors">
                            {product.name}
                          </h4>

                          {/* Price and Discount */}
                          <div className="mb-4">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                                {formatPrice(product.price)}
                              </span>
                              {product.discount && product.discount !== 'No discount' && (
                                <span className="text-xs bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full font-semibold">
                                  {product.discount}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Rating and Reviews */}
                          <div className="mb-4">
                            {renderStars(product.rating)}
                            {product.review_count && product.review_count !== '0' && (
                              <p className="text-xs text-gray-400 mt-1">
                                {product.review_count} reviews
                              </p>
                            )}
                          </div>

                          {/* Features */}
                          <div className="flex items-center gap-3 mb-6">
                            {product.is_prime && (
                              <div className="flex items-center gap-1 text-xs bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-3 py-1 rounded-full font-semibold">
                                <Zap size={12} />
                                Prime
                              </div>
                            )}
                            {product.availability && product.availability !== 'Unknown' && (
                              <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full border border-green-500/30">
                                {product.availability}
                              </span>
                            )}
                          </div>

                          {/* Action Button */}
                          <a
                            href={product.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white py-3 px-4 rounded-xl hover:from-pink-600 hover:to-cyan-600 transition-all font-semibold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-2xl hover:shadow-pink-500/40 border border-pink-400/30"
                          >
                            <Eye size={16} />
                            View on Amazon
                            <ExternalLink size={14} />
                          </a>
                        </div>
                      </div>
                    </>
                  ) : (
                    // List View
                    <>
                      <div className="w-48 h-48 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center flex-shrink-0">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="max-w-full max-h-full object-contain"
                          />
                        ) : (
                          <Package className="text-gray-500" size={60} />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white text-lg mb-3 line-clamp-2">
                          {product.name}
                        </h4>
                        
                        <div className="flex items-center gap-4 mb-3">
                          <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                            {formatPrice(product.price)}
                          </span>
                          {renderStars(product.rating)}
                        </div>
                        
                        <div className="flex items-center gap-3 mb-4">
                          {product.is_prime && (
                            <div className="flex items-center gap-1 text-xs bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-3 py-1 rounded-full">
                              <Zap size={12} />
                              Prime
                            </div>
                          )}
                          {product.discount && product.discount !== 'No discount' && (
                            <span className="text-xs bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full">
                              {product.discount}
                            </span>
                          )}
                        </div>
                        
                        <a
                          href={product.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white py-3 px-4 rounded-xl hover:from-pink-600 hover:to-cyan-600 transition-all font-semibold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-2xl hover:shadow-pink-500/40 border border-pink-400/30"
                        >
                          <Eye size={16} />
                          View on Amazon
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {processedProducts.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={handleDownloadCSV}
              className="px-4 py-2 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-cyan-600 transition-all shadow-lg shadow-pink-500/20 border border-pink-400/30 flex items-center justify-center space-x-2 mx-auto"
            >
              <Download size={24} />
              <span>Download Results as CSV</span>
            </button>
          </div>
        )}
      </main>

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

export default Scraper;
