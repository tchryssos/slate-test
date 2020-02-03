import { Editor, Transforms, Text } from 'slate'
import prop from 'ramda/src/prop'

const isNodeBold = (node) => prop('bold', node) === true

const isBoldMarkActive = (editor) => () => {
	const [match] = Editor.nodes(editor, {
		match: isNodeBold,
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
