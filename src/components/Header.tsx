import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, PackageCheck, ArrowRight, Bike, ShieldCheck, UserCog, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  onOpenOrders: () => void;
  orderCount: number;
  onOrderClick: () => void;
  onTrackClick?: () => void;
  onOpenRider?: () => void;
  onOpenAdmin?: () => void;
  onOpenRoleSelector?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenOrders,
  orderCount,
  onOrderClick,
  onTrackClick,
  onOpenRider,
  onOpenAdmin,
  onOpenRoleSelector,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'হোম', href: '#home', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    { label: 'আমাদের মির্জাপুর', href: '#our-mirzapur' },
    { label: 'কীভাবে কাজ করে', href: '#how-it-works' },
    { label: 'সেবাসমূহ', href: '#services' },
    { label: 'অর্ডার', href: '#order', action: onOrderClick },
    { label: 'লাইভ ট্র্যাকিং', href: '#track', action: onTrackClick || onOrderClick },
    { label: 'যোগাযোগ', href: '#contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: (typeof navLinks)[0]) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (link.action) {
      link.action();
      return;
    }

    const element = document.querySelector(link.href);
    if (element) {
      const navOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/85 dark:bg-[#061522]/95 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/10 py-3 shadow-[0_8px_30px_rgba(15,39,59,0.06)] dark:shadow-2xl text-slate-800 dark:text-white'
          : 'bg-white/60 dark:bg-[#061522]/70 backdrop-blur-md border-b border-slate-200/40 dark:border-white/5 py-4 text-slate-800 dark:text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Identity */}
        <a
          href="#home"
          id="brand-logo-link"
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0284c7] to-[#0ea5e9] text-white flex items-center justify-center shadow-[0_4px_16px_rgba(2,132,199,0.3)] group-hover:scale-105 transition-all">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-serif group-hover:text-[#0284c7] dark:group-hover:text-[#E8E0D2] transition-colors">
              দরকার
            </span>
            <span className="text-[10px] tracking-widest uppercase text-[#C69A45] font-semibold -mt-1">
              BUY & DELIVER
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              id={`nav-link-${link.href.replace('#', '')}`}
              href={link.href}
              onClick={(e) => handleNavClick(e, link)}
              className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-white/70 dark:hover:text-white transition-colors relative py-1 hover:after:w-full after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#0284c7] dark:after:bg-[#C69A45] after:transition-all"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden sm:flex items-center gap-2">
          {/* Theme Toggle Button (Light / Dark) */}
          <button
            type="button"
            id="header-theme-toggle-btn"
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-white/75 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 backdrop-blur-md transition-all cursor-pointer"
            title={theme === 'dark' ? 'লাইট মোড অন করুন' : 'ডার্ক মোড অন করুন'}
            aria-label="থিম পরিবর্তন"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-300 transition-transform duration-300 rotate-0 hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-[#0284c7] transition-transform duration-300 rotate-0 hover:-rotate-12" />
            )}
          </button>

          {/* Subtle Role / Portal Switcher Button */}
          {onOpenRoleSelector && (
            <button
              type="button"
              id="header-role-selector-btn"
              onClick={onOpenRoleSelector}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer text-slate-600 hover:text-slate-900 dark:text-white/70 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent hover:border-slate-200 dark:hover:border-white/10"
              title="ভূমিকা ও লগইন পোর্টাল"
            >
              <UserCog className="w-3.5 h-3.5 text-[#C69A45]" />
              <span>পোর্টাল</span>
            </button>
          )}

          {/* My Orders Button */}
          <button
            type="button"
            id="header-my-orders-btn"
            onClick={onOpenOrders}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer text-slate-700 dark:text-white/90 bg-slate-100 hover:bg-slate-200 dark:bg-[#0B2233]/80 dark:hover:bg-[#0B2233] border border-slate-200 dark:border-white/10 backdrop-blur-sm"
          >
            <PackageCheck className="w-4 h-4 text-[#C69A45]" />
            <span>আমার অর্ডার</span>
            {orderCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#0284c7] text-white text-[10px] flex items-center justify-center font-bold">
                {orderCount}
              </span>
            )}
          </button>

          {/* Primary Order CTA */}
          <button
            type="button"
            id="header-primary-order-btn"
            onClick={onOrderClick}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] hover:from-[#0369a1] hover:to-[#0284c7] text-white shadow-md hover:shadow-lg hover:scale-105"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>অর্ডার করুন</span>
          </button>
        </div>

        {/* Mobile Menu & Theme Controls */}
        <div className="flex items-center gap-1.5 lg:hidden">
          {/* Mobile Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-700 dark:text-white/80 bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10"
            title="থিম পরিবর্তন"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-[#0284c7]" />}
          </button>

          <button
            type="button"
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-700 dark:text-white/80 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 cursor-pointer"
            aria-label="মেনু খুলুন"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 dark:bg-[#061522]/95 backdrop-blur-2xl border-b border-slate-200 dark:border-white/10 px-6 py-4 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link)}
              className="block py-2 text-sm font-semibold text-slate-700 dark:text-white/80 hover:text-[#0284c7] dark:hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}

          <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenOrders();
              }}
              className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-white font-semibold text-xs flex items-center justify-center gap-2"
            >
              <PackageCheck className="w-4 h-4 text-[#C69A45]" />
              <span>আমার অর্ডার ({orderCount})</span>
            </button>

            {onOpenRoleSelector && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenRoleSelector();
                }}
                className="w-full py-2 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-white/70 text-xs font-semibold flex items-center justify-center gap-2"
              >
                <UserCog className="w-4 h-4 text-[#C69A45]" />
                <span>মালিক ও রাইডার পোর্টাল</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOrderClick();
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>অর্ডার করুন</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
