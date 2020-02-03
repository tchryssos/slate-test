import { Transforms, Editor, Range } from 'slate'
import prop from 'ramda/src/prop'

const isNodeLink = (node) => prop('type', node) === 'link'

export const isLinkActive = (editor) => {
	const [link] = Editor.nodes(editor, { match: isNodeLink })
	return !!link
}

const unwrapLink = (editor) => {
	Transforms.unwrapNodes(editor, { match: isNodeLink })
}

export const wrapLink = (editor, url) => {
	if (isLinkActive(editor)) {
		unwrapLink(editor)
	}

	const { selection } = editor
	const isCollapsed = selection && Range.isCollapsed(selection)
	const link = {
		type: 'link',
		url,
		children: isCollapsed ? [{ text: url }] : [],
	}

	if (isCollapsed) {
		Transforms.insertNodes(editor, link)
	} else {
		Transforms.wrapNodes(editor, link, { split: true })
		Transforms.collapse(editor, { edge: 'end' })
	}
}

const insertLink = (editor, url) => {
	if (editor.selection) {
		wrapLink(editor, url)
	}
}

export const makeLink = (editor) => () => {
	const url = window.prompt('Enter the URL of the link:')
	if (!url) return
	insertLink(editor, url)
}
