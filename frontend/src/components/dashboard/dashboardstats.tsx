export default function DashboardStats() {
  return (
    <div className="grid md:grid-cols-4 gap-6">
      {[
        'Total Medicines',
        'Warehouses',
        'Expiry Alerts',
        'Pending Orders',
      ].map((item) => (
        <div
          key={item}
          className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100"
        >
          <h3 className="text-gray-500 text-sm">{item}</h3>

          <p className="text-4xl font-black mt-3">1200</p>
        </div>
      ))}
    </div>
  );
}