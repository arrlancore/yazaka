import React from "react";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

const RequestLocation = (props: {
  isRequested: boolean;
  request: (x: any) => void;
  caption?: string;
}) => {
  return props.isRequested ? null : (
    <div className="flex flex-col items-center justify-center p-4 bg-card text-card-foreground rounded-lg shadow-md">
      <p className="mb-4 text-sm text-muted-foreground text-center">
        {props.caption ??
          "Kami memerlukan lokasi Anda untuk memberikan waktu shalat yang akurat."}
      </p>
      <Button onClick={props.request} className="flex items-center gap-2">
        <MapPin size={18} />
        Izinkan Akses Lokasi
      </Button>
    </div>
  );
};

export default RequestLocation;
