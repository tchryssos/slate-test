import React from 'react'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({

})

export default ({ attributes, children }) => {
	const classes = useStyles()
	return (
		<pre {...attributes}>
			<code>{children}</code>
		</pre>
	)
}
