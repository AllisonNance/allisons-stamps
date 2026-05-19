import { defineField, defineType } from "sanity";

export const stamp = defineType({
  name: "stamp",
  title: "Stamp",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "country",
      title: "Country",
      type: "string",
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "number",
    }),
    defineField({
      name: "denomination",
      title: "Denomination",
      type: "string",
    }),
    defineField({
      name: "condition",
      title: "Condition",
      type: "string",
      options: {
        list: [
          { title: "Mint", value: "mint" },
          { title: "Near Mint", value: "near-mint" },
          { title: "Fine", value: "fine" },
          { title: "Good", value: "good" },
          { title: "Fair", value: "fair" },
          { title: "Poor", value: "poor" },
        ],
      },
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "country",
      media: "image",
    },
  },
});
