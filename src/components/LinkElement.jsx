import React from 'react'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({

})

export default ({ attributes, children, url }) => {
	const classes = useStyles()
	return (
		<a {...attributes} href={url}>
			{children}
		</a>
	)
}
