import React, { useMemo, useState, useCallback } from 'react'
import { createUseStyles } from 'react-jss'

import {
	createEditor, Editor, Transforms, Text,
} from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { withHistory } from 'slate-history'

import { withLinks, isLinkActive, insertLink } from 'util/linkHelpers'

import Leaf from 'components/Leaf'
import CodeElement from 'components/CodeElement'
import LinkElement from 'components/LinkElement'
import TextElement from 'components/TextElement'
import FormattingButton from 'components/FormattingButton'
import fakeData from 'constants/fakeData'

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

// START - EDITOR - START
const isBoldMarkActive = (editor) => () => {
	const [match] = Editor.nodes(editor, {
		match: (n) => n.bold === true,
		universal: true,
	})

	return !!match
}

const isCodeBlockActive = (editor) => () => {
	const [match] = Editor.nodes(editor, {
		match: (n) => n.type === 'code',
	})

	return !!match
}

const toggleBoldMark = (editor) => () => {
	const isActive = isBoldMarkActive(editor)()
	Transforms.setNodes(
		editor,
		{ bold: isActive ? null : true },
		{ match: (n) => Text.isText(n), split: true },
	)
}

const toggleCodeBlock = (editor) => () => {
	const isActive = isCodeBlockActive(editor)()
	Transforms.setNodes(
		editor,
		{ type: isActive ? 'paragraph' : 'code' },
		{ match: (n) => Editor.isBlock(editor, n) },
	)
}

const makeLink = (editor) => () => {
	const url = window.prompt('Enter the URL of the link:')
	if (!url) return
	insertLink(editor, url)
}
// END - EDITOR - END

export default () => {
	// START - DEFINITIONS - START
	const classes = useStyles()
	const [value, setValue] = useState(fakeData)
	const editor = useMemo(() => withLinks(withHistory(withReact(createEditor()))), [])
	// END - DEFINITIONS - END

	// START - ELEMENT RENDER - START
	const renderElement = useCallback((props) => {
		const { element } = props
		switch (element.type) {
			case 'code':
				return <CodeElement {...props} />
			case 'link':
				return <LinkElement {...props} />
			default:
				return <TextElement {...props} />
		}
	}, [])
	const renderLeaf = useCallback((props) => <Leaf {...props} />, [])
	// END - ELEMENT RENDER - END

	return (
		<Slate
			editor={editor}
			value={value}
			onChange={(newVal) => setValue(newVal)}
		>
			<div className={classes.editorWrapper}>
				<div className={classes.toolBar}>
					<FormattingButton
						onClick={toggleBoldMark(editor)}
						label="B"
						labelClassName={classes.boldKey}
					/>
					<FormattingButton
						onClick={toggleCodeBlock(editor)}
						label="</>"
						labelClassName={classes.codeKey}
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
