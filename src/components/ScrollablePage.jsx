// src/components/ScrollablePage.jsx
import React from 'react';

const ScrollablePage = ({ children }) => {
  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      {children}
    </div>
  );
};

export default ScrollablePage;