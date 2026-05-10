import ThemeToggle from 'frontend/src/components/layout/ThemeToggle';

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      <ThemeToggle />
    </div>
  );
}