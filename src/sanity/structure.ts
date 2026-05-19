import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.documentTypeListItem('stamp').title('Stamps'),
      S.documentTypeListItem('category').title('Categories'),
      S.documentTypeListItem('collection').title('Collections'),
    ])
