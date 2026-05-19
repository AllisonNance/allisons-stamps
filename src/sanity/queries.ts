import { client } from "./client";

export interface Stamp {
  _id: string;
  name: string;
  slug: { current: string };
  thumbnail: {
    asset: { _ref: string };
    alt?: string;
  };
  largeImage?: {
    asset: { _ref: string };
    alt?: string;
  };
  country?: string;
  year?: number;
  designer?: string;
  description?: string;
  collection?: { _id: string; title: string; slug: { current: string } };
  category?: { _id: string; title: string; slug: { current: string } };
}

export async function getAllStamps(): Promise<Stamp[]> {
  try {
    return await client.fetch(
      `*[_type == "stamp"] | order(_createdAt desc) {
        _id, name, slug, thumbnail, largeImage, country, year, designer, description,
        collection->{_id, title, slug},
        category->{_id, title, slug}
      }`
    );
  } catch {
    return [];
  }
}

export async function getStampBySlug(slug: string): Promise<Stamp | null> {
  try {
    return await client.fetch(
      `*[_type == "stamp" && slug.current == $slug][0] {
        _id, name, slug, thumbnail, largeImage, country, year, designer, description,
        collection->{_id, title, slug},
        category->{_id, title, slug}
      }`,
      { slug }
    );
  } catch {
    return null;
  }
}

export async function getAllCountries(): Promise<string[]> {
  return client.fetch(
    `array::unique(*[_type == "stamp" && defined(country)].country)`
  );
}

export async function getAllCategories(): Promise<{ _id: string; title: string }[]> {
  return client.fetch(`*[_type == "category"] | order(title asc) { _id, title }`);
}

export async function getAllCollections(): Promise<{ _id: string; title: string }[]> {
  return client.fetch(`*[_type == "collection"] | order(title asc) { _id, title }`);
}
