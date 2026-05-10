interface Props {
  children: React.ReactNode;
}

export default function Modal({ children }: Props) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="glass-card rounded-3xl p-8">
        {children}
      </div>
    </div>
  );
}