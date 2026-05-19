import { type SchemaTypeDefinition } from 'sanity'

import {stampType} from './stampType'
import {categoryType} from './categoryType'
import {collectionType} from './collectionType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [stampType, categoryType, collectionType],
}
