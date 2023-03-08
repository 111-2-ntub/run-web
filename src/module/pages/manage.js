import React from 'react';
import { Pages } from "../pages.js"

import Check from "./manage/check"

import User from "./manage/user"
import utilStyle from "../../css/util.module.css"
import { Tab } from 'semantic-ui-react'

class Manage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            "login": !!localStorage.getItem("login"),
            userName: localStorage.getItem("login"),
            isManage: localStorage.getItem("identity") === "2",
            items: [
                { key: "check", name: "審核檢舉", in: <Check /> },
                { key: "welcome", name: "使用者管理", in: <User /> }
            ]

        }
    }
    componentDidMount() {
        if (localStorage.getItem("identity")!=="2") {
            document.location.href = "/#"
        }
    }

    render() {
        return (<Pages pageInfo={ [{ content: '管理者', active: true, href: "./manage" }] }
            page={
                (<>
                    <Tab className={ utilStyle.tab } menu={ { secondary: true, pointing: true, vertical: true, } } panes={ this.state.items.map((item, index) => {
                        return ({
                            menuItem: { content: item.name },
                            render: () => <Tab.Pane attached={ false }>  { item.in }</Tab.Pane>,
                        })
                    }) } />

                </>)
            } />)
    }
}


export default Manage = {
    routeProps: {
        path: "/manage",
        component: Manage
    },
    name: "管理者"
}