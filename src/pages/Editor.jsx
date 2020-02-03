import React, { useMemo, useState } from 'react'
import { createUseStyles } from 'react-jss'

import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { withHistory } from 'slate-history'

import { makeLink } from 'util/linkHelpers'
import { withEditorMods, editorOnChange } from 'util/editorHelpers'
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
			onChange={editorOnChange(editor, setValue, setTarget, setSearch, setIndex)}
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
