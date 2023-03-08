import React from 'react';

class Redirect extends React.Component {
    to=null
    componentDidMount() {
        this.to = this.props.match.params.to
        localStorage.setItem("login", this.props.match.params.userID)
        document.location.href = `#/${this.to}`
    }


    render() {
        return (
            <div>重新導向中</div>)
    }
}


export default Redirect = {
    routeProps: {
        path: "/redirect/:userID/:to",
        component: Redirect
    },
    name: "重新導向"
}