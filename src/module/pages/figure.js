import React from 'react';

import { Pages } from "../pages.js"
import { PoliticianR } from "../request/politicianR"
// import utilStyle from "../../css/main.module.css"
import {  Grid } from 'semantic-ui-react'
import { trackPromise } from 'react-promise-tracker'
import Search from "../bar/search"
class Figure extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            like: {

            },
            listD: []
        }
    }
    componentDidMount() {

        trackPromise(
            PoliticianR.getList().then(response => {
                let resData = response.data.D
                this.setState({ "data": resData, resource: resData })
            })
        )
        trackPromise(
            PoliticianR.cond().then(response => {
                console.log(response)
                let resData = response.data.D
                let test = {}
                for (let i of Object.keys(resData)) {
                    // console.log(i)
                    let inside = []
                    for (let j of resData[i]) {
                        // console.log(j)
                        j["check"] = false
                        inside.push(j)
                    }
                    test[i] = inside

                }
                console.log(test)
                this.setState({ "like": test })
            })
        )



    }

    getList = () => {
        let d = {}
        let term = []
        let area = []
        let name = []
        for (let key in this.state.like) {
            for (let v in this.state.like[key]) {
                if (this.state.like[key][v]["check"]) {
                    console.log(this.state.like[key][v]["name"])
                    switch (key) {
                        case "屆別":
                            term.push(this.state.like[key][v]["name"])
                            break;
                        case "地區":
                            area.push(this.state.like[key][v]["name"])
                            break;
                        case "姓名":
                            name.push(this.state.like[key][v]["name"])
                            break
                        default: break
                    }
                }

            }

        }
        if (term.length > 0) {
            d["term"] = term
        }
        if (area.length > 0) {
            d["other"] = area
        }
        if (Array.isArray(this.state.resource)) {
            let newd = this.state.resource.filter(i => {


                let areab = false
                let termb = false
                let nameb = false

                if (area.length > 0) { area.forEach(item => { if (i["a_n"] === item) { areab = true; return; } }) }
                if (term.length > 0) {
                    term.forEach(item => { if (i["term"] === item) { termb = true; return; } })
                }
                if (name.length > 0) {
                    name.forEach(item => { if (i["name"] === item) { nameb = true; return; } })
                }
                areab = area.length > 0 ? areab : true
                termb = term.length > 0 ? termb : true
                nameb = name.length > 0 ? nameb : true

                return areab & termb & nameb
            })

            this.setState({ "data": newd })

        }


    }

    toDetail = (toName) => {
        document.location.href = `.#/figure/${toName}`
    }
    onScroll = (e) => {
        let element = e.target
        console.log(element)
    }

    cut = (obj, n) => {
        var regPos = /^[0-9]+.?[0-9]*/; //判断是否是数字。

        if ("d" in obj) {
            return (

                < >
                    <p>{obj["name"]}</p>
                    {(!regPos.test(obj["name"]) ? <>

                        {obj["d"].map(placement => {
                            return this.cut(placement, obj["name"])
                        })}
                    </> : < >
                        {obj["d"].map(placement => {
                            return this.cut(placement, obj["name"])
                        })}</ >
                    )}



                </ >)
        } else {
            return (< >

                {/* <Segment. */} <Grid.Column computer={4} mobile={7}>
                    {/* <Card onClick={ () => { this.toDetail(obj["id"]) } }> */}
                    <div class="relative flex flex-col items-center justify-center mb-10 ">
                        <div class="container ">
                            <div class="w-32 md:w-auto bg-white shadow-lg rounded-xl p-4">
                                <div class="flex flex-col ">
                                    <div class="">
                                        <div class="relative h-68 w-full mb-10 " >
                                            <img src={obj["photo"]} alt="Just a flower" class=" h-18 w-auto   object-fill  rounded-2xl" />
                                        </div>
                                        <div class="flex-auto ">
                                            <div class="flex flex-wrap">
                                                <div class="w-full flex-none text-sm flex items-center text-gray-600">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-red-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                    <span class="text-gray-400 whitespace-nowrap mr-3">{obj["score"]}</span>
                                                    <span class="mr-2 text-gray-400 ">{obj["a_n"]}</span>
                                                </div>

                                            </div>
                                            <div class="text-xl  font-semibold mt-1">{obj["name"]}</div>
                                            <div class="lg:flex  py-4  text-sm text-gray-600">
                                            </div>

                                            {/* 大螢幕 */} 
                                            <div class="space-x-2 text-sm font-medium justify-center hidden lg:flex">
                                                <button class="transition ease-in duration-300 inline-flex items-center text-sm font-medium mb-2 md:mb-0 bg-gray-500 px-5 py-2 hover:shadow-lg tracking-wider text-white rounded-full hover:bg-gray-600 "
                                                    onClick={() => { this.toDetail(obj["id"]) }}
                                                >
                                                    <span>更多 </span>
                                                </button>
                                            </div>

                                            {/* 小螢幕 */} 
                                            <div class="flex space-x-2 text-sm font-medium justify-center lg:hidden">
                                                <button class="transition ease-in duration-300 inline-flex items-center text-sm font-medium mb-2 md:mb-0 bg-gray-500 px-5 py-2 hover:shadow-lg tracking-wider text-white rounded-full hover:bg-gray-600 "
                                                    onClick={() => { this.toDetail(obj["id"]) }}
                                                >
                                                    <span>更多 </span>
                                                </button>                                                
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    {/* <Card.Content>
                        <Card.Header>{ obj["name"] }</Card.Header>
                        <Card.Meta>
                            <span >{ obj["a_n"] }</span>
                        </Card.Meta>
                        <Card.Description>
                            <Image src={ obj["photo"] } wrapped />
                        </Card.Description>
                    </Card.Content> */}

                </Grid.Column>



            </ >)
        }
    }

    render() {
        return (<Pages id={3}
            pageInfo={[{ content: '政治人物', active: true, href: "./#/figure" }]}
            onScroll={console.log("ii")}
            page={
                (<>
                    <div  >
                        <Search like={this.state.like} getList={this.getList} />
                    </div>
                    <div>


                    </div>
                    <Grid relaxed centered>
                        <Grid.Row>

                            {
                                this.state.data && this.state.data.map(placement => {
                                    return this.cut(placement)
                                })
                            }

                        </Grid.Row>
                    </Grid>

                </>)
            } />)
    }
}





export default Figure = {
    routeProps: {
        path: "/figure",
        component: Figure
    },
    name: "人物專區"
}
