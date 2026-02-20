import React from "react";
import { Metadata } from "next";
import { appLocale, appUrl, brandName } from "@/config";
import MobilePage from "@/components/ui/mobile-page";
import HeaderMobilePage from "@/components/ui/header-mobile-page";
import { Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Hubungi Kami | Contact",
  description:
    "Hubungi kami untuk pertanyaan, saran, atau masukan terkait aplikasi Bekhair.",
  openGraph: {
    title: "Hubungi Kami | Contact",
    description:
      "Hubungi kami untuk pertanyaan, saran, atau masukan terkait aplikasi Bekhair.",
    url: appUrl + "/contact",
    siteName: brandName,
    locale: appLocale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hubungi Kami | Contact",
    description:
      "Hubungi kami untuk pertanyaan, saran, atau masukan terkait aplikasi Bekhair.",
  },
  keywords: [
    "kontak",
    "hubungi kami",
    "contact",
    "bekhair",
    "feedback",
    "saran"
  ],
};

const ContactPage = () => {
  const email = "td7f5u15h@mozmail.com";

  return (
    <MobilePage>
      <HeaderMobilePage
        title="Hubungi Kami"
        backUrl="/"
      />

      <div className="container max-w-2xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Hubungi Kami</h1>
            <p className="text-muted-foreground">
              Punya pertanyaan atau saran? Kami senang mendengarnya!
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="w-8 h-8 text-primary" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Email Kami</h3>
                  <p className="text-sm text-muted-foreground">
                    Silakan kirim email ke:
                  </p>
                  <a
                    href={`mailto:${email}`}
                    className="inline-block text-lg font-medium text-primary hover:underline transition-all"
                  >
                    {email}
                  </a>
                </div>

                <div className="pt-4 border-t border-border w-full">
                  <p className="text-sm text-muted-foreground">
                    Kami akan merespons email Anda sesegera mungkin.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p>
              <strong>Catatan:</strong> Untuk pertanyaan teknis, silakan sertakan detail lengkap mengenai masalah yang Anda alami.
            </p>
          </div>
        </div>
      </div>
    </MobilePage>
  );
};

export default ContactPage;
