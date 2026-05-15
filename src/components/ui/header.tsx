type AppHeaderProps = {
  title: string;
  actions?: React.ReactNode;
};

export function Header({ title, actions }: AppHeaderProps) {
  return (
    <header className="flex items-center justify-between">
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>

      <div className="flex items-center gap-2">{actions}</div>
    </header>
  );
}
