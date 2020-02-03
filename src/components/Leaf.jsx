import React from 'react'
import { createUseStyles } from 'react-jss'
import prop from 'ramda/src/prop'

const useStyles = createUseStyles({

})

export default ({ attributes, leaf, children }) => {
	const classes = useStyles()
	return (
		<span
			{...attributes}
			style={{ fontWeight: prop('bold', leaf) ? 'bold' : 'normal' }}
		>
			{children}
		</span>
	)
}
