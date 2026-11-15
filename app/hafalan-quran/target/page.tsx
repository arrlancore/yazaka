import { Suspense } from "react";
import TargetDetailClient from "./target-detail-client";

// Target ids live in the user's localStorage (Zustand hafalan store), so this
// page cannot be prerendered per id. It is a single static page that reads
// `?id=` on the client.
export default function TargetDetailPage() {
  return (
    <Suspense fallback={null}>
      <TargetDetailClient />
    </Suspense>
  );
}
