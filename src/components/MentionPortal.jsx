import React from 'react'
import ReactDOM from 'react-dom'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
	
})

const Portal = ({ children }) => (
	ReactDOM.createPortal(children, document.body)
)

export default ({ target, chars, portalRef, mentionIndex }) => {
	const classes = useStyles()
	if (target && chars.length > 0) {
		return (
			<Portal>
				<div
					ref={portalRef}
					style={{
						top: '-9999px',
						left: '-9999px',
						position: 'absolute',
						zIndex: 1,
						padding: '3px',
						background: 'white',
						borderRadius: '4px',
						boxShadow: '0 1px 5px rgba(0,0,0,.2)',
					}}
				>
					{chars.map((char, i) => (
						<div
							key={char}
							style={{
								padding: '1px 3px',
								borderRadius: '3px',
								background: i === mentionIndex ? '#B4D5FF' : 'transparent',
							}}
						>
							{char}
						</div>
					))}
				</div>
			</Portal>
		)
	}
	return null
}
