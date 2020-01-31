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
		minHeight: 28,
		minWidth: 28,
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

const initialState = [
	{
		type: 'paragraph',
		children: [{ text: 'Now in this time of diaspora there was a war between AURYX and SAVATHÛN and XIVU ARATH.' }],
	},
	{
		type: 'paragraph',
		children: [{ text: '' }],
	},
	{
		type: 'paragraph',
		children: [{ text: 'Brother Auryx, said SAVATHÛN, do not forgive my betrayal. Instead, take vengeance upon me for what I did at the dry moon! And AURYX made war on her, in worship of the Deep. Between them stood XIVU ARATH saying, stop, or I will kill you, war is mine and I am strongest.' }],
	},
	{
		type: 'paragraph',
		children: [{ text: '' }],
	},
	{
		type: 'paragraph',
		children: [{ text: 'This was how they worshipped.' }],
	},
	{
		type: 'paragraph',
		children: [{ text: '' }],
	},
	{
		type: 'paragraph',
		children: [{ text: 'For twenty thousand years they fought across the moons and they fought in the abyssal plains and lightning palaces of each other\'s sword spaces. And they killed each other again and again, so that they could practice death.' }],
	},
	{
		type: 'paragraph',
		children: [{ text: '' }],
	},
	{
		type: 'paragraph',
		children: [{ text: 'Such was their love.' }],
	},
	{
		type: 'paragraph',
		children: [{ text: '' }],
	},
	{
		type: 'paragraph',
		children: [{ text: 'At last the many moons came to many worlds and it was time to go to war on life. AURYX said, I shall establish a court, and whoever comes into this court may challenge me. My court will be the High War. It will be a killing ground and a school of the sword logic we have learned from our gods.' }],
	},
	{
		type: 'paragraph',
		children: [{ text: '' }],
	},
	{
		type: 'paragraph',
		children: [{ text: 'SAVATHÛN thought this was a great idea. She made a court called the High Coven. XIVU ARATH said, the world is my court, wherever there is war.' }],
	},
]

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
	const [value, setValue] = useState(initialState)
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
					<FormattingButton
						label="link"
						classes={classes}
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
