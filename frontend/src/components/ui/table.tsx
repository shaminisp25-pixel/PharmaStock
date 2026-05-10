interface Props {
  children: React.ReactNode;
}

export default function Table({ children }: Props) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10">
      <table className="w-full text-left">
        {children}
      </table>
    </div>
  );
}