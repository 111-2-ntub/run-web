import React from 'react';

import { Grid, Button, List, Checkbox } from 'semantic-ui-react'
import style from "./search.module.css"
export default class Search extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            count: 0, hasMore: [], t: {}
        }
    }

    componentDidMount() {
        this.setState({ like: this.props.like })
    }

    componentDidUpdate() {

        let d = document.getElementsByClassName(style.box)
        let hasMore = []
        for (let i of d) {
            hasMore.push(i.scrollHeight > 40)
        }
        if (hasMore.length !== this.state.hasMore.length) {
            this.setState({ hasMore: hasMore })
        }
    }

    remove = (c, v) => {

        let d = this.props.like
        d[c][v] = false
        console.log(d[c][v])
        this.setState({ like: d, count: this.state.count - 1 })        
        this.props.getList()
    }

    newOn = (name, item) => {
        let likePrev = this.props.like
        let count = this.state.count
        let temp = likePrev[name][item]["check"]
        likePrev[name][item]["check"] = !temp
        if (temp) { count -= 2 }
        this.setState({ like: likePrev, count: count + 1 })
        this.props.getList()

    }
    removeAll = () => {
        let d = this.props.like
        for (let [key, value] of Object.entries(d)) {
            console.log(value)
            for (let [k] of Object.entries(value)) {
                if (d[key][k.check]) { d[key][k.check] = false }
            }
        }
        this.setState({ like: d, count: 0 })

    }
    more = (c) => {
        let a = document.getElementById(c)

        if (a.offsetHeight < 40) {
            a.classList.remove(style.box)
        }
        else {
            a.classList.add(style.box)
        }
    }


    render() {
        return (<div className={ style.searchBar }>
            <Grid className={ style.border } >
                {/* <Grid.Row verticalAlign={ "middle" }>
                    { this.state.count > 0 ? <>
                        <Grid.Column width={ "auto" }>篩選條件</Grid.Column>
                        <Grid.Column width={ 13 } >
                            { this.props.like && Object.keys(this.props.like).map((placement, index) => {
                                return (<>
                                    { (this.props.like[placement]).map(item => {
                                        return (item.check ?
                                            <Button
                                                icon={ "x" }
                                                content={ item.name }
                                                onClick={ () => { this.remove(placement, item) } } className={ style.button } /> : <></>

                                        )
                                    }) } </>)
                            }) }
                        </Grid.Column>
                        <Grid.Column width={ 2 }></Grid.Column>
                        <Grid.Column width={ 13 }>
                             <Button secondary onClick={ this.removeAll } className={ style.clearbtn } >清除全部</Button> 
                        </Grid.Column></> : <></> }
                </Grid.Row> */}
                { this.props.like && Object.keys(this.props.like).map((placement, index) => {
                    return (<> <Grid.Row >
                        <Grid.Column width={ 1 }>{ placement }</Grid.Column>
                        <Grid.Column width={ 11 } textAlign={ "justified" } verticalAlign={ "middle" }>
                            <List horizontal className={ style.box } id={ placement }>

                                { this.props.like[placement].map((item, index) => {
                                    return (<><List.Item className={ style.state_listItem }>

                                        <Checkbox label={ item.name } name={ placement } value={ item.id }
                                            onChange={ () => { this.newOn(placement, index) } } checked={ this.props.like[placement][item.check] } />

                                    </List.Item>
                                    </>)
                                }) }  </List>
                        </Grid.Column>
                        <Grid.Column width={ 2 }>{ this.state.hasMore[index] ? (<Button variant="outline-secondary" onClick={ () => { this.more(placement) } }>更多</Button>) : "" }</Grid.Column>  </Grid.Row>
                    </>)
                }) }


            </Grid>
        </div>)
    }
}