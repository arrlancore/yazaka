import { brandName } from "@/config";

export default function Loading() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-background text-foreground">
      <div className="relative">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <svg
            className="w-12 h-12 text-primary"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
        </div>
      </div>
      <div className="mt-8 text-center">
        <h2 className="text-2xl font-bold mb-2">{brandName}</h2>
        <p className="text-muted-foreground">
          <span className="inline-block">is loading</span>
          <span className="inline-block animate-[ellipsis_1.5s_infinite]">
            ...
          </span>
        </p>
      </div>
    </div>
  );
}
