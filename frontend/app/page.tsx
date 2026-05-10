import navbar from '@/components/home/navbar';
import hero from '@/components/home/hero';
import features from '@/components/home/features';
import cta from '@/components/home/cta';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f5f9ff] overflow-hidden">
      <navbar />
      <hero />
      <features />
      <cta />
    </main>
  );
}