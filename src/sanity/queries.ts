import { client } from "./client";

export interface Stamp {
  _id: string;
  title: string;
  slug: { current: string };
  image: {
    asset: { _ref: string };
    hotspot?: { x: number; y: number };
  };
  country?: string;
  year?: number;
  denomination?: string;
  condition?: string;
  description?: string;
  tags?: string[];
}

export async function getAllStamps(): Promise<Stamp[]> {
  try {
    return await client.fetch(
      `*[_type == "stamp"] | order(_createdAt desc) {
        _id, title, slug, image, country, year, denomination, condition, tags
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
        _id, title, slug, image, country, year, denomination, condition, description, tags
      }`,
      { slug }
    );
  } catch {
    return null;
  }
}

export async function getStampsByCountry(country: string): Promise<Stamp[]> {
  return client.fetch(
    `*[_type == "stamp" && country == $country] | order(year asc) {
      _id, title, slug, image, country, year, denomination, condition, tags
    }`,
    { country }
  );
}

export async function getAllCountries(): Promise<string[]> {
  return client.fetch(
    `array::unique(*[_type == "stamp" && defined(country)].country)`
  );
}
