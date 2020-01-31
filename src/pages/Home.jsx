import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { createUseStyles } from 'react-jss'

import { createEditor, Editor, Transforms } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'

const useStyles = createUseStyles({

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

const Leaf = ({ attributes, leaf, children}) => (
	<span
		{...attributes}
		style={{ fontWeight: leaf.bold ? 'bold' : 'normal' }}
	>
		{children}
	</span>
)
// END - ELEMENTS - END

// START - EDITOR - START
const CustomEditor = {
	isBoldMarkActive(editor) {
		const [match] = Editor.nodes(editor, {
			match: (n) => n.bold === true,
			universal: true,
		})

		return !!match
	},

	isCodeBlockActive(editor) {
		const [match] = Editor.nodes(editor, {
			match: (n) => n.type === 'code',
		})

		return !!match
	},

	toggleBoldMark(editor) {
		const isActive = CustomEditor.isBoldMarkActive(editor)
		Transforms.setNodes(
			editor,
			{ bold: isActive ? null : true },
			{ match: (n) => Text.isText(n), split: true }
		)
	},

	toggleCodeBlock(editor) {
		const isActive = CustomEditor.isCodeBlockActive(editor)
		Transforms.setNodes(
			editor,
			{ type: isActive ? null : 'code' },
			{ match: (n) => Editor.isBlock(editor, n) }
		)
	},
}
// END - EDITOR - END

// START - KEY COMMANDS - START
const keyCommands = (editor) => (e) => {
	if (e.key === '`' && e.ctrlKey) {
		// Pre the "`" from being inserted by default.
		e.preventDefault()
		// Determine whether any of the currently selected blocks are code blocks.
		const [match] = Editor.nodes(editor, {
			match: (n) => n.type === 'code',
		})
		// Toggle the block type depending on whether there's already a match.
		Transforms.setNodes(
			editor,
			{ type: match ? 'paragraph' : 'code' },
			{ match: (n) => Editor.isBlock(editor, n) },
		)
	}
}
// END - KEY COMMANDS - END

const Home = () => {
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
			<Editable
				renderElement={renderElement}
				onKeyDown={keyCommands(editor)}
			/>
		</Slate>
	)
}

export default Home
