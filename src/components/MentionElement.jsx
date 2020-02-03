import React from 'react'
import { createUseStyles } from 'react-jss'
import { useSelected, useFocused } from 'slate-react'
import prop from 'ramda/src/prop'

const useStyles = createUseStyles({
	mention: {
		padding: '3px 3px 2px',
		margin: '0 1px',
		verticalAlign: 'baseline',
		display: 'inline-block',
		borderRadius: '4px',
		backgroundColor: '#eee',
		fontSize: '0.9em',
		boxShadow: ({ selected, focused }) => (selected && focused ? '0 0 0 2px #B4D5FF' : 'none'),
	}
})

export default ({ attributes, children, element }) => {
	const selected = useSelected()
	const focused = useFocused()
	const classes = useStyles({ selected, focused })
	return (
		<span
			className={classes.mention}
			{...attributes}
			contentEditable={false}
		>
			@
			{prop('mention', element)}
			{children}
		</span>
	)
}
