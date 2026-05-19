import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/client";
import type { Stamp } from "@/sanity/queries";

export default function StampCard({ stamp }: { stamp: Stamp }) {
  return (
    <Link
      href={`/stamp/${stamp.slug.current}`}
      className="group block overflow-hidden rounded-lg border border-[var(--color-border)] bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden bg-neutral-50">
        {stamp.image && (
          <Image
            src={urlFor(stamp.image).width(400).height(400).url()}
            alt={stamp.title}
            fill
            className="object-contain p-4 transition group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-[var(--color-text)] truncate">
          {stamp.title}
        </h3>
        <div className="mt-1 flex items-center gap-2 text-sm text-[var(--color-icon)]">
          {stamp.country && <span>{stamp.country}</span>}
          {stamp.country && stamp.year && <span>·</span>}
          {stamp.year && <span>{stamp.year}</span>}
        </div>
        {stamp.condition && (
          <span className="mt-2 inline-block rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 capitalize">
            {stamp.condition.replace("-", " ")}
          </span>
        )}
      </div>
    </Link>
  );
}
