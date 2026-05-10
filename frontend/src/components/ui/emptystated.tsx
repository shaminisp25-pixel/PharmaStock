export default function EmptyState() {
  return (
    <div className="flex min-h-[300px] items-center justify-center rounded-3xl border border-dashed border-white/10">
      <div className="text-center">
        <h3 className="text-xl font-semibold">
          No Data Found
        </h3>

        <p className="mt-2 opacity-70">
          Try adding new records.
        </p>
      </div>
    </div>
  );
}