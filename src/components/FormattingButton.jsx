import React from 'react'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
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
})

export default ({
	label, onClick, disabled, labelClassName,
}) => {
	const classes = useStyles()
	return (
		<button
			disabled={disabled}
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
}
