import React from 'react'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({

})

export default ({ attributes, leaf, children }) => {
	const classes = useStyles()
	return (
		<span
			{...attributes}
			style={{ fontWeight: leaf.bold ? 'bold' : 'normal' }}
		>
			{children}
		</span>
	)
}
