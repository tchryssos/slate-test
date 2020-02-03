import React from 'react'
import { createUseStyles } from 'react-jss'
import prop from 'ramda/src/prop'

const useStyles = createUseStyles({

})

export default ({ attributes, children, element }) => {
	const classes = useStyles()
	return (
		<a {...attributes} href={prop('url', element)}>
			{children}
		</a>
	)
}
