export default function Features() {
  const features = [
    {
      title: 'CSV/XLSX Upload',
      desc: 'Import bulk pharmaceutical inventory with validation checks.',
    },
    {
      title: 'Barcode Integration',
      desc: 'Scan medicines instantly for warehouse intake and dispatch.',
    },
    {
      title: 'Expiry Monitoring',
      desc: 'Realtime alerts for expired and near-expiry medicines.',
    },
    {
      title: 'Temperature Tracking',
      desc: 'Track cold storage and temperature-sensitive medicine batches.',
    },
    {
      title: 'Regulatory Reports',
      desc: 'Generate GMP and CDSCO-compliant export reports.',
    },
    {
      title: 'Warehouse Analytics',
      desc: 'Visual insights into inventory movement and stock health.',
    },
  ];
    return (
    <section id="features" className="py-24 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-5xl font-black text-[#02152f]">
            Powerful Pharma Features
          </h2>

          <p className="mt-6 text-lg text-gray-600 leading-relaxed">
            Enterprise-grade pharmaceutical inventory management with
            intelligent automation and realtime analytics.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-[28px] p-8 border border-gray-100 shadow-lg hover:-translate-y-2 transition"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 mb-6" />

              <h3 className="text-2xl font-bold text-[#02152f]">
                {feature.title}
              </h3>

              <p className="mt-4 text-gray-600 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}