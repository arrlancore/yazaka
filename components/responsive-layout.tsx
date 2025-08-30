"use client";
import { usePathname } from "next/navigation";
import Header from "./header";
import Footer from "./footer";
import BottomNav from "./bottom-nav";

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export default function ResponsiveLayout({ 
  children, 
  showFooter = true 
}: ResponsiveLayoutProps) {
  const pathname = usePathname();
  
  // Don't show layout components on admin pages
  const isAdminPage = pathname?.startsWith('/admin');
  
  if (isAdminPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Desktop Header - Hidden on mobile */}
      <div className="hidden md:block">
        <Header />
      </div>
      
      {/* Main Content */}
      <div className="flex-1">
        {children}
      </div>
      
      {/* Footer - Only on desktop, or if explicitly requested */}
      {showFooter && (
        <div className="hidden md:block">
          <Footer />
        </div>
      )}
      
      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}