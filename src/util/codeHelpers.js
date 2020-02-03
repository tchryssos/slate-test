import { Editor, Transforms } from 'slate'

const isCodeBlockActive = (editor) => () => {
	const [match] = Editor.nodes(editor, {
		match: (n) => n.type === 'code',
	})

	return !!match
}

export const toggleCodeBlock = (editor) => () => {
	const isActive = isCodeBlockActive(editor)()
	Transforms.setNodes(
		editor,
		{ type: isActive ? 'paragraph' : 'code' },
		{ match: (n) => Editor.isBlock(editor, n) },
	)
}
