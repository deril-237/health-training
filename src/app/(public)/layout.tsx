import { Header } from "./_components/Header";
import { Footer } from "./_components/Footer";

export default function PublicLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      {/* Top Bar */}
      <div className="bg-primary text-primary-content">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-center px-4">
          <span className="text-sm font-semibold tracking-wide">
            KESMONDS INTERNATIONAL UNIVERSITY
          </span>
        </div>
      </div>

      {/* Header */}
      <Header />

      {/* Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
