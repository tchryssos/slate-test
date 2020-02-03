import React from 'react'
import ReactDOM from 'react-dom'
import clsx from 'clsx'
import { createUseStyles } from 'react-jss'
import { Transforms } from 'slate'

import { insertMention } from 'util/mentionHelpers'

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
		cursor: 'pointer',
		'&:hover': {
			backgroundColor: '#B4D5FF',
		},
	},
	activeItem: {
		backgroundColor: '#B4D5FF',
	},
})

const Portal = ({ children }) => (
	ReactDOM.createPortal(children, document.body)
)

const MentionItem = ({
	mention, index, mentionIndex, onClick, classes,
}) => (
	<div
		onMouseDown={onClick(index)} // Can't use onClick inside React Portal
		className={clsx(
			classes.mentionItem,
			{ [classes.activeItem]: index === mentionIndex },
		)}
	>
		{mention}
	</div>
)

const MentionList = ({
	mentionList, mentionIndex, itemOnClick, classes,
}) => mentionList.map(
	(mention, i) => (
		<MentionItem
			key={mention}
			mention={mention}
			index={i}
			classes={classes}
			mentionIndex={mentionIndex}
			onClick={itemOnClick}
		/>
	),
)

export default ({
	mentionTarget, mentionList, portalRef, mentionIndex,
	editor, setMentionTarget,
}) => {
	const classes = useStyles()
	const itemOnClick = (index) => (e) => {
		e.preventDefault()
		Transforms.select(editor, mentionTarget)
		insertMention(editor, mentionList[index])
		console.log(mentionList, index)
		setMentionTarget(null)
	}
	if (mentionTarget && mentionList.length > 0) {
		return (
			<Portal>
				<div ref={portalRef} className={classes.portal}>
					<MentionList
						mentionList={mentionList}
						classes={classes}
						mentionIndex={mentionIndex}
						itemOnClick={itemOnClick}
					/>
				</div>
			</Portal>
		)
	}
	return null
}
