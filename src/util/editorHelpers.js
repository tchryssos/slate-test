import isUrl from 'is-url'
import { Editor, Range } from 'slate'
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

export const editorOnChange = (
	editor, setValue, setTarget, setSearch, setMentionIndex,
) => (newValue) => {
	setValue(newValue)
	const { selection } = editor

	// If you have a cursor and aren't highlighting a range...
	if (selection && Range.isCollapsed(selection)) {
		// Get the cursor position
		const [start] = Range.edges(selection)
		// Get the starting position of the word before the cursor
		const wordBefore = Editor.before(editor, start, { unit: 'word' })
		// Get the cursor position preceeding the word from above
		const before = wordBefore && Editor.before(editor, wordBefore)
		// Capture a range of positions starting with the beginning of the
		// already captured word, and ending at our cursor position
		const beforeRange = before && Editor.range(editor, before, start)
		// Capture the actual string content of the above positions
		const beforeText = beforeRange && Editor.string(editor, beforeRange)
		// Check if the text above matches the pattern '@{any letters}
		// If yes, return the full text, the text after the @
		const beforeMatch = beforeText && beforeText.match(/^@(\w+)$/)

		// Get the position after the cursor
		const after = Editor.after(editor, start)
		// Get the range of positions from cursor to immediately after cursor
		const afterRange = Editor.range(editor, start, after)
		// Get the actual text content of that range
		const afterText = Editor.string(editor, afterRange)
		// Check if the text above is a whitespace character or end of line
		const afterMatch = afterText.match(/^(\s|$)/)

		// if you're typing to search for someone by an @ lookup
		// set search parameters and dropdown target
		if (beforeMatch && afterMatch) {
			setTarget(beforeRange)
			setSearch(beforeMatch[1])
			setMentionIndex(0)
			return
		}
	}

	setTarget(null)
}
