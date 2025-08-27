import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen fixed inset-0 bg-black z-[100] flex-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="size-9 animate-spin text-primary" />
      </div>
    </div>
  );
}
