import React, { useMemo, useState } from 'react'
import { createUseStyles } from 'react-jss'

import { createEditor, Editor, Range } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { withHistory } from 'slate-history'

import { makeLink } from 'util/linkHelpers'
import { withEditorMods } from 'util/editorHelpers'
import { toggleBoldMark } from 'util/boldHelpers'
import fakeData from 'constants/fakeData'
import mentions from 'constants/mentions'

import Leaf from 'components/Leaf'
import LinkElement from 'components/LinkElement'
import TextElement from 'components/TextElement'
import FormattingButton from 'components/FormattingButton'
import MentionElement from 'components/MentionElement'

const useStyles = createUseStyles({
	editorWrapper: {
		border: [[1, 'solid', '#e0e0e0']],
		boxShadow: [[2, 2, 3, '#d1d1d1']],
		padding: 8,
		margin: 8,
		display: 'flex',
		flexDirection: 'column',
		width: 700,
	},
	toolBar: {
		border: [[1, 'solid', '#e0e0e0']],
		boxShadow: [[2, 2, 3, '#c4c4c4']],
		padding: 4,
		margin: 4,
	},
	textArea: {
		margin: 4,
	},
	boldKey: {
		fontWeight: 600,
	},
	codeKey: {
		fontFamily: 'monospace',
	},
})

const renderElement = ({
	attributes, children, element,
}) => {
	switch (element.type) {
		case 'link':
			return (
				<LinkElement
					attributes={attributes}
					element={element}
				>
					{children}
				</LinkElement>
			)
		case 'mention':
			return (
				<MentionElement
					attributes={attributes}
					element={element}
				>
					{children}
				</MentionElement>
			)
		default:
			return (
				<TextElement attributes={attributes}>
					{children}
				</TextElement>
			)
	}
}

const renderLeaf = ({ children, attributes, leaf }) => (
	<Leaf leaf={leaf} attributes={attributes}>
		{children}
	</Leaf>
)

export default () => {
	const classes = useStyles()
	const [value, setValue] = useState(fakeData)
	const [target, setTarget] = useState()
	const [index, setIndex] = useState(0)
	const [search, setSearch] = useState('')
	const editor = useMemo(() => withEditorMods(withHistory(withReact(createEditor()))), [])

	return (
		<Slate
			editor={editor}
			value={value}
			onChange={newValue => {
				setValue(newValue)
				const { selection } = editor

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
					// Check if the text above is a whitespace character
					const afterMatch = afterText.match(/^(\s|$)/)

					// if you're typing to search for someone by an @ lookup
					// set search parameters and dropdown target
					if (beforeMatch && afterMatch) {
						setTarget(beforeRange)
						setSearch(beforeMatch[1])
						setIndex(0)
						return
					}
				}

				setTarget(null)
			}}
		>
			<div className={classes.editorWrapper}>
				<div className={classes.toolBar}>
					<FormattingButton
						onClick={toggleBoldMark(editor)}
						label="B"
						labelClassName={classes.boldKey}
					/>
					<FormattingButton
						label="link"
						onClick={makeLink(editor)}
					/>
				</div>
				<div className={classes.textArea}>
					<Editable
						renderElement={renderElement}
						renderLeaf={renderLeaf}
					/>
				</div>
			</div>
		</Slate>
	)
}
