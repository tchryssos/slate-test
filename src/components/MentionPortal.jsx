import React from 'react'
import ReactDOM from 'react-dom'
import clsx from 'clsx'
import { createUseStyles } from 'react-jss'
import map from 'ramda/src/map'

const useStyles = createUseStyles({
	portal: {
		top: '-9999px',
		left: '-9999px',
		position: 'absolute',
		zIndex: 1,
		padding: '3px',
		background: 'white',
		borderRadius: '4px',
		boxShadow: '0 1px 5px rgba(0,0,0,.2)',
	},
	mentionItem: {
		padding: '1px 3px',
		borderRadius: '3px',
	},
	activeItem: {
		backgroundColor: '#B4D5FF',
	},
})

const Portal = ({ children }) => (
	ReactDOM.createPortal(children, document.body)
)

const MentionItem = ({ mention, i, mentionIndex, classes }) => (
	<div
		className={clsx(
			classes.mentionItem,
			{ [classes.activeItem]: i === mentionIndex },
		)}
	>
		{mention}
	</div>
)

const MentionList = ({ mentionList, mentionIndex, classes }) => map(
	(mention, i) => (
		<MentionItem
			key={mention}
			mention={mention}
			i={i}
			classes={classes}
			mentionIndex={mentionIndex}
		/>
	), mentionList,
)

export default ({
	mentionTarget, mentionList, portalRef, mentionIndex,
}) => {
	const classes = useStyles()
	if (mentionTarget && mentionList.length > 0) {
		return (
			<Portal>
				<div ref={portalRef} className={classes.portal}>
					<MentionList
						mentionList={mentionList}
						classes={classes}
						mentionIndex={mentionIndex}
					/>
				</div>
			</Portal>
		)
	}
	return null
}
