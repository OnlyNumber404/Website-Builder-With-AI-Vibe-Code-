import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/home/HeroSection';
import AboutIntroSection from '@/components/home/AboutIntroSection';
import DemoSimulator from '@/components/home/DemoSimulator';
import ValuePropGrid from '@/components/home/ValuePropGrid';
import ShowcaseCatalog from '@/components/home/ShowcaseCatalog';
import Testimonials from '@/components/home/Testimonials';
import PricingSection from '@/components/home/PricingSection';
import CommunityBanner from '@/components/common/CommunityBanner';

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <AboutIntroSection />
        <DemoSimulator />
        <ValuePropGrid />
        <ShowcaseCatalog />
        <Testimonials />
        <PricingSection />
        <CommunityBanner />
      </main>
      <Footer />
    </div>
  );
}
