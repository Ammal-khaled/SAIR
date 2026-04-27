import React from 'react';

export const Badge = ({ children, variant = "gray", className = "" }) => {
  const styles = {
    gray: "bg-gray-100 text-gray-700",
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    blue: "bg-blue-100 text-blue-700",
  };

  return (
    <span className={`px-2 py-1 text-xs rounded font-medium ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;