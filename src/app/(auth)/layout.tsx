export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <main className="mx-auto sm:max-w-[336px] xl:max-w-[1100px] mb-10">{children}</main>
    </div>
  );
}
