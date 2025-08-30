import { ReactNode } from "react";
import HeaderMobilePageClient from "./header-mobile-page-client";

interface HeaderMobilePageProps {
  title: string;
  subtitle?: string;
  backUrl?: string;
  rightContent?: ReactNode;
  className?: string;
}

const HeaderMobilePage = ({
  title,
  subtitle,
  backUrl,
  rightContent,
  className,
}: HeaderMobilePageProps) => {
  return (
    <HeaderMobilePageClient
      title={title}
      subtitle={subtitle}
      backUrl={backUrl}
      rightContent={rightContent}
      className={className}
    />
  );
};

export default HeaderMobilePage;