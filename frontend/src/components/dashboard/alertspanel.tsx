export default function AlertsPanel() {
  return (
    <div className="bg-red-50 border border-red-200 rounded-3xl p-8">
      <h2 className="text-2xl font-bold text-red-600">
        Expiry Alerts
      </h2>

      <p className="mt-4 text-gray-700">
        24 medicine batches are nearing expiry.
      </p>
    </div>
  );
}