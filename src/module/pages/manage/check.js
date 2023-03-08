import React from 'react';
import { Grid } from 'semantic-ui-react'
import { ManageR } from "../../request/manageR"
import { Tab, Button } from 'semantic-ui-react'
import { trackPromise } from 'react-promise-tracker';

export default class Check extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userName: localStorage.getItem("login"),
        }
    }
    componentDidMount() {
        trackPromise(
            ManageR.report().then(res => {
                console.log(res)
                let d = res.data.D
                if (d) {
                    this.setState({ already: d.already, notYet: d.not_yet })
                }
            })
        )
    }

    report = (c_id, r_id) => {
        let d = new Date();
        d.setDate(d.getDate() + 7);
        trackPromise(
            ManageR.check({ check: c_id, report_id: r_id, manager_id: this.state.userName, time: d }).then(res => {
                console.log(res)
            })
        )
    }

    render() {
        const panes = [
            {
                menuItem: '未審核', render: () => <Tab.Pane>
                    <Grid>
                        <Grid.Row >
                            <Grid.Column width={ 8 }><h3>檢舉留言</h3></Grid.Column>
                            <Grid.Column width={ 3 }><h3>備註</h3></Grid.Column>
                            <Grid.Column width={ 5 }><h3>操作</h3></Grid.Column>
                        </Grid.Row>
                        { this.state.notYet && this.state.notYet.map((item, index) => {
                            return (<>
                                <Grid.Row >
                                    <Grid.Column width={ 8 } >{ item.content }</Grid.Column>
                                    <Grid.Column width={ 3 }>{ item.remark }</Grid.Column>
                                    <Grid.Column width={ 5 }>
                                        <Button onClick={ () => this.report(1, item.id) }>停權</Button>
                                        <Button onClick={ () => this.report(0, item.id) }>不停權</Button>
                                    </Grid.Column></Grid.Row>
                            </>)
                        }) }
                    </Grid>
                </Tab.Pane>
            },
            {
                menuItem: '已審核', render: () => <Tab.Pane>

                    <Grid> <Grid.Row >
                        <Grid.Column width={ 8 }><h3>檢舉留言</h3></Grid.Column>

                        <Grid.Column width={ 5 }><h3>審核者</h3></Grid.Column>  </Grid.Row >
                        {
                            this.state.already && this.state.already.map((item, index) => {
                                return (<>
                                    <Grid.Row > <Grid.Column width={ 10 } >{ item.content }</Grid.Column>
                                        <Grid.Column width={ 6 }>

                                        </Grid.Column></Grid.Row>
                                </>)
                            })
                        }
                    </Grid>
                </Tab.Pane >
            },

        ]
        return (<>
            <Tab menu={ { secondary: true } } panes={ panes } />
        </>);
    }
}