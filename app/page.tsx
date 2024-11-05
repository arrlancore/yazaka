import Footer from "@/components/footer";
import Header from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { appDescription, appSlogan, appTitle, appUrl } from "@/config";
import { ArrowRight, CheckCircle2, Sparkles, Zap, Shield } from "lucide-react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: appTitle,
  description: appDescription,
  openGraph: {
    title: appSlogan,
    description: appDescription,
    images: [{ url: `${appUrl}/og-image.jpg` }],
  },
};

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Hero Section */}
      <section className="mx-auto max-w-6xl py-20 px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            ✨ Now in Beta
          </Badge>
          <h1 className="mb-4 text-5xl font-bold tracking-tight">
            Build Better, Ship Faster
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            The complete development platform for building and scaling your next
            project. Trusted by over 20,000 developers worldwide.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              Live Demo
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Zap className="h-12 w-12 mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
            <p className="text-muted-foreground">
              Built for speed and performance, deploy in seconds not minutes.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Shield className="h-12 w-12 mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Enterprise Security</h3>
            <p className="text-muted-foreground">
              Bank-grade security with end-to-end encryption and compliance.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Sparkles className="h-12 w-12 mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">AI-Powered</h3>
            <p className="text-muted-foreground">
              Smart automation and insights powered by latest AI technology.
            </p>
          </Card>
        </div>

        {/* Social Proof */}
        <Card className="p-8 text-center bg-muted/50">
          <CardContent>
            <h2 className="text-2xl font-bold mb-6">
              Trusted by Industry Leaders
            </h2>
            <div className="flex flex-wrap justify-center gap-8 items-center text-muted-foreground">
              <div className="text-xl font-semibold">Microsoft</div>
              <div className="text-xl font-semibold">Google</div>
              <div className="text-xl font-semibold">Amazon</div>
              <div className="text-xl font-semibold">Meta</div>
              <div className="text-xl font-semibold">Apple</div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Feature Highlights */}
      <section className="bg-muted/50 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
            <p className="text-muted-foreground text-lg">
              All the tools and features you need to build amazing products
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              "Automatic deployments",
              "Version control",
              "Advanced analytics",
              "Team collaboration",
              "24/7 support",
              "Custom domains",
              "API access",
              "99.9% uptime",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="mx-auto max-w-4xl text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="mb-8 text-lg opacity-90">
            Join thousands of developers building the future of web development.
          </p>
          <Button size="lg" variant="secondary">
            Start Building Now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default LandingPage;
