import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function PageContainer({
  children,
  scrollable = true,
  withContentTemplate = true
}: {
  children: React.ReactNode;
  scrollable?: boolean;
  withContentTemplate?: boolean;
}) {
  const heightScrollArea = withContentTemplate
    ? 'h-[calc(100dvh-52px)]'
    : 'h-[calc(100dvh-0px)]';
  const content = () =>
    withContentTemplate ? (
      <div className="h-full p-4 md:px-8">{children}</div>
    ) : (
      children
    );

  const contentWithScroll = () =>
    scrollable ? (
      <ScrollArea className={heightScrollArea}>{content()}</ScrollArea>
    ) : (
      content()
    );

  return contentWithScroll();
}
