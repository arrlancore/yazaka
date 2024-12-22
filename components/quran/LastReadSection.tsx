import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Book } from "lucide-react";

const LastReadSection = () => {
  return (
    <Card className="mb-4 bg-gradient-to-r rounded-t-none from-primary/10 to-primary-light/10">
      <CardContent className="p-4">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Terakhir dibaca:
          </h3>
          <div className="flex items-center justify-between p-3 rounded-lg bg-card hover:bg-primary/5 transition-all duration-300">
            <div className="flex items-center space-x-3">
              <Book className="text-primary" size={24} />
              <div>
                <div className="text-lg font-semibold">Al Maidah</div>
                <div className="text-sm text-muted-foreground">Ayat 54</div>
              </div>
            </div>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Lanjut
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LastReadSection;
