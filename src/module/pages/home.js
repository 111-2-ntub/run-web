import React from 'react';
import { Pages } from "../pages.js"
import person from "../../imgs/person.png"
import r from "../../imgs/R.png"
import invit from "../../imgs/invit.gif"
import { Grid, Header, Segment } from 'semantic-ui-react'
import { HomeFirst, HomeTable, TailwindModal } from "../tailwind"
import style from "../../css/main.module.css"
import { HomeR } from '../request/homeR.js';
import { trackPromise } from 'react-promise-tracker';

import 'swiper/components/navigation/navigation.scss';
import 'swiper/components/pagination/pagination.scss';
// import Swiper core and required modules
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y, Mousewheel } from 'swiper';

import { Swiper, SwiperSlide } from 'swiper/react';


class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

            imageData: [
                r,
                invit
            ],

        }
    }
    componentDidMount() {
        trackPromise(
            HomeR.home().then(res => {
                let resData = res.data.D
                this.setState({ politics: resData.policy, message: resData.mes, proposal: resData.proposal, chart: resData.rank })
                
            }, error => console.log(error))
        )
        
    }


    render() {
        SwiperCore.use([Navigation, Pagination, Scrollbar, A11y, Mousewheel,]);
        return (<Pages id={ 0 } page={
            (<>
                <div >
                    <div >
                        <Swiper
                            spaceBetween={ 50 }
                            slidesPerView={ 1 }
                            navigation
                            mousewheel
                            pagination={ { clickable: true } }
                        >
                            { this.state.imageData.map(item => {
                                return (<SwiperSlide  ><center><img src={ item } alt="" /></center></SwiperSlide>)
                            }) }
                        </Swiper>
                    </div>                  
                    <div className={ style.sort }>
                        <Header textAlign={ "center" } as={ "h1" }>人物排行榜 </Header>
                        <Segment basic textAlign={ "center" }>
                            <div>你知道哪一位政治人物提出政見後，有「說到做到」嗎?</div>
                            <div>這裡可以一網打盡!</div>
                            <div>透過政見執行率的評分找出前三名，讓我們一起來看看吧!</div>
                            <div><TailwindModal show={ false } child={(<>
                            test</>)}></TailwindModal></div>
                        </Segment>
                        <div class="grid grid-cols-1 flex-shrink md:flex-shrink-0 md:grid-cols-3 ">
                            {
                                this.state.chart ? this.state.chart.map((item, index) => {
                                    return (<>
                                        <div class="relative flex items-center justify-center mb-10">
                                            <div class="container flex justify-center">
                                                <div class="w-52 h-80 sm:h-auto sm:w-72 bg-white shadow-lg rounded-xl p-6">
                                                    <div class="flex flex-col ">
                                                        <div class="">
                                                            <div class="relative sm:h-72 w-full sm:mb-10">
                                                                <img src={ item.photo } alt="Just a flower" class=" h-18 w-auto   object-fill  rounded-2xl" />
                                                            </div>
                                                            <div class="flex-auto justify-evenly ">
                                                                <div class="flex flex-wrap ">
                                                                    <div class="w-full flex-none text-sm flex items-center text-gray-600">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-red-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                        </svg>
                                                                        <span class="mr-2 text-gray-400">
                                                                            { item.score }分
                                                                        </span>
                                                                    </div>

                                                                </div>
                                                                <div class="text-xl  font-semibold mt-1">{ item["name"] }</div>
                                                                <div class="lg:flex  py-4  text-sm text-gray-600">


                                                                </div>
                                                                <div class="flex space-x-2 text-sm font-medium justify-start"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </>)
                                }) : <></>
                            }

                        </div>
                    </div>
                </div>
                <Grid columns={2}>
                    <Grid.Row stretched className="mt-6">
                        <Grid.Column width={ 16 }><h1 className={ style.hotMsg + "m-3" }   >最熱門留言</h1></Grid.Column>

                        <Grid.Column className='justify-center' width={ 6 } mobile={ 16 } tablet={ 6 } computer={ 6 }>
                            { this.state.message == null ? <></> : <>
                            <div class="flex items-stretch ">
                                <HomeFirst person={ person } name={ this.state.message[0].name } title={ this.state.message[0].title } score={ this.state.message[0].score }></HomeFirst>
                            </div>
                            </> }
                        </Grid.Column>

                        <Grid.Column className='justify-center'width={ 10 } mobile={ 16 } computer={ 10 } tablet={ 10 }>                        
                            <HomeTable data={ this.state.message } person={ person }></HomeTable>                        
                        </Grid.Column>

                    </Grid.Row>
                    
                    <Grid.Row stretched className="mt-8">
                        <Grid.Column width={ 16 }> <h1 className={ style.hotPolicy + " m-3" }  >最熱門政見</h1></Grid.Column>

                        <Grid.Column className='justify-center' width={ 6 } mobile={ 16 } tablet={ 6 } computer={ 6 }>
                            { this.state.politics == null ? <></> : <>
                            <div class="flex items-stretch">
                                <HomeFirst person={ this.state.politics[0].photo } name={ this.state.politics[0].name } title={ this.state.politics[0].title } score={ this.state.politics[0].score }></HomeFirst>
                            </div>
                            </> }
                        </Grid.Column>

                        <Grid.Column className='justify-center'width={ 10 } mobile={ 16 } computer={ 10 } tablet={ 10 }>
                            <HomeTable data={ this.state.politics } ></HomeTable>
                        </Grid.Column>
                    </Grid.Row>

                    <Grid.Row stretched className="mt-6">
                        <Grid.Column width={ 16 }>  <h1 className={ style.hotProposal + " m-3" } >最熱門提案</h1></Grid.Column>
                        <Grid.Column width={ 6 } mobile={ 16 } tablet={ 6 } computer={ 6 }>
                            { this.state.politics == null ? <></> : <>
                            <div class="flex items-stretch">
                                <HomeFirst  title={ this.state.proposal[0].title } score={ this.state.proposal[0].score }></HomeFirst>
                            </div>
                            </> }

                        </Grid.Column>
                        <Grid.Column width={ 10 } mobile={ 16 } computer={ 10 } tablet={ 10 }>
                            <HomeTable data={ this.state.proposal } ></HomeTable>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>




            </>)
        } />)
    }
}





export default Home = {
    routeProps: {
        path: "/",
        component: Home
    },
    name: "首頁"
}
