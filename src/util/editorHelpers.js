import isUrl from 'is-url'
import prop from 'ramda/src/prop'
import { wrapLink } from 'util/linkHelpers'

export const withEditorMods = (editor) => {
	const {
		insertData, insertText, isInline, isVoid,
	} = editor

	editor.isInline = (element) => {
		switch (prop('type', element)) {
			case 'link':
			case 'mention':
				return true
			default:
				return isInline(element)
		}
	}

	editor.isVoid = (element) => (prop('type', element) === 'mention' ? true : isVoid(element))

	editor.insertText = (text) => {
		if (text && isUrl(text)) {
			wrapLink(editor, text)
		} else {
			insertText(text)
		}
	}

	editor.insertData = (data) => {
		const text = data.getData('text/plain')

		if (text && isUrl(text)) {
			wrapLink(editor, text)
		} else {
			insertData(data)
		}
	}

	return editor
}
