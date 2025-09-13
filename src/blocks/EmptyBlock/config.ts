import type { Block } from 'payload'

export const EmptyBlock: Block = {
  slug: 'emptyBlock',
  labels: { singular: 'Empty Block', plural: 'Empty Blocks' },
  interfaceName: 'EmptyBlock',

  fields: [],
}
