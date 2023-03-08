import React from 'react';
import { Pages } from "../pages.js";
import style from "../../css/policy.module.css"
import utilStyle from "../../css/util.module.css"
import BarChart from "../barchart"
import { ProposalR } from "../request/proposalR"
import Search from "../bar/search"
import { trackPromise } from 'react-promise-tracker';

import { Grid, List, Label, Pagination, Segment } from 'semantic-ui-react'

class Policy extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            like: {},
            nowPage: 1
        }
    }
    toContent = (id) => {
        localStorage.setItem("proposal", id)
        document.location.href = `.#/policyContent/${id.id}`
    }

    getList = () => {
        let d = {}
        let term = []
        let status = []
        for (let key in this.state.like) {
            for (let v in this.state.like[key]) {
                if (this.state.like[key][v]) {
                    switch (key) {
                        case "屆別":
                            term.push(v)
                            break;
                        case "狀態":
                            status.push(v)
                            break
                        default: break
                    }
                }
            }
        }
        if (term.length > 0) {
            d["term"] = term
        }
        if (status.length > 0) {
            d["status"] = status
        }
        this.handleF()

    }
    componentDidMount() {
        let page = this.props.match.params.id
        console.log(page)
        trackPromise(
            ProposalR.list({ page: page ? page : 1 }).then(response => {
                let resData = response.data.D
                this.setState({ "Sdata": resData.list, resource: resData.list, pageTotal: resData.page })

            })
        )
        trackPromise(
            ProposalR.cond().then(response => {
                let resData = response.data.D
                let test = {}
                console.log(Object.keys(resData))
                for (let i of Object.keys(resData)) {
                    let inside = []
                    for (let j of resData[i]) {
                        j["check"] = false
                        inside.push(j)
                    }
                    test[i] = inside
                }
                this.setState({ "like": test })
            })
        )
    }

    handlePaginationChange = (e, { activePage }) => {
        trackPromise(
            ProposalR.list({ page: activePage }).then(response => {
                let resData = response.data.D
                this.setState({ "Sdata": resData.list, resource: resData.list, pageTotal: resData.page, nowPage: activePage })

            })
        )

        document.location.href = `/#/Policy/${activePage}`

    }
    handleF = () => {
        let statusL = []
        console.log(this.state.like["狀態"])
        if (this.state.like["狀態"] instanceof Array) {
            this.state.like["狀態"].forEach(item => {
                if (item.check) statusL.push(item.id)
            })
            this.setState({ "cond": statusL })
            trackPromise(
                ProposalR.list({ "status_id": statusL, page: 1 }).then(response => {
                    let resData = response.data.D
                    this.setState({ "Sdata": resData.list, resource: resData.list, pageTotal: resData.page })

                })
            )
        }
    }

    render() {
        return (<Pages id={ 2 } pageInfo={ [{ content: '提案專區', active: true, href: "./#/Policy" }] } page={
            (<>
                <div>
                    <Search like={ this.state.like } getList={ this.getList } />
                </div>

                <List divided relaxed animated className={ style.list }>
                    { this.state.Sdata && this.state.Sdata.map((placement, index) => {
                        let voteT = placement.good + placement.med + placement.bad
                        return (<List.Item onClick={ () => { this.toContent(placement) } }>
                            <Grid>
                                <Grid.Row className={ utilStyle.point } columns={ 3 } verticalAlign={ "bottom" }>
                                    <Grid.Column width={ 1 } />
                                    <Grid.Column width={ 15 } only="mobile">
                                        <div>提案人：{ placement.name.map(item => { return (<><Label >{ item }</Label></>) }) }</div>
                                        <h3 className={ style.ellipsis }>{ placement.title }</h3></Grid.Column>
                                    <Grid.Column width={ 1 } only="mobile" />
                                    <Grid.Column width={ 10 } mobile={ 7 } computer={ 10 } tablet={ 8 }>
                                        <Grid>
                                            <Grid.Row  >
                                                <Grid.Column width={ 14 } only="computer tablet">
                                                    <div>提案人：{ placement.name.map(item => { return (<><Label >{ item }</Label></>) }) }</div>
                                                    <h3 className={ style.ellipsis }>{ placement.title }</h3>
                                                </Grid.Column>
                                                <Grid.Column width={ 16 } computer={ 12 }>提案進度：{ placement.status }
                                                    { Array.isArray(placement.c_name) ? <>

                                                        {
                                                            placement.c_name.map((item, index) => {
                                                                return (<>
                                                                    { <Label >{item}</Label> }
                                                                </>)
                                                            })
                                                        }
                                                    </> : <></> }
                                                </Grid.Column>
                                            </Grid.Row>
                                        </Grid>
                                    </Grid.Column>
                                    <Grid.Column width={ 5 } computer={ 5 } tablet={ 7 } floated={ "left" }  >
                                        <BarChart data={ [
                                            { value: placement.good > 0 ? placement.good / voteT * 100 : 0, name: "同意", color: "#fec240" },
                                            { value: placement.med > 0 ? placement.med / voteT * 100 : 0, name: "中立", color: "#98c4d1" },
                                            { value: placement.bad > 0 ? placement.bad / voteT * 100 : 0, name: "反對", color: "#de4b43" }

                                        ] }> </BarChart>
                                    </Grid.Column>
                                </Grid.Row></Grid>

                        </List.Item>)
                    }) }</List>
                <Segment basic textAlign={ "center" }>
                    <Pagination

                        activePage={ this.state.nowPage }
                        boundaryRange={ 0 }
                        secondary
                        defaultActivePage={ 1 }
                        onPageChange={ this.handlePaginationChange }
                        size='mini'
                        siblingRange={ 1 }
                        ellipsisItem={ null }
                        totalPages={ this.state.pageTotal }

                    />
                </Segment>

            </>)
        } />)
    }
}





export default Policy = {
    routeProps: {
        path: "/Policy/:id",
        component: Policy
    },
    name: "提案專區"
}
