import { ReactNode } from "react";

interface MobilePageProps {
  children: ReactNode;
}

const MobilePage = ({ children }: MobilePageProps) => {
  return (
    <div className="max-w-2xl mx-auto mb-8">
      {children}
    </div>
  );
};

export default MobilePage;