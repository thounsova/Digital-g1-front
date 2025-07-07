export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body className="bg-gray-900 text-white min-h-screen">
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
