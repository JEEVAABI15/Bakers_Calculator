import React from 'react';
import { Navigation } from './Navigation';
import { ActivePage } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activePage: ActivePage;
  onPageChange: (page: ActivePage) => void;
}

export function Layout({ children, activePage, onPageChange }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <Navigation activePage={activePage} onPageChange={onPageChange} />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}