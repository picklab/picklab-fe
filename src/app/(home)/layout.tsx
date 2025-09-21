import Footer from '@/components/common/Footer/Footer';

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <main className="mx-auto pc:max-w-[1100px] mobile:max-w-[335px] mb-10">{children}</main>
      <Footer className="mobile:hidden" />
    </div>
  );
}
