export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold mb-6">
        Pharma Stock SaaS
      </h1>

      <p className="text-gray-400 text-xl mb-8">
        AI-powered pharma inventory platform
      </p>

      <button className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:scale-105 transition">
        Get Started
      </button>
    </main>
  );
}