export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-100 text-gray-900 min-h-screen flex items-center justify-center">
      <main className="w-full max-w-md s">{children}</main>
    </div>
  );
}
