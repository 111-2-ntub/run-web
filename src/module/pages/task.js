import React from 'react';
import { Grid } from 'semantic-ui-react'
import { Pages } from "../pages.js"




class Task extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            show: false,
            data: [
                { title: "提案標題", content: "我是內文", tag: ["金融", "國防"], date: "2020/11/22" },
                { title: "提案標題2", content: "我是內文2", tag: ["金融", "國防"], date: "2020/11/22" }
            ],
            inputValue: '',
        }

    }
    clickMe = (m, c, t) => {
        if (!this.state.show) {
            this.setState({
                message: m,
                content: c,
                tag: t
            })
        }
        this.setState({
            show: !this.state.show
        })

    }
    render() {
        return (<Pages page={
            <>
                {this.state.data.map(placement => {
                    return (<>
                       <Grid> <Grid.Row onClick={ () => { this.clickMe(placement.title, placement.content,placement.tag) } }>

                            <div className="col-5 grid-margin stretch-card">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="card-title">{ placement.title }</div>
                                        <div className="d-flex">

                                            <div className="d-flex  text-muted font-weight-light">
                                                <i className="mdi mdi-clock icon-width mr-2"></i>
                                                <span>{ placement.date }</span>
                                            </div>
                                        </div>
                                        <div className="row mt-3">
                                            <div className="col-6 pr-1">

                                            </div>
                                            <div className="col-6 pl-1">

                                            </div>
                                        </div>
                                        <div className="d-flex mt-5 align-items-start">
                                            <div className="mb-0 flex-grow">
                                                <h5 className="mr-2 mb-2">{ placement.content }</h5>
                                            </div>
                                            <div className="ml-auto">
                                                <i className="mdi mdi-heart-outline text-muted"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                       </Grid.Row></Grid>  

                    </>)
                }) }
              
            </>
        }>
        </Pages>

        );
    }
}


export default Task = {
    routeProps: {
        path: "/task",
        component: Task
    },
    name: "人物專區"
}