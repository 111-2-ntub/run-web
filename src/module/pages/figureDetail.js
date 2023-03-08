import React from 'react';
import { Pages } from "../pages.js"
import { Card, Button, Label, Segment, Table } from 'semantic-ui-react'
// import Chart from 'react-apexcharts'
import { Line, Bar } from 'react-chartjs-2';
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y, Mousewheel } from 'swiper';
import 'swiper/components/navigation/navigation.scss';
import 'swiper/components/pagination/pagination.scss';
import style from "../../css/figureDetail.module.css"
import { PoliticianR } from "../request/politicianR"
import { trackPromise } from 'react-promise-tracker';
import { ScoreModal, InfoModal } from "../modal"
import { Grid } from 'semantic-ui-react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { RadioGroup } from '@headlessui/react'

class FigureDetail extends React.Component {
    figureID = null
    constructor(props) {
        super(props)
        this.state = {
            "login": !!localStorage.getItem("login"),
            userName: localStorage.getItem("login"),
            selfD: [{ no: "degree", name: "學歷" }, { no: "tel", name: "電話" }],
            scoreShow: false,
            scoreRule: [
                { name: "完全落實", class: "outline-success", remark: "承諾的政見確實已完成" },
                { name: "部分落實", class: "outline-success", remark: "承諾的政見有部分完成" },
                { name: "進行中", class: "outline-warning", remark: "相關政策已有草案版本" },
                { name: "卡住", class: "outline-warning", remark: "政府提出草案已進入審議程序，但進度卡關（例如被立法院杯葛）" },
                { name: "開始動作", class: "outline-warning", remark: "政府相關部會已開始進行研究，但尚未有草案版本" },
                { name: "未有動作", class: "outline-danger", remark: "政府相關部會沒有任何動作" },
                { name: "政策破局", class: "outline-danger", remark: "明確違背原本承諾的政見" }
            ],
            scoreActitivy: null,
            open: false,
            openTable: false,
            plan: 0
        }
    }
    componentDidMount() {
        this.figureID = this.props.match.params.id
        trackPromise(
            PoliticianR.detail(this.figureID).then(res => {
              
                let resData = res.data.D
                let cond = [{ no: "degree", name: "學歷" }, { no: "tel", name: "電話" }]
                let selfD = []
                cond.forEach(placement => {
                    if (placement["no"] in resData.detail[0]) {
                        selfD.push({
                            "content": resData.detail[0][placement.no].replace(/;/g, " <br />"),
                            "title": placement.name
                        })
                        document.getElementById(placement.no).innerHTML = resData.detail[0][placement.no]
                            .replace(/;/g, " <br />").replace(/,/g, " <br />")

                    }
                })
                
                let trend_attend = {
                    labels: [],
                    datasets: [
                        {
                            label: '該政治人物',
                            data: [],
                            fill: false,
                            backgroundColor: '#FEC240',
                            borderColor: '#FEC240',
                        },
                        {
                            label: '該政治人物總平均',
                            data: [],
                            fill: false,
                            backgroundColor: '#DE4B43',
                            borderColor: '#DE4B43',
                        },
                        {
                            label: '立委平均',
                            data: [],
                            fill: false,
                            backgroundColor: '#98C4D1',
                            borderColor: '#98C4D1',
                        }
                    ]
                }
                let trend_policy= {
                    labels: [],
                    datasets: [
                        {
                            label: '該政治人物',
                            data: [],
                            fill: false,
                            backgroundColor: '#FEC240',
                            borderColor: '#FEC240',
                        },
                        // {
                        //     label: '該政治人物總平均',
                        //     data: [],
                        //     fill: false,
                        //     backgroundColor: '#DE4B43',
                        //     borderColor: '#DE4B43',
                        // },
                        {
                            label: '立委總平均',
                            data: [],
                            fill: false,
                            backgroundColor: '#98C4D1',
                            borderColor: '#98C4D1',
                        }
                    ],
                };
                
                let trend_pro= {
                    labels: [],
                    datasets: [
                        {
                            label: '當屆',
                            data: [],
                            backgroundColor: '#FEC240',
                        },
                        {
                            label: '歷屆平均',
                            data: [],
                            backgroundColor: '#98C4D1',
                        },
                    ],
                };
                //出席率
                let trend_attend_avg = 0;         
                       

                for (let i in resData.trend_attend_group) {
                    let item = resData.trend_attend_group[i]
                    let figure = resData.attend[i]
                    trend_attend.labels.push(item.session)
                    trend_attend.datasets[0].data.push(figure.attend)
                    trend_attend_avg += figure.attend
                    trend_attend.datasets[2].data.push(item.avg)
                }
                let attend_avg=Math.round(trend_attend_avg / resData.attend.length)
                for (let i in resData.attend) {
                    trend_attend.datasets[1].data.push(attend_avg)
                }
            
                //政見分數
                for(let i in resData.trend_policy_group){
                    let item =resData.trend_policy_group[i]
                    trend_policy.labels.push(item.t)
                    // trend_policy.datasets[2].data.push(item.score)
                    trend_policy.datasets[0].data.push(resData.trend_policy[i].score)
                    trend_policy.datasets[1].data.push(item.score)
                }
                console.log("success")
                //提案數
                for(let i in resData.pro){
                    let item =resData.pro[i]
                    console.log(resData.trend_pro[i].c)
                    trend_pro.labels.push(item.status)
                    trend_pro.datasets[0].data.push(item.c)
                    trend_pro.datasets[1].data.push(Math.floor(resData.trend_pro[i].c))
                }
                console.log(trend_pro)
                this.setState({
                    policy: resData.policy,
                    name: resData.detail[0].name,
                    area: resData.detail[0].e_n,
                    experience: resData.detail[0].experience.split("\n"),
                    areaReamrk: resData.detail[0].remark.replace("null", ""),
                    photo: resData.detail[0].photo,
                    table: resData.table_policy,
                    tableDetail: resData.table_policyDetail,
                    attend: attend_avg,
                    score: resData.count_score[0]["score"],
                    proposal_quota: resData.proposal_quota[0]["quota"],
                    proposal: resData.proposal,
                    trend_attend: trend_attend,
                    trend_policy:trend_policy,
                    trend_pro:trend_pro
                })
                console.log(resData)

            }, error => { console.log(error) })
        )

        this.changeTerm("當屆")

    }

    changeTerm = (s) => this.setState({ term: s })
    setPlan = (p) => { this.setState({ plan: p }) }
    scoreShow = (txt, id, tag) => {

        if (this.state.login) {
            this.setState({ scoreShow: !this.state.scoreShow, scoreTitle: txt, scoreId: id, tag: tag })
        } else {

        }
    }
    forreload=()=>{
        trackPromise(
            PoliticianR.detail(this.figureID).then(res => {
              
                let resData = res.data.D
                let cond = [{ no: "degree", name: "學歷" }, { no: "tel", name: "電話" }]
                let selfD = []
                cond.forEach(placement => {
                    if (placement["no"] in resData.detail[0]) {
                        selfD.push({
                            "content": resData.detail[0][placement.no].replace(/;/g, " <br />"),
                            "title": placement.name
                        })
                        document.getElementById(placement.no).innerHTML = resData.detail[0][placement.no]
                            .replace(/;/g, " <br />").replace(/,/g, " <br />")

                    }
                })
                
                let trend_attend = {
                    labels: [],
                    datasets: [
                        {
                            label: '該政治人物',
                            data: [],
                            fill: false,
                            backgroundColor: '#FEC240',
                            borderColor: '#FEC240',
                        },
                        {
                            label: '該政治人物總平均',
                            data: [],
                            fill: false,
                            backgroundColor: '#DE4B43',
                            borderColor: '#DE4B43',
                        },
                        {
                            label: '立委平均',
                            data: [],
                            fill: false,
                            backgroundColor: '#98C4D1',
                            borderColor: '#98C4D1',
                        }
                    ]
                }
                let trend_policy= {
                    labels: [],
                    datasets: [
                        {
                            label: '該政治人物',
                            data: [],
                            fill: false,
                            backgroundColor: '#FEC240',
                            borderColor: '#FEC240',
                        },
                        // {
                        //     label: '該政治人物總平均',
                        //     data: [],
                        //     fill: false,
                        //     backgroundColor: '#DE4B43',
                        //     borderColor: '#DE4B43',
                        // },
                        {
                            label: '立委總平均',
                            data: [],
                            fill: false,
                            backgroundColor: '#98C4D1',
                            borderColor: '#98C4D1',
                        }
                    ],
                };
                
                let trend_pro= {
                    labels: [],
                    datasets: [
                        {
                            label: '當屆',
                            data: [],
                            backgroundColor: '#FEC240',
                        },
                        {
                            label: '歷屆平均',
                            data: [],
                            backgroundColor: '#98C4D1',
                        },
                    ],
                };
                //出席率
                let trend_attend_avg = 0;         
                       

                for (let i in resData.trend_attend_group) {
                    let item = resData.trend_attend_group[i]
                    let figure = resData.attend[i]
                    trend_attend.labels.push(item.session)
                    trend_attend.datasets[0].data.push(figure.attend)
                    trend_attend_avg += figure.attend
                    trend_attend.datasets[2].data.push(item.avg)
                }
                let attend_avg=Math.round(trend_attend_avg / resData.attend.length)
                for (let i in resData.attend) {
                    trend_attend.datasets[1].data.push(attend_avg)
                }
            
                //政見分數
                for(let i in resData.trend_policy_group){
                    let item =resData.trend_policy_group[i]
                    trend_policy.labels.push(item.t)
                    // trend_policy.datasets[2].data.push(item.score)
                    trend_policy.datasets[0].data.push(resData.trend_policy[i].score)
                    trend_policy.datasets[1].data.push(item.score)
                }
                console.log("success")
                //提案數
                for(let i in resData.pro){
                    let item =resData.pro[i]
                    console.log(resData.trend_pro[i].c)
                    trend_pro.labels.push(item.status)
                    trend_pro.datasets[0].data.push(item.c)
                    trend_pro.datasets[1].data.push(Math.floor(resData.trend_pro[i].c))
                }
                console.log(trend_pro)
                this.setState({
                    policy: resData.policy,
                    name: resData.detail[0].name,
                    area: resData.detail[0].e_n,
                    experience: resData.detail[0].experience.split("\n"),
                    areaReamrk: resData.detail[0].remark.replace("null", ""),
                    photo: resData.detail[0].photo,
                    table: resData.table_policy,
                    tableDetail: resData.table_policyDetail,
                    attend: attend_avg,
                    score: resData.count_score[0]["score"],
                    proposal_quota: resData.proposal_quota[0]["quota"],
                    proposal: resData.proposal,
                    trend_attend: trend_attend,
                    trend_policy:trend_policy,
                    trend_pro:trend_pro
                })
                console.log(resData)

            }, error => { console.log(error) })
        )
    }

    scoreRule = (i) => this.setState({ scoreActitivy: i })

    score = () => PoliticianR.score({
        "user_id": this.state.userName,
        "policy_id": this.state.scoreId,
        "ps_id": this.state.plan+1,
        "remark": document.getElementById("scoreRemark").value || " "
    }).then(res => {
        if (res.data.success) {
            this.scoreShow("")
            this.setState({ "open": true, noteModalC: "評分成功" })
            this.forreload()
        }
    })

    closeNoteModal = () => this.setState({ open: false })

    closeTableModal = () => this.setState({ openTable: false })




    renderRowPolicy = ({ id, content, quota, total }, i) => ({
        key: `row-${id}${i}`,

        onClick: () => this.renderToDetail(id),
        cells: [
            content || ' ',
            quota || '0',
            total || '0',
        ],
    })
    renderToDetail = (id) => {
        console.log(id)
        // console.log()
        let newData = this.state.tableDetail.filter(item => item.p_id === id)
        this.setState({ showBack: true, render: this.renderRowPolicyDetail, renderData: newData, header: ["進度", "投票人數", "占比", "小計"] })
    }
    renderRowPolicyDetail = ({ p_id, s_name, quota, value, total }, i) => ({
        key: `row-${p_id}-${i}`,
        cells: [

            s_name || '0',
            quota || '0',
            value || '0',
            total || ""
        ],
    })
    renderRowProposal = ({ title, proposal_id }, i) => ({
        key: `row-${proposal_id}${i}`,
        cells: [
            title || ' ',

        ],
    })
    renderRow = (cond) => {
        this.setState({ renderData: [], showBack: false })
        if (cond === "proposal") this.setState({ "openTable": true, render: this.renderRowProposal, renderData: this.state.proposal, header: ["提案"] })
        else this.setState({ "openTable": true, render: this.renderRowPolicy, renderData: this.state.table, header: ['政見', '投票人數', '小計'] })
    }

    render() {
        const ldata = {
            labels: ['1', '2', '3', '4', '5', '6'],
            datasets: [
                {
                    label: '該政治人物',
                    data: [10, 9, 13, 15, 12, 13],
                    fill: false,
                    backgroundColor: '#FEC240',
                    borderColor: '#FEC240',
                },
                {
                    label: '該政治人物總平均',
                    data: [12, 19, 3, 5, 2, 3],
                    fill: false,
                    backgroundColor: '#DE4B43',
                    borderColor: '#DE4B43',
                },
                {
                    label: '立委總平均',
                    data: [1, 10, 4, 7, 8, 15],
                    fill: false,
                    backgroundColor: '#98C4D1',
                    borderColor: '#98C4D1',
                }
            ],
        };

        const loptions = {
            scales: {
                x: { ticks: { color: "#fff" } },
                y: { ticks: { color: "#fff" } },
            },
            layout: { padding: 35 },
            plugins: {
                legend: { labels: { font: { family: "abc" } } },
                title: {
                    display: true,
                    text: '政見達成分數走勢圖',
                    color: '#ffffff',
                    font: {
                        size: 25,
                        family: "abc"
                    },
                    padding: { top: 3, }
                }
            },
            color: '#ffffff'
        };

        const lldata = {
            labels: ['1', '2', '3', '4', '5', '6'],
            datasets: [
                {
                    label: '該政治人物',
                    data: [9, 9, 8, 15, 7, 10],
                    fill: false,
                    backgroundColor: '#FEC240',
                    borderColor: '#FEC240',
                },
                {
                    label: '該政治人物總平均',
                    data: [6, 6, 5, 8, 6, 8],
                    fill: false,
                    backgroundColor: '#DE4B43',
                    borderColor: '#DE4B43',
                },
                {
                    label: '立委總平均',
                    data: [7, 10, 4, 6, 8, 9],
                    fill: false,
                    backgroundColor: '#98C4D1',
                    borderColor: '#98C4D1',
                }
            ],
        };

        const lloptions = {
            scales: {
                x: { ticks: { color: "#fff" } },
                y: { ticks: { color: "#fff" } },
            },
            layout: { padding: 35 },
            plugins: {

                title: {
                    display: true,
                    text: '出席率走勢圖',
                    color: '#ffffff',
                    font: {
                        size: 25,
                        family: "abc"
                    },
                    padding: { top: 3, }
                }
            },
            color: '#ffffff'
        };

        const bdata = {
            labels: ['退回程序', '審查完畢', '交付審查', '排入院會', '三讀', '逕付二讀'],
            datasets: [
                {
                    label: '當屆',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: '#FEC240',
                },
                {
                    label: '歷屆平均',
                    data: [2, 3, 20, 5, 1, 4],
                    backgroundColor: '#98C4D1',
                },
            ],
        };

        const boptions = {
            scales: {
                x: { ticks: { color: "#fff" } },
                y: { ticks: { color: "#fff" } },
            },
            layout: { padding: 35 },
            plugins: {
                title: {
                    display: true,
                    text: '提案數量統計長條圖',
                    color: '#ffffff',
                    font: {
                        size: 25,
                        family: "abc"
                    },
                    padding: { top: 3, }
                }
            },
            color: '#ffffff'
        };


        SwiperCore.use([Navigation, Pagination, Scrollbar, A11y, Mousewheel,]);
        // Chart.defaults.font.family="abc"
        return (<Pages id={ 3 }
            pageInfo={ [{ content: '政治人物', link: true, href: "./#/figure" },
            { content: this.state.name, active: true, href: `./#/figure/${this.props.match.params.id}` }] }

            page={
                (<>
                    <div className={ style.people }>
                        {
                            <Grid> <Grid.Row className={ style.dashboard } >
                                {/* <Grid.Column mobile={ 16 } computer={ 16 } tablet={ 8 }>

                                    <Card  >
                                        <Grid columns={ 2 } verticalAlign={ "middle" } >
                                            <Grid.Row >
                                                <Grid.Column mobile={ 16 } computer={ 8 }>
                                                    <center className={ style.imgBox }>
                                                        <Image src={ this.state.photo } alt="" size={ "small" } centered />
                                                    </center>
                                                </Grid.Column>
                                                <Grid.Column mobile={ 16 } computer={ 8 }>
                                                    <p className={ style.bigSize }>{ this.state.selfD && this.state.name }</p>
                                                    <p className={ style.in }>  </p>
                                                    <p className={ style.in }>{ this.state.selfD && this.state.area }</p>
                                                    <p className={ style.in }> { this.state.selfD && this.state.areaReamrk }</p>
                                                </Grid.Column>
                                            </Grid.Row>
                                        </Grid>
                                    </Card>
                                </Grid.Column> */}
                                <Grid.Column mobile={ 16 } computer={ 5 } tablet={ 8 }>
                                    {/* <Card  ><p>犯罪紀錄 : 2 筆</p>
                                        <p>政治獻金 : 5 筆 100萬</p></Card>
                                    <Card vertical> <Grid>
                                        <Grid.Row columns={ "equal" } >
                                            { this.state.selfD && this.state.selfD.map(placement => {
                                                return (<>
                                                    <Grid.Column ><Label content={ placement.name } tag /></Grid.Column>
                                                    <Grid.Column id={ placement.no } width={ 16 } className={ style.labelContent } />
                                                </>)
                                            }) }
                                        </Grid.Row>
                                        <Grid.Row columns={ "equal" }>
                                            <Grid.Column > <Label content={ "經歷" } tag /> </Grid.Column>
                                            <Grid.Column width={ 16 } className={ style.labelContent }>
                                                { this.state.experience && this.state.experience.map((item, index) => {
                                                    return (<p>  { item } </p>)
                                                }) }</Grid.Column>
                                        </Grid.Row>
                                    </Grid></Card> */}
                                    <div class="flex justify-center">

                                        <div class="w-full   bg-white p-6">
                                            {/* <div class="flex items-center border-b py-4">
                                                <div>
                                                    <i class="fas fa-chevron-left text-lg"></i>
                                                </div>
                                                <div class="flex-1">
                                                    <p class="text-center">Joshua Welford</p>
                                                </div>
                                                <div>
                                                    <i class="fas fa-pencil-alt"></i>
                                                </div>
                                                <div class="ml-4">
                                                    <i class="fas fa-search"></i>
                                                </div>
                                            </div> */}
                                            <div class="mt-6">
                                                <div class="h-56  overflow-hidden rounded-tl-lg rounded-tr-lg justify-center">
                                                    <img class="rounded-tl-xl rounded-tr-xl h-56 w-auto" src={ this.state.selfD !== undefined ? this.state.photo : "" } alt="" />
                                                </div>
                                            </div>

                                            <div class="mt-2 text-lg">
                                                <p class="text-center"><span class="font-bold">{ this.state.selfD !== undefined ? this.state.name : "" }</span>  </p>
                                            </div>

                                            <div class="flex pb-4 mt-4 items-center border-b">


                                            </div>
                                            { this.state.selfD && this.state.selfD.map(placement => {
                                                return (<>
                                                    <div>
                                                        <div class="flex mt-2 items-center">
                                                            <div class="text-gray-400">
                                                                <i class="fas fa-graduation-cap"></i>
                                                            </div>

                                                            <div class="text-lg ml-3">
                                                                <p class={ "font-bold " }>{ placement.name }  </p>
                                                                <p><span class={ style.labelContent } id={ placement.no }>  </span></p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* <Grid.Column ><Label content={ placement.name } tag /></Grid.Column>
                                                    <Grid.Column id={ placement.no } width={ 16 } className={ style.labelContent } /> */}
                                                </>)
                                            }) }



                                            {/* <Grid.Column > <Label content={ "經歷" } tag /> </Grid.Column>
                                            <Grid.Column width={ 16 } className={ style.labelContent }>
                                                { this.state.experience && this.state.experience.map((item, index) => {
                                                    return (<p>  { item } </p>)
                                                }) }</Grid.Column> */}
                                            <div class="flex mt-2 items-center">
                                                <div class="text-gray-400">
                                                    <i class="fas fa-link"></i>
                                                </div>
                                                <div class="text-lg ml-3">
                                                    <p class={ "font-bold " }>經歷 </p>
                                                </div>
                                            </div>

                                            { this.state.experience && this.state.experience.map((item, index) => {
                                                return (
                                                    <div class="flex mt-2 items-center">

                                                        <div class="text-lg ml-3">
                                                            <p>  { item } </p>
                                                        </div>
                                                    </div>)
                                            }) }


                                        </div>
                                    </div>

                                </Grid.Column>
                                <Grid.Column computer={11} mobile={16}>
                                    {/* p */}
                                    <Card.Group itemsPerRow={3}>
                                        <Card className={style.dashboardcard} onClick={() => this.renderRow("policy")}>
                                            <div title="您在乎的政治人物有履行政見承諾嗎？
                                                政要RUN整合投票數據，並將運算過程公布此區，讓您更清楚了解分數來由。" 
                                                className={style.scoreCircle}><div class="text-xl mb-5">政見評分</div>
                                                <CircularProgressbar value={this.state.score * 100} text={`${parseInt(this.state.score * 100)}`} styles={buildStyles({
                                                    strokeLinecap: "butt",
                                                    pathColor: "#FEC240",
                                                    textColor: "#fff"

                                                }) } />
                                            </div>
                                        </Card>
                                        <Card className={style.dashboardcard}>
                                            <div title="您在乎的政治人物有確實出席立法院會議嗎？
                                            政要RUN整合公民監督國會聯盟提供的院會出席率及委員會出席率，並取平均作為參考指標。歡迎您加以參考。"
                                            className={style.scoreCircle}><div class="text-xl mb-5">出席率</div>
                                                <CircularProgressbar value={this.state.attend} text={`${this.state.attend}%`} styles={buildStyles({
                                                    strokeLinecap: "butt",
                                                    pathColor: "#FEC240",
                                                    textColor: "#fff"

                                                }) } /></div>
                                        </Card>
                                        <Card className={style.dashboardcard} onClick={() => this.renderRow("proposal")}>
                                            <div title="您在乎的政治人物有提出多少法案呢？
                                            政要RUN整合立法院資料服務平台的提案數據，讓您一手掌握不遺漏！"
                                            className={style.scoreCircle}><div class="text-xl mb-5">提案數</div>
                                                <CircularProgressbar value={100} text={`${this.state.proposal_quota}`} styles={buildStyles({
                                                    strokeLinecap: "butt",
                                                    pathColor: "#FEC240",
                                                    textColor: "#fff"

                                                }) } /></div>
                                        </Card>
                                    </Card.Group>
                                    <Segment basic>  </Segment>
                                    <Swiper
                                        className={ style.dashboardcard }
                                        mousewheel={ true }
                                        spaceBetween={ 30 }
                                        slidesPerView={ 1 }
                                        navigation
                                        pagination={ { clickable: true, } }
                                    >
                                        <SwiperSlide>
                                            <Line data={ this.state.trend_policy } options={ loptions } />
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <Line data={ this.state.trend_attend } options={ lloptions } />
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <Bar data={ this.state.trend_pro } options={ boptions } />
                                        </SwiperSlide>
                                    </Swiper>

                                    <div class="mt-10">
                                        <div className={style.bigSize + " " + style.center}><span class="text-2xl">政見</span>
                                            {/* <span className={style.term}>
                                                <Dropdown text={this.state.term && this.state.term}>
                                                <Dropdown.Menu>
                                                    <Dropdown.Item onClick={ () => { this.changeTerm("當屆") } }>當屆</Dropdown.Item>
                                                    <Dropdown.Item onClick={ () => { this.changeTerm("歷屆") } }>歷屆</Dropdown.Item>
                                                    <Dropdown.Item onClick={ () => { this.changeTerm("9") } }>9</Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                            </span> */}
                                        </div>
                                        <div class=" grid grid-cols-2   justify-center items-stretch mt-5" >
                                            { this.state.policy && this.state.policy.map((placement, index) => {
                                                if (index === null) return (<></>)
                                                else {
                                                    return (<>
                                                        <div class="pr-4 mb-5" onClick={() => { this.scoreShow(placement.content, placement.id, placement.name) }}>
                                                            <div class="bg-white max-w-xl rounded-2xl px-5 py-8 shadow-lg hover:shadow-2xl transition duration-500">
                                                                <div class="mt-4">
                                                                    <div class="text-lg text-gray-700 font-semibold hover:underline cursor-pointer">  < >{placement.name.map((item, index) => {
                                                                        return (<><Label className={style.class}>{item}</Label></>)
                                                                    })}</ ></div>
                                                                    {/* <div class="flex mt-2">
                                                                        <ColorNumber value={ index } neg={ index % 2 === 0 } />
                                                                    </div> */}
                                                                    <p class="mt-2 text-md text-gray-600">  { placement.content }</p>

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>)
                                                }
                                            }) }

                                        </div>
                                    </div>


                                </Grid.Column>
                            </Grid.Row></Grid>
                        }</div>
                    <ScoreModal open={ this.state.scoreShow } toDo={ () => this.score() } setOpen={ () => { this.scoreShow("") } }
                        message={ <div>{ this.state.scoreTitle }
                            <p>{ this.state.tag != null ? this.state.tag.map((item, index) => { return (<Label>{ item }</Label>) }) : <></> }</p>
                        </div> }
                        content={ (<>

                            <div class="border-2 rounded-full border-gray-300  text-black px-4 py-3 ">您可依自己的判斷，針對每項政見承諾的落實程度，進行評分。</div>
                            <div>
                               
                            </div>
                            <div class="font-sans flex items-center justify-center w-full py-8">
                                <div class="overflow-hidden bg-white roundeds w-full shadow-lg  leading-normal">
                                <RadioGroup value={ this.state.plan } onChange={ this.setPlan }>
                                 
                                    {
                                        this.state.scoreRule.map((item, index) => {
                                            return (<>
                                                <RadioGroup.Option value={ index }>
                                                    { ({ checked }) => (
                                                        <div class={ checked ? 'block group p-4 border-b bg-green-50' : 'block group p-4 border-b' }>
                                                            <div class="grid grid-rows-2 grid-flow-col gap-2">
                                                                <div class="row-span-1 col-span-2 font-bold text-lg mb-1 text-black group-hover:text-black">{ item.name }</div>
                                                                <div class="col-span-2 text-grey-darker mb-2 group-hover:text-black">{ item.remark }</div>
                                                                <div class="row-span-2 col-span-1 flex items-center justify-end "><Button circular  color={"green"}  className={checked?"":"inverted"} icon='check' /></div>
                                                            </div>
                                                        </div>
                                                        // <span className=>{ item.name }</span>
                                                    ) }
                                                </RadioGroup.Option>
                                            </>)
                                        })
                                    }


                                </RadioGroup>
                                    <div class="md:col-span-5">
                
                <input title="為什麼會投給此進度呢？
                邀請你針對政見的滿意度填下參考依據，也歡迎你隨時回來發表新的意見。" 
                type="text" name="email" class="h-10 border m-4 rounded p-5 w-full bg-gray-50"  id="scoreRemark" placeholder="備註" />
              </div>
                                </div>
                            </div>
                        </>) }

                    />
                    <InfoModal open={ this.state.open } content={ this.state.noteModalC } close={ this.closeNoteModal } />
                    <InfoModal open={ this.state.openTable } close={ this.closeTableModal } size={ "large" }
                        content={ <>
                            { this.state.showBack ? <Button onClick={ () => this.renderRow("policy") } content={ "返回" } /> : <></> }
                            <Table
                            padded
                            singleLine={false}
                                selectable
                                basic='very'
                                
                                headerRow={ this.state.header }
                                renderBodyRow={ this.state.render }
                                tableData={ this.state.renderData } />
                        </> } />
                </>)

            } />)
    }
}

export default FigureDetail = {
    routeProps: {
        path: "/figure/:id",
        component: FigureDetail
    },
    name: "人物專區"
}
