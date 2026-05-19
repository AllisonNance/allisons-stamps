import type { Stamp } from "@/sanity/queries";
import StampCard from "./StampCard";

export default function StampGrid({ stamps }: { stamps: Stamp[] }) {
  if (stamps.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg text-[var(--color-icon)]">No stamps yet.</p>
        <p className="mt-2 text-sm text-[var(--color-border)]">
          Add stamps through the{" "}
          <a href="/studio" className="underline hover:text-[var(--color-text)]">
            Studio
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {stamps.map((stamp) => (
        <StampCard key={stamp._id} stamp={stamp} />
      ))}
    </div>
  );
}
