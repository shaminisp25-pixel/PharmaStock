import Navbar from '@/components/home/navbar';
import Hero from '@/components/home/hero';
import Features from '@/components/home/features';
import CTA from '@/components/home/cta';

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#F6F8FC] text-[#0F172A] dark:bg-[#050816] dark:text-white transition-colors duration-300">
      <Navbar />
      <Hero />
      <Features />
      <CTA />
    </main>
  );
}