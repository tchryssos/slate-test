import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { createUseStyles } from 'react-jss'

import {
	createEditor, Editor, Transforms, Text,
} from 'slate'
import { Slate, Editable, withReact } from 'slate-react'

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
	formattingButton: {
		cursor: 'pointer',
		height: 28,
		width: 28,
		padding: 0,
		textAlign: 'center',
		marginRight: 4,
		borderRadius: 4,
		'&:hover': {
			backgroundColor: '#c4c4c4',
		},
	},
	boldKey: {
		fontWeight: 600,
	},
	codeKey: {
		fontFamily: 'monospace',
	},
})

// START - ELEMENTS - START
const CodeElement = ({ attributes, children }) => (
	<pre {...attributes}>
		<code>{children}</code>
	</pre>
)

const DefaultElement = ({ attributes, children }) => (
	<p {...attributes}>
		{children}
	</p>
)

const Leaf = ({ attributes, leaf, children }) => (
	<span
		{...attributes}
		style={{ fontWeight: leaf.bold ? 'bold' : 'normal' }}
	>
		{children}
	</span>
)
// END - ELEMENTS - END

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

const toggleCodeBlock = (editor) => () =>  {
	const isActive = isCodeBlockActive(editor)()
	Transforms.setNodes(
		editor,
		{ type: isActive ? null : 'code' },
		{ match: (n) => Editor.isBlock(editor, n) },
	)
}
// END - EDITOR - END

// START - KEY COMMANDS - START
const keyCommands = (editor) => (e) => {
	if (!e.ctrlKey) {
		return
	}
	e.preventDefault()
	switch (e.key) {
		case '`':
			toggleCodeBlock(editor)()
			break
		case 'b':
			toggleBoldMark(editor)()
			break
		default:
			break
	}
}
// END - KEY COMMANDS - END

// START - FORMATTING BUTTONS - START
const FormattingButton = ({
	label, onClick, classes, labelClassName,
}) => (
	<button
		type="button"
		className={classes.formattingButton}
		onClick={(e) => {
			e.preventDefault()
			onClick()
		}}
	>
		<span className={labelClassName}>{label}</span>
	</button>
)

// END - FORMATTING BUTTONS - END

export default () => {
	// START - DEFINITIONS - START
	const classes = useStyles()
	const [value, setValue] = useState([
		{
			type: 'paragraph',
			children: [{ text: 'A line of text in a paragraph.' }],
		},
	])
	const editor = useMemo(() => withReact(createEditor()), [])
	// END - DEFINITIONS - END

	// START - ELEMENT RENDER - START
	const renderElement = useCallback((props) => {
		const { element } = props
		switch (element.type) {
			case 'code':
				return <CodeElement {...props} />
			default:
				return <DefaultElement {...props} />
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
						classes={classes}
					/>
					<FormattingButton
						onClick={toggleCodeBlock(editor)}
						label="</>"
						labelClassName={classes.codeKey}
						classes={classes}
					/>
				</div>
				<div className={classes.textArea}>
					<Editable
						renderElement={renderElement}
						renderLeaf={renderLeaf}
						onKeyDown={keyCommands(editor)}
					/>
				</div>
			</div>
		</Slate>
	)
}
