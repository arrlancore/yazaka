import React from "react";
import { Button } from "@/components/ui/button";
import { Compass } from "lucide-react";

const RequestOrientation = (props: {
  isRequested: boolean;
  request: () => void;
  caption?: string;
}) => {
  return props.isRequested ? null : (
    <div className="flex flex-col items-center justify-center p-4 bg-card text-card-foreground rounded-lg shadow-md">
      <p className="mb-4 text-sm text-muted-foreground text-center">
        {props.caption ??
          "Kami memerlukan akses ke sensor orientasi untuk menentukan arah kiblat."}
      </p>
      <Button onClick={props.request} className="flex items-center gap-2">
        <Compass size={18} />
        Izinkan Akses Kompas
      </Button>
    </div>
  );
};

export default RequestOrientation;
