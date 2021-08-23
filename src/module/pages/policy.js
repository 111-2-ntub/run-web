import React from 'react';
import { Pages } from "../pages.js";
import Chart from 'react-apexcharts'
import style from "../../css/policy.module.css"
import utilStyle from "../../css/util.module.css"

import { ProposalR } from "../request/proposalR"
import Search from "../bar/search"
import { trackPromise } from 'react-promise-tracker';

import { Grid, Icon, List, Label, Pagination, Segment } from 'semantic-ui-react'

class Policy extends React.Component {



    constructor(props) {
        super(props)
        this.state = {
            kpi: {
                series: [10, 50, 40],
                options: {
                    colors: ['#fec240', '#98c4d1', '#de4b43'],
                    labels: ["同意", "中立", "反對"],
                    title: {
                        text: 'Run民立場投票',
                        align: 'left',

                    },
                },
            },
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

        // console.log(this.state.like)
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
        // if (Array.isArray(this.state.resource)) {
        //     let newd = this.state.resource.filter(i => {


        //         let termb = false
        //         let statusb = false

        //         if (term.length > 0) {
        //             term.forEach(item => { if (i["term"] === item) { termb = true; return; } })
        //         }
        //         if (status.length > 0) {
        //             status.forEach(item => { if (i["status"] === item) { statusb = true; return; } })
        //         }

        //         termb = term.length > 0 ? termb : true
        //         statusb = status.length > 0 ? statusb : true

        //         return termb & statusb
        //     })
        //     console.log(newd)

        //     this.setState({ "Sdata": newd })


        // }
    }
    componentDidMount() {

        ProposalR.list({ page: 1 }).then(response => {
            console.log(response)
            this.setState({ "Sdata": response.data.list, resource: response.data.list, pageTotal: response.data.page })

        })
        ProposalR.cond().then(response => {
            let test = {}
            for (let i of response.data.data) {
                let inside = []
                for (let j of i.data) {
                    j["check"] = false
                    inside.push(j)
                    // inside["id"]=j.id
                }
                test[i.name] = inside

            }
            console.log(test)
            this.setState({ "like": test })
        })




        // this.setState({ condData: [{ n: "進度", d: ["完全落實", "部分落實", "進行中"] }] })
    }
    // test = () => {
    //     fetch("http://localhost:5000/politician/list?name='abc','name'&name=[ab,dd]", {
    //         method: "GET",
    //         headers: {
    //             "Content-Type": "application/json",
    //             'Access-Control-Allow-Origin': '*',
    //         },

    //     }).then(res => res.json()).then(r => { console.log(r) })
    // }
    handlePaginationChange = (e, { activePage }) => {
        this.setState({ nowPage: activePage })
        console.log(activePage)
        let data
        (this.state.cond)? data={"status_id":this.state.cond,"page":activePage}:data={ "page": activePage }
        ProposalR.list(data).then(response => {
            window.scrollTo(0, 0)
            this.setState({ "Sdata": response.data.list, resource: response.data.list, pageTotal: response.data.page[0].n })

        })
    }
    handleF = () => {
        console.log(this.state.like["狀態"])
        let statusL = []
        this.state.like["狀態"].map(item => {
            if (item.check) statusL.push(item.id)
        })

        console.log(statusL)
        this.setState({ "cond": statusL })
        ProposalR.list({ "status_id": statusL, page: 1 }).then(response => {
            console.log(response)
            this.setState({ "Sdata": response.data.list, resource: response.data.list, pageTotal: response.data.page })

        })

    }

    render() {
        return (<Pages id={ 2 } pageInfo={ [{ content: '提案專區', active: true, href: "./#/Policy" }] } page={
            (<>
                <div>
                    <Search like={ this.state.like } getList={ this.getList } />
                </div>

                {/* <button onClick={ this.test }>click me</button> */ }
                <List divided relaxed animated className={ style.list }>
                    { this.state.Sdata && this.state.Sdata.map((placement, index) => {
                        return (<List.Item onClick={ () => { this.toContent(placement) } }>
                            <Grid>
                                <Grid.Row className={ utilStyle.point } columns={ 3 }>
                                    <Grid.Column width={ 1 } />
                                    <Grid.Column width={ 11 }>
                                        <div>提案人：{ placement.proposer.map(item => { return (<><Label >{ item }</Label></>) }) }</div>
                                        <h3 className={ style.ellipsis }>{ placement.title }</h3>
                                        <div>
                                            <List horizontal>
                                                <List.Item>
                                                    2021/2/1{ placement.date }
                                                </List.Item>
                                                <List.Item>提案進度：{ placement.status }</List.Item>
                                                { placement.category.map(item => { return (item != null ? <List.Item><Label>{ item }</Label></List.Item> : <></>) }) }
                                            </List>

                                        </div>
                                        <Grid>
                                            <Grid.Row >
                                                <Grid.Column width={ 2 }><Icon name='comments' />68</Grid.Column>
                                                <Grid.Column width={ 2 }><Icon name='heart' />收藏</Grid.Column>
                                            </Grid.Row>
                                        </Grid>
                                    </Grid.Column>
                                    <Grid.Column width={ 4 } >
                                        <Chart options={ this.state.kpi.options }
                                            series={ this.state.kpi.series } type="donut"
                                            height="125px" />
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
                    // Heads up! All items are powered by shorthands, if you want to hide one of them, just pass `null` as value

                    />
                </Segment>

            </>)
        } />)
    }
}





export default Policy = {
    routeProps: {
        path: "/Policy",
        component: Policy
    },
    name: "提案專區"
}
