export default function InventoryTable() {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left border-b">
            <th className="pb-4">Drug</th>
            <th className="pb-4">Batch</th>
            <th className="pb-4">Expiry</th>
            <th className="pb-4">Stock</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td className="py-5">Paracetamol</td>
            <td>B12345</td>
            <td>2026-02-28</td>
            <td>5000</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}