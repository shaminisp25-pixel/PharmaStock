interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function RoleSelector({
  value,
  onChange,
}: Props) {
  return (
    <div className="space-y-2">
      <label className="text-sm opacity-70">
        Select Role
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3 outline-none"
      >
        <option value="Admin">Admin</option>
        <option value="Pharmacist">Pharmacist</option>
        <option value="Warehouse Staff">
          Warehouse Staff
        </option>
        <option value="Inspector">Inspector</option>
      </select>
    </div>
  );
}