import React from 'react'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({

})

export default ({ attributes, children, element }) => {
	const classes = useStyles()
	return (
		<a {...attributes} href={element.url}>
			{children}
		</a>
	)
}
