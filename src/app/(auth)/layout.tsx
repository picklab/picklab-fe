export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <main className="mx-auto pc:max-w-[1100px] mobile:max-w-[336px] mb-10">{children}</main>
    </div>
  );
}
