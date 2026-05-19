import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getStampBySlug, getAllStamps } from "@/sanity/queries";
import { urlFor } from "@/sanity/client";

export const revalidate = 60;

export async function generateStaticParams() {
  const stamps = await getAllStamps();
  return stamps.map((stamp) => ({ slug: stamp.slug.current }));
}

export default async function StampPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const stamp = await getStampBySlug(slug);

  if (!stamp) notFound();

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-[var(--color-icon)] hover:text-[var(--color-text)]"
      >
        &larr; Back to collection
      </Link>

      <div className="mt-4 grid gap-10 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-white border border-[var(--color-border)]">
          {stamp.image && (
            <Image
              src={urlFor(stamp.image).width(800).height(800).url()}
              alt={stamp.title}
              fill
              className="object-contain p-6"
              priority
            />
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">{stamp.title}</h1>

          <dl className="mt-6 space-y-3">
            {stamp.country && (
              <div className="flex gap-3">
                <dt className="w-28 shrink-0 text-sm font-medium text-[var(--color-icon)]">
                  Country
                </dt>
                <dd className="text-sm">{stamp.country}</dd>
              </div>
            )}
            {stamp.year && (
              <div className="flex gap-3">
                <dt className="w-28 shrink-0 text-sm font-medium text-[var(--color-icon)]">
                  Year
                </dt>
                <dd className="text-sm">{stamp.year}</dd>
              </div>
            )}
            {stamp.denomination && (
              <div className="flex gap-3">
                <dt className="w-28 shrink-0 text-sm font-medium text-[var(--color-icon)]">
                  Denomination
                </dt>
                <dd className="text-sm">{stamp.denomination}</dd>
              </div>
            )}
            {stamp.condition && (
              <div className="flex gap-3">
                <dt className="w-28 shrink-0 text-sm font-medium text-[var(--color-icon)]">
                  Condition
                </dt>
                <dd className="text-sm capitalize">
                  {stamp.condition.replace("-", " ")}
                </dd>
              </div>
            )}
          </dl>

          {stamp.description && (
            <p className="mt-6 text-sm leading-relaxed text-[var(--color-icon)]">
              {stamp.description}
            </p>
          )}

          {stamp.tags && stamp.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {stamp.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-icon)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
