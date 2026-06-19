export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <main className="mx-auto mobile:max-w-[429px] pc:max-w-[1100px] mb-10">
        {children}
      </main>
    </div>
  );
}
