import React from 'react';
import { Hero } from '@/components/Hero';
import { Installation } from '@/components/Installation';
import { Usage } from '@/components/Usage';
import { Variants } from '@/components/Variants';
import { Features } from '@/components/Features';
import { Comparison } from '@/components/Comparison';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <div className="wrapper">
      <main className="container">
        <Hero />
        <div className="content">
          <Installation />
          <Usage />
          <Variants />
          <Features />
          <Comparison />
        </div>
      </main>
      <Footer />
    </div>
  );
}
