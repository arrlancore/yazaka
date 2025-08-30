import { Metadata } from "next";
import MobilePage from "@/components/ui/mobile-page";
import HeaderMobilePage from "@/components/ui/header-mobile-page";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Book, ArrowLeft, Play, Pause } from "lucide-react";

export const metadata: Metadata = {
  title: "Style Guide | Bekhair",
  description: "Design system and style guide for consistent UI across Bekhair app",
};

const StyleGuidePage = () => {
  return (
    <>
      <MobilePage>
        <HeaderMobilePage
          title="Style Guide"
          subtitle="UI Design System"
          backUrl="/"
          rightContent={
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-white/20"
            >
              <Search size={20} />
            </Button>
          }
        />

        <div className="px-4 space-y-6 sm:container sm:px-0 sm:max-w-2xl sm:mx-auto">
          {/* Layout Pattern */}
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-bold">Layout Pattern</h2>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-muted rounded-lg">
                <code className="text-xs">
                  {`<MobilePage>
  <HeaderMobilePage 
    title="Page Title" 
    subtitle="Optional subtitle" 
    backUrl="/previous" 
  />
  <!-- Page Content -->
</MobilePage>`}
                </code>
              </div>
              <p className="text-muted-foreground">
                All pages use this consistent layout: MobilePage wrapper + HeaderMobilePage for navigation
              </p>
            </div>
          </Card>

          {/* Colors */}
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-bold">Color System</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-12 bg-gradient-to-r from-primary to-primary-light rounded-lg"></div>
                <p className="text-xs font-medium">Primary Gradient Header</p>
              </div>
              <div className="space-y-2">
                <div className="h-12 bg-gradient-to-br from-primary/10 via-background to-primary/10 rounded-lg border"></div>
                <p className="text-xs font-medium">Content Card Background</p>
              </div>
              <div className="space-y-2">
                <div className="h-12 bg-background rounded-lg border"></div>
                <p className="text-xs font-medium">Background</p>
              </div>
              <div className="space-y-2">
                <div className="h-12 bg-muted rounded-lg"></div>
                <p className="text-xs font-medium">Muted Background</p>
              </div>
            </div>
          </Card>

          {/* Header Examples */}
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-bold">Header Variations</h2>
            
            {/* Example 1: Title + Subtitle */}
            <div className="space-y-2">
              <div className="bg-gradient-to-r from-primary to-primary-light text-primary-foreground p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <ArrowLeft size={16} />
                    <div className="min-h-[2rem] flex flex-col justify-center">
                      <h3 className="text-sm font-bold leading-tight">1. Al-Fatihah</h3>
                      <div className="text-xs opacity-80 leading-tight">الفاتحة • Pembukaan</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs opacity-80">Makkiyah • 7 Ayat</span>
                    <Book size={14} />
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Surah Detail Header Pattern</p>
            </div>

            {/* Example 2: Title Only */}
            <div className="space-y-2">
              <div className="bg-gradient-to-r from-primary to-primary-light text-primary-foreground p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <ArrowLeft size={16} />
                    <div className="min-h-[2rem] flex flex-col justify-center">
                      <h3 className="text-sm font-bold leading-tight">Al-Qur'an</h3>
                      <div className="text-xs opacity-80 leading-tight">&nbsp;</div>
                    </div>
                  </div>
                  <Search size={16} />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Quran Page Header Pattern</p>
            </div>
          </Card>

          {/* Button Examples */}
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-bold">Button Styles</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Button className="w-full">Primary Button</Button>
                <p className="text-xs text-muted-foreground">Main actions</p>
              </div>
              <div className="space-y-2">
                <Button variant="outline" className="w-full">Outline Button</Button>
                <p className="text-xs text-muted-foreground">Secondary actions</p>
              </div>
              <div className="space-y-2">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Play size={16} />
                </Button>
                <p className="text-xs text-muted-foreground">Icon buttons</p>
              </div>
              <div className="space-y-2">
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/20 bg-primary text-primary-foreground">
                  <Pause size={16} />
                </Button>
                <p className="text-xs text-muted-foreground">Header icon buttons</p>
              </div>
            </div>
          </Card>

          {/* Card Examples */}
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-bold">Card Patterns</h2>
            
            {/* Content Card */}
            <div className="space-y-2">
              <Card className="border-none sm:border overflow-hidden bg-gradient-to-br from-primary/10 via-background to-primary/10 shadow-none sm:shadow-lg rounded-b-[2rem] p-0">
                <CardContent className="p-4">
                  <p className="text-sm">Content card with gradient background</p>
                </CardContent>
              </Card>
              <p className="text-xs text-muted-foreground">Main content cards (Surah detail)</p>
            </div>

            {/* Regular Card */}
            <div className="space-y-2">
              <Card className="p-4">
                <p className="text-sm">Regular card with border</p>
              </Card>
              <p className="text-xs text-muted-foreground">Secondary content cards</p>
            </div>

            {/* Mobile-first Card */}
            <div className="space-y-2">
              <Card className="border-none shadow-none rounded-none sm:border sm:shadow-sm sm:rounded-2xl p-4">
                <p className="text-sm">Mobile-first responsive card</p>
              </Card>
              <p className="text-xs text-muted-foreground">Mobile-optimized cards</p>
            </div>
          </Card>

          {/* Spacing & Typography */}
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-bold">Typography & Spacing</h2>
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold mb-2">Heading 1</h1>
                <h2 className="text-xl font-bold mb-2">Heading 2</h2>
                <h3 className="text-lg font-bold mb-2">Heading 3</h3>
                <p className="text-base mb-2">Body text - regular paragraph content</p>
                <p className="text-sm text-muted-foreground mb-2">Small text - metadata, descriptions</p>
                <p className="text-xs opacity-80">Extra small - subtle information</p>
              </div>
              
              <div className="space-y-2 pt-4 border-t">
                <p className="text-sm font-medium">Consistent spacing:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Container: <code>px-4 space-y-4 sm:px-0 sm:max-w-2xl sm:mx-auto</code></li>
                  <li>• Cards: <code>p-4</code> or <code>p-6</code></li>
                  <li>• Components: <code>space-x-2</code>, <code>space-y-4</code></li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Design Principles */}
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-bold">Design Principles</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium">Mobile-First</p>
                  <p className="text-muted-foreground">Design for mobile, enhance for desktop with <code>sm:</code> prefixes</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium">Native Feel</p>
                  <p className="text-muted-foreground">Rounded corners, gradients, shadows for app-like experience</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium">Consistent Layout</p>
                  <p className="text-muted-foreground">All pages use MobilePage + HeaderMobilePage pattern</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium">Islamic Identity</p>
                  <p className="text-muted-foreground">Green primary colors, Arabic typography support</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </MobilePage>
    </>
  );
};

export default StyleGuidePage;