export default function CTA() {
  return (
    <section className="py-24 px-6 lg:px-10">
      <div className="max-w-6xl mx-auto rounded-[40px] bg-gradient-to-r from-[#052c65] to-[#0a4db3] text-white p-14 lg:p-20 text-center shadow-2xl">
        <h2 className="text-5xl font-black leading-tight">
          Upgrade Your Pharmaceutical Warehouse Operations
        </h2>

        <p className="mt-8 text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
          Streamline inventory tracking, compliance reporting,
          warehouse management and realtime analytics with PharmaStock.
        </p>

        <button className="mt-10 bg-white text-[#052c65] hover:scale-105 transition px-10 py-5 rounded-2xl font-bold text-lg shadow-xl">
          Launch PharmaStock
        </button>
      </div>
    </section>
  );
}