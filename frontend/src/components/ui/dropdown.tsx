interface Props {
  children: React.ReactNode;
}

export default function Dropdown({
  children,
}: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-background p-4 shadow-xl">
      {children}
    </div>
  );
}