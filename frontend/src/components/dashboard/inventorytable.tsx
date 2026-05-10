export default function InventoryTable() {
  return (
    <div className="overflow-hidden rounded-3xl border">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-4 text-left">Medicine</th>
            <th className="p-4 text-left">Stock</th>
            <th className="p-4 text-left">Expiry</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td className="p-4">Paracetamol</td>
            <td className="p-4">320</td>
            <td className="p-4">12/2026</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}