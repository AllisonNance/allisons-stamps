import {defineField, defineType} from 'sanity'

export const stampType = defineType({
  name: 'stamp',
  title: 'Stamp',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Stamp Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'name'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt text',
        }),
      ],
    }),
    defineField({
      name: 'largeImage',
      title: 'Large Image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt text',
        }),
      ],
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
    }),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'string',
    }),
    defineField({
      name: 'collection',
      title: 'Collection',
      type: 'reference',
      to: [{type: 'collection'}],
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'category'}],
    }),
    defineField({
      name: 'designer',
      title: 'Designer',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'country',
      media: 'thumbnail',
    },
  },
})
