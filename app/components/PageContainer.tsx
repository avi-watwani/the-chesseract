import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <div className={`pt-24 min-h-screen ${className}`}>
      {children}
    </div>
  );
} 