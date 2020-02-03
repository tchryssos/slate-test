import { Transforms } from 'slate'

export const insertMention = (editor, mention) => {
	const mentionObj = { type: 'mention', mention, children: [{ text: '' }] }
	Transforms.insertNodes(editor, mentionObj)
	Transforms.move(editor)
}
