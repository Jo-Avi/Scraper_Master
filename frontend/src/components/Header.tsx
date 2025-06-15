import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 w-full py-4 px-4 flex items-center bg-gray-800">
      <div className="flex items-center space-x-2">
        <img src="/quantai_logo.png" alt="QuantAI Logo" style={{ height: '100px', width: 'auto' }} />
        <span className="text-white text-xl font-semibold">QuantAI</span>
      </div>
    </header>
  );
};

export default Header; 