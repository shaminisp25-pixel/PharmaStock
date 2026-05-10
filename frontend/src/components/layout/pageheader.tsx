interface Props {
  title: string;
}

export default function PageHeader({ title }: Props) {
  return (
    <div className="mb-6">
      <h1 className="text-4xl font-bold">{title}</h1>
    </div>
  );
}