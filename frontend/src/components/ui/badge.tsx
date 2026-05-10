interface Props {
  label: string;
}

export default function Badge({ label }: Props) {
  return (
    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
      {label}
    </span>
  );
}