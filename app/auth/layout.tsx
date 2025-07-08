export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className="bg-gray-100 text-gray-900 min-h-screen flex items-center justify-center">
        <main className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
          {children}
        </main>
      </body>
    </html>
  );
}
