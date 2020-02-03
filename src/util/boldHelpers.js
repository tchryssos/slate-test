import { Editor, Transforms, Text } from 'slate'

const isBoldMarkActive = (editor) => () => {
	const [match] = Editor.nodes(editor, {
		match: (n) => n.bold === true,
		universal: true,
	})

	return !!match
}

export const toggleBoldMark = (editor) => () => {
	const isActive = isBoldMarkActive(editor)()
	Transforms.setNodes(
		editor,
		{ bold: isActive ? null : true },
		{ match: (n) => Text.isText(n), split: true },
	)
}
