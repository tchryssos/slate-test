import { Transforms } from 'slate'

export const insertMention = (editor, pMention) => {
	const mention = { type: 'mention', pMention, children: [{ text: '' }] }
	Transforms.insertNodes(editor, mention)
	Transforms.move(editor)
}
