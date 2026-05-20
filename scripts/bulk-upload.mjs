import { createClient } from "@sanity/client";
import { createReadStream, readFileSync } from "fs";
import { basename } from "path";

const client = createClient({
  projectId: "krtn6lvk",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_TOKEN,
  useCdn: false,
});

const THUMB_DIR = process.env.HOME + "/Desktop/international stamps/thumbnails";
const MEDIUM_DIR = process.env.HOME + "/Desktop/international stamps/medium";

const stamps = JSON.parse(
  readFileSync(new URL("./stamps-data.json", import.meta.url), "utf-8")
);

async function uploadImage(filePath) {
  const stream = createReadStream(filePath);
  const filename = basename(filePath);
  return client.assets.upload("image", stream, { filename });
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function findOrCreate(type, title) {
  const existing = await client.fetch(
    `*[_type == $type && title == $title][0]`,
    { type, title }
  );
  if (existing) {
    console.log(`  Found existing ${type}: ${title}`);
    return existing._id;
  }
  const doc = await client.create({
    _type: type,
    title,
    slug: { _type: "slug", current: slugify(title) },
  });
  console.log(`  Created ${type}: ${title}`);
  return doc._id;
}

async function main() {
  console.log("Starting bulk upload...\n");

  for (const stamp of stamps) {
    console.log(`Processing: ${stamp.name}`);

    const existing = await client.fetch(
      `*[_type == "stamp" && name == $name][0]`,
      { name: stamp.name }
    );
    if (existing) {
      console.log(`  Already exists, skipping.\n`);
      continue;
    }

    const categoryId = stamp.category
      ? await findOrCreate("category", stamp.category)
      : null;
    const collectionId = stamp.collection
      ? await findOrCreate("collection", stamp.collection)
      : null;

    let thumbAsset = null;
    if (stamp.thumbnail) {
      console.log("  Uploading thumbnail...");
      thumbAsset = await uploadImage(`${THUMB_DIR}/${stamp.thumbnail}`);
    }

    let largeAsset = null;
    if (stamp.largeImage) {
      console.log("  Uploading large image...");
      largeAsset = await uploadImage(`${MEDIUM_DIR}/${stamp.largeImage}`);
    }

    const doc = {
      _type: "stamp",
      name: stamp.name,
      slug: { _type: "slug", current: slugify(stamp.name) },
    };

    if (stamp.country) doc.country = stamp.country;
    if (stamp.year) doc.year = stamp.year;
    if (stamp.designer) doc.designer = stamp.designer;
    if (stamp.description) doc.description = stamp.description;

    if (thumbAsset) {
      doc.thumbnail = {
        _type: "image",
        asset: { _type: "reference", _ref: thumbAsset._id },
      };
    }
    if (largeAsset) {
      doc.largeImage = {
        _type: "image",
        asset: { _type: "reference", _ref: largeAsset._id },
      };
    }
    if (categoryId) {
      doc.category = { _type: "reference", _ref: categoryId };
    }
    if (collectionId) {
      doc.collection = { _type: "reference", _ref: collectionId };
    }

    await client.create(doc);
    console.log(`  Created stamp: ${stamp.name}\n`);
  }

  console.log("Done!");
}

main().catch(console.error);
