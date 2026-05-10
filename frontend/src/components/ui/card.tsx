interface Props {
  children: React.ReactNode;
}

export default function Card({ children }: Props) {
  return (
    <div className="glass-card rounded-3xl p-6">
      {children}
    </div>
  );
}