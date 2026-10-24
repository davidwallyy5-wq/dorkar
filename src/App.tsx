import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { QuickActionSection } from './components/QuickActionSection';
import { OurMirzapurSection } from './components/OurMirzapur/OurMirzapurSection';
import { StorySection } from './components/StorySection';
import { FullWidthBanner } from './components/FullWidthBanner';
import { HowItWorks } from './components/HowItWorks';
import { WhatCanWeGet } from './components/WhatCanWeGet';
import { WhyDorkar } from './components/WhyDorkar';
import { DeliveryVisual } from './components/DeliveryVisual';
import { ReviewsMarquee } from './components/ReviewsMarquee';
import { BrandStatement } from './components/BrandStatement';
import { FaqSection } from './components/FaqSection';
import { FinalCTA } from './components/FinalCTA';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { MyOrdersModal } from './components/MyOrdersModal';
import { PolicyModal } from './components/PolicyModal';
import { AdminPanel } from './components/AdminPanel';
import { RiderPortal } from './components/RiderPortal';
import { RoleEntryModal } from './components/RoleEntryModal';
import { MobileNav } from './components/MobileNav';
import { MakroshaChatbot } from './components/MakroshaChatbot';
import { Order } from './types';
import { getCustomerOrderIds, subscribeToOrder } from './services/orderService';

export default function App() {
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [heroActiveTab, setHeroActiveTab] = useState<'order' | 'track'>('order');
  const [activeTrackId, setActiveTrackId] = useState<string>('');
  const [heroInitialItems, setHeroInitialItems] = useState<string>('');
  const [heroInitialCategory, setHeroInitialCategory] = useState<string>('');
  const [isMyOrdersOpen, setIsMyOrdersOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isRiderOpen, setIsRiderOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [policyType, setPolicyType] = useState<'privacy' | 'terms' | null>(null);

  // Check URL parameters for direct deep-linking (e.g. from push notifications)
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const panel = urlParams.get('panel');
      const orderId = urlParams.get('orderId');

      if (panel === 'admin') {
        setIsAdminOpen(true);
      } else if (panel === 'rider') {
        setIsRiderOpen(true);
      } else if (orderId) {
        setHeroActiveTab('track');
        setActiveTrackId(orderId);
      }

      // Register PWA service worker if supported
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch((err) => {
          console.warn('SW registration info:', err);
        });
      }
    } catch (e) {
      console.warn('URL param parse error:', e);
    }
  }, []);

  // Load and listen to customer's own placed orders from Firestore
  useEffect(() => {
    const savedIds = getCustomerOrderIds();
    if (savedIds.length === 0) return;

    const unsubscribers = savedIds.map((id) =>
      subscribeToOrder(id, (order) => {
        if (order) {
          setCustomerOrders((prev) => {
            const filtered = prev.filter((o) => o.id !== order.id);
            return [order, ...filtered].sort((a, b) =>
              (b.createdAt || '').localeCompare(a.createdAt || '')
            );
          });
        }
      })
    );

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, []);

  const handleOrderPlaced = (newOrder: Order) => {
    setCustomerOrders((prev) => [newOrder, ...prev.filter((o) => o.id !== newOrder.id)]);
  };

  const scrollToHeroOrder = (itemsText?: string, categoryText?: string) => {
    setHeroActiveTab('order');
    if (itemsText) setHeroInitialItems(itemsText);
    if (categoryText) setHeroInitialCategory(categoryText);

    // Scroll to top/hero if customer has scrolled down
    if (window.scrollY > 150) {
      const el = document.getElementById('home');
      if (el) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const scrollToHeroTrack = (orderId?: string) => {
    setHeroActiveTab('track');
    if (orderId) setActiveTrackId(orderId);

    // Scroll to top/hero if customer has scrolled down
    if (window.scrollY > 150) {
      const el = document.getElementById('home');
      if (el) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works');
    if (el) {
      const navOffset = 70;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const scrollToServices = () => {
    const el = document.getElementById('services');
    if (el) {
      const navOffset = 70;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) {
      const navOffset = 70;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#061522] text-slate-900 dark:text-white flex flex-col selection:bg-[#C69A45] selection:text-[#061522] font-sans antialiased transition-colors duration-300">
      {/* 1. STICKY HEADER */}
      <Header
        onOpenOrders={() => setIsMyOrdersOpen(true)}
        orderCount={customerOrders.length}
        onOrderClick={() => scrollToHeroOrder()}
        onTrackClick={() => scrollToHeroTrack()}
        onOpenRider={() => setIsRiderOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenRoleSelector={() => setIsRoleModalOpen(true)}
      />

      {/* MAIN VERTICAL SECTIONS */}
      <main className="flex-1 pb-16 lg:pb-0">
        {/* TOP SECTION: HERO WITH COMBINED ORDER WIZARD & TRACK INTERFACE */}
        <Hero
          activeTab={heroActiveTab}
          onTabChange={(tab) => setHeroActiveTab(tab)}
          initialItems={heroInitialItems}
          initialCategory={heroInitialCategory}
          activeTrackId={activeTrackId}
          onOrderPlaced={handleOrderPlaced}
          onHowItWorksClick={scrollToHowItWorks}
        />

        {/* SECTION 2: QUICK ACTION AREA (Primary: অর্ডার করুন, Secondary: ট্র্যাক করুন, Third: আমার অর্ডার) */}
        <QuickActionSection
          onOrderClick={() => scrollToHeroOrder()}
          onTrackClick={() => scrollToHeroTrack()}
          onMyOrdersClick={() => setIsMyOrdersOpen(true)}
          orderCount={customerOrders.length}
        />

        {/* SECTION 3: আমাদের মির্জাপুর — INTERACTIVE ILLUSTRATED WORLD */}
        <OurMirzapurSection
          onOrderClick={() => scrollToHeroOrder()}
          onTrackClick={() => scrollToHeroTrack()}
          activeOrder={customerOrders.length > 0 ? customerOrders[0] : null}
          userCoords={
            customerOrders.length > 0 && customerOrders[0].latitude && customerOrders[0].longitude
              ? { latitude: customerOrders[0].latitude, longitude: customerOrders[0].longitude }
              : null
          }
        />

        {/* SECTION 4: STORY SECTION */}
        <StorySection />

        {/* SECTION 4: FULL WIDTH CINEMATIC IMAGE BANNER */}
        <FullWidthBanner />

        {/* SECTION 5: HOW IT WORKS (3 Steps with Cute Characters) */}
        <HowItWorks />

        {/* SECTION 6: SERVICES ("যা দরকার, বলুন।") */}
        <WhatCanWeGet
          onSelectCategory={(categoryTitle, samplePrompt) =>
            scrollToHeroOrder(samplePrompt || categoryTitle, categoryTitle)
          }
        />

        {/* SECTION 7: WHY DORKAR (Specialty & Bento Grid) */}
        <WhyDorkar />

        {/* SECTION 8: DELIVERY VISUAL / STORY */}
        <DeliveryVisual />

        {/* SECTION 9: REVIEWS MARQUEE (Single Infinite Loop Right -> Left) */}
        <ReviewsMarquee />

        {/* SECTION 10: BRAND STATEMENT */}
        <BrandStatement />

        {/* SECTION 11: FAQ (Frequently Asked Questions) */}
        <FaqSection />

        {/* SECTION 12: FINAL CTA */}
        <FinalCTA onOrderClick={() => scrollToHeroOrder()} />

        {/* SECTION 13: SUPPORT & CONTACT */}
        <ContactSection />
      </main>

      {/* FLOATING "দরকার সহায়ক" CHATBOT ASSISTANT (Requirement 27) */}
      <MakroshaChatbot
        onOpenOrder={() => scrollToHeroOrder()}
        onOpenTrack={() => scrollToHeroTrack()}
      />

      {/* FOOTER */}
      <Footer
        onOpenPolicy={(type) => setPolicyType(type)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenRider={() => setIsRiderOpen(true)}
        onOpenRoleSelector={() => setIsRoleModalOpen(true)}
      />

      {/* MOBILE BOTTOM NAVIGATION */}
      <MobileNav
        onOrderClick={() => scrollToHeroOrder()}
        onTrackClick={() => scrollToHeroTrack()}
        onServicesClick={scrollToServices}
        onContactClick={scrollToContact}
      />

      {/* MY ORDERS MODAL */}
      <MyOrdersModal
        isOpen={isMyOrdersOpen}
        onClose={() => setIsMyOrdersOpen(false)}
        orders={customerOrders}
        onSelectOrderToTrack={(orderId) => {
          setIsMyOrdersOpen(false);
          scrollToHeroTrack(orderId);
        }}
      />

      {/* POLICY MODAL */}
      <PolicyModal
        isOpen={policyType !== null}
        type={policyType}
        onClose={() => setPolicyType(null)}
      />

      {/* RIDER PORTAL MODAL */}
      <RiderPortal
        isOpen={isRiderOpen}
        onClose={() => setIsRiderOpen(false)}
        onOpenAdmin={() => {
          setIsRiderOpen(false);
          setIsAdminOpen(true);
        }}
      />

      {/* ADMIN DASHBOARD MODAL */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onOpenRiderPortal={() => {
          setIsAdminOpen(false);
          setIsRiderOpen(true);
        }}
      />

      {/* ROLE ENTRY SYSTEM MODAL */}
      <RoleEntryModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        onSelectCustomer={() => scrollToHeroOrder()}
        onSelectRider={() => setIsRiderOpen(true)}
        onSelectAdmin={() => setIsAdminOpen(true)}
      />
    </div>
  );
}
