import React from 'react';
import ReactDOM from "react-dom";
import { Route, HashRouter } from "react-router-dom";
import { main } from "./module/router.js";
import { usePromiseTracker } from "react-promise-tracker";
import Loader from "react-loader-spinner"
// Import Swiper styles
import 'swiper/swiper.scss';
import 'swiper/components/navigation/navigation.scss';
import 'swiper/components/pagination/pagination.scss';
import 'swiper/components/scrollbar/scrollbar.scss';
//semantic-ui
import 'semantic-ui-css/semantic.min.css'
import "tailwindcss/tailwind.css"
import "./css/main.css"


class App extends React.Component {
	render() {
		return (
			<div >
				{ main.map((router, index) => (<>
					<Route exact key={index} {...router.routeProps} /></>
				))}
			</div>
		);
	}
}

const LoadingIndicator = props => {
	const { promiseInProgress } = usePromiseTracker();
	return (
		promiseInProgress &&
		<div className="show_loading">
			<Loader type="ThreeDots" color="#000" height="100" width="100" />
		</div >
	);
}

ReactDOM.render(
	<HashRouter >
		<App />
		<LoadingIndicator />
	</HashRouter>,
	document.getElementById("root")
);