import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter, Route, Switch, withRouter } from 'react-router-dom'
import Editor from 'pages/Editor'
import globalUseStyles from 'constants/styles/globalUseStyles'

const App = ({ location }) => {
	// Create global effects or state here
	// with access to router location
	globalUseStyles()
	return (
		<>
			<Switch>
				<Route path="/" exact component={Editor} />
			</Switch>
			{/* NavBar?? */}
		</>
	)
}

const RouterApp = withRouter(props => <App {...props} />)

render(
	<BrowserRouter>
		<RouterApp />
	</BrowserRouter>,
	document.getElementById('app'),
)
