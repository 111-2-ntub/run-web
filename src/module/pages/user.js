import React from 'react';
import { Pages } from "../pages.js"
import Chart from 'react-apexcharts'
import Thermometer from 'react-thermometer-component'
import { Tab, Button, Input, Transition, Grid, Select, Label, Segment, Icon, Table, List, Card } from 'semantic-ui-react'
import BarChart from "../barchart"
import style from "../../css/user.module.css"
import utilStyle from "../../css/util.module.css"
import { MemberR } from '../request/memberR';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import { trackPromise } from 'react-promise-tracker';
import pic from "./pic.png"
import { sha256 } from 'js-sha256';
import { ModalBase, MsgModal } from '../modal.js';

class User extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            "login": !!localStorage.getItem("login"),
            userName: localStorage.getItem("login"),
            identity: localStorage.getItem("identity"),
            kpi: {
                series: [10, 50, 40],
                options: {
                    colors: ['#fec240', '#98c4d1', '#de4b43'],
                    labels: ["贊成", "中立", "反對"],
                    chart: { width: 50 }
                },
            },
        }
    }

    componentDidMount() {
        if (!!!localStorage.getItem("login")) {
            document.location.href = "/#"
        }
        trackPromise(
            MemberR.user(this.state.userName).then(res => {
                this.setState(res.data.D)
            })
        )
        if (this.state.identity === "3") {
            this.figureID = 405
            trackPromise(
                MemberR.p_user(this.figureID).then(res => {
                    let resData = res.data.D
                    console.log(resData)
                    this.setState({ p_data: resData })
                }), error => { console.log(error) }
            )

        }

    }

    render() {
        let items = [
            { name: "個人檔案", in: this.state.identity === "3" ? <><Pprofile data={ this.state.p_data } /></> : <><MyProfile data={ this.state.user } area={ this.state.area } userName={ this.state.userName } category={ this.state.category } /></>, icon: "address card" },
            { name: "提案收藏", in: <MySave login={ this.state.userName } data={ this.state.save } />, icon: "heart" },
            { name: "留言紀錄", in: <MyMsgRecord userName={ this.state.userName } msg={ this.state.msg } />, icon: "comment" },
            { name: "提案投票紀錄", in: <MyVoteRecord userName={ this.state.userName } proposal_vote={ this.state.proposal_vote } />, icon: "flag" },
            { name: "政見評分紀錄", in: <MyScoreRecord userName={ this.state.userName } policy_vote={ this.state.policy_vote } />, icon: "tasks" }
        ]




        return (<Pages pageInfo={ [{ content: '會員檔案', active: true, href: "./user" }] }
            page={
                (<>
                    <Tab className={ utilStyle.tab } menu={ { secondary: true, pointing: true, vertical: true, } } panes={ items.map(item => {
                        return ({
                            menuItem: { icon: item.icon, content: item.name },
                            render: () => <Tab.Pane attached={ false }>   { item.in }</Tab.Pane>,
                        })
                    }) } />
                </>)
            } />)
    }
}
class MyProfile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            areaShow: false, pswShow: false, classShow: false,
            like: {}
        }

    }
    componentWillReceiveProps(newState) {
        console.log(newState)
        let area = []
        for (let a of newState.area) {
            area.push({ key: a.id, value: a.id, text: a.name })
        }
        this.setState({ user: newState.data[0], area: area })
        let d = ["財政金融", "教育", "內政", "司法及法制", "科技", "觀光", "國防", "食品安全", "長期照顧",
            "衛生社福", "農業", "交通", "海洋", "性別平等", "動物保育", "原住民", "外交", "兩岸關係", "高齡化",
            "幼托育兒", "年改", "基礎建設", "拒毒品", "客家", "治安", "都市發展", "補助", "都市美化", "汽機車",
            "環保", "體育賽事", "勞工就業", "青年", "文創", "新住民",]
        let istoggle = []
        d.forEach(() => istoggle.push(false))
        this.setState({ sub: d, isToggleOn: istoggle })
    }
    areaShow = () => this.setState((prevState) => ({ areaShow: !prevState.areaShow }))
    // pswShow = (show) => this.setState({ pswShow: show })
    editName = () => {
        let name = document.getElementById("new_name").value
        return MemberR.userEdit({ "name": name, "account": this.props.userName }).then(res => { if (res.data.success) document.location.reload() })

    }
    editArea = () => {

        return MemberR.userEdit({ "area_id": this.state.areaid, "account": this.props.userName }).then(res => { if (res.data.success) document.location.reload() })

    }
    getArea = (event, { value }) => {
        console.log(value);
        this.setState({ areaid: value })
    }
    editPsw = () => {
        let old_psw = sha256(document.getElementById("old_psw").value)
        let psw = sha256(document.getElementById("psw").value)
        let c_psw = sha256(document.getElementById("c_psw").value)
        return MemberR.pswEdit({ oldPassword: old_psw, password: psw, passwordConfire: c_psw, account: this.props.userName })
            .then()
    }
    editClass = () => {
        let c_id = []
        this.state.isToggleOn.forEach((item, index) => {
            if (item) {
                c_id.push(index + 1)
            }
        })
        return MemberR.category({ "add": c_id, "user_id": this.props.userName, "remove": [] }).then()
    }
    toContent = (id) => {
        localStorage.setItem("proposal", id)
        document.location.href = `.#/policyContent/${id.id}`
    }
    handleClick = (index) => {
        this.setState(prevState => {
            let copy = prevState
            if ("isToggleOn" in copy) {
                copy["isToggleOn"][index] = !copy["isToggleOn"][index]
            }
            return copy
        });
    }


    render() {
        return (<>
            {/* celled='internally' */ }<Grid >
                <Grid.Row columns={ "equal" }>
                    <Grid.Column width={ 16 } textAlign={ "center" }>
                        <img class="m-auto my-2 w-20 h-20 rounded-full border-0 sm:w-40 sm:h-40" alt="" src={ pic } />
                    </Grid.Column>
                    <Grid.Column width={ 8 } textAlign={ "right" } className={ style.data }>
                        <div class="hidden sm:flex justify-end"><ModalBase color={ "teal" } message={ "修改姓名" } btn={ <Button className={ style.btncolor } labelPosition='right' color={ "teal" }
                            size={ "medium" } content={ this.state.user && this.state.user.name } icon={ "edit" } /> } toDo={ this.editName }
                            content={
                                <>
                                    <p><Input placeholder="新名稱" id="new_name" /></p>
                                </>
                            } /></div>

                        <div class="flex justify-end sm:hidden"><ModalBase color={ "teal" } message={ "修改姓名" } btn={ <Button className={ style.btncolor } labelPosition='right' color={ "teal" }
                            size={ "mini" } content={ this.state.user && this.state.user.name } icon={ "edit" } /> } toDo={ this.editName }
                            content={
                                <>
                                    <p><Input placeholder="新名稱" id="new_name" /></p>
                                </>
                            } /></div>
                    </Grid.Column>
                    <Grid.Column width={ 8 } textAlign={ "left" } className={ style.data }>
                        <div class="hidden sm:flex justify-start"><ModalBase btn={ <Button className={ style.btncolor } labelPosition='right' color={ "teal" } size={ "medium" } content={ "修改密碼" } icon={ "edit" } /> }
                            labelPosition={ 'left' } color={ "teal" } message={ "修改密碼" } btnText={ "修改密碼" } toDo={ this.editPsw }
                            content={ (<>
                                <p><Input type="password" placeholder="現有密碼" id="old_psw" /></p>
                                <p><Input type="password" placeholder="新密碼" id="psw" /></p>
                                <p><Input type="password" placeholder="確認新密碼" id="c_psw" /></p>
                            </>) }
                        /></div>
                        <div class="flex justify-start sm:hidden"><ModalBase btn={ <Button className={ style.btncolor } labelPosition='right' color={ "teal" } size={ "mini" } content={ "修改密碼" } icon={ "edit" } /> }
                            labelPosition={ 'left' } color={ "teal" } message={ "修改密碼" } btnText={ "修改密碼" } toDo={ this.editPsw }
                            content={ (<>
                                <p><Input type="password" placeholder="現有密碼" id="old_psw" /></p>
                                <p><Input type="password" placeholder="新密碼" id="psw" /></p>
                                <p><Input type="password" placeholder="確認新密碼" id="c_psw" /></p>
                            </>) }
                        /></div>
                    </Grid.Column>

                </Grid.Row>

            </Grid>

            <Card.Group itemsPerRow={ 2 } >
                <Card>
                    <Card.Content>
                        <Card.Header>生日</Card.Header>
                        <Card.Description>{ this.state.user && this.state.user.birthday }</Card.Description>
                    </Card.Content>
                </Card>

                <Card>
                    <Card.Content>
                        <Card.Header>地區 <Icon name={ "edit" } className={ style.icon } onClick={ this.areaShow } /></Card.Header>
                        <Transition visible={ this.state.areaShow } animation='scale' duration={ 500 }>
                            <div>
                                <Select id="sarea" options={ this.state.area }
                                    placeholder={ "請選擇你的地區" } onChange={ this.getArea } />
                                <ModalBase content={ "已修改地區完成" }
                                    btn={ <Button labelPosition='left' icon={ "check" } content={ "確定" } className={ style.sbtn } /> }
                                    toDo={ this.editArea } />
                            </div>
                        </Transition>
                        <Card.Description>{ this.state.user && this.state.user.a_n }</Card.Description>
                    </Card.Content>
                </Card>

                <Card>
                    <Card.Content>
                        <Card.Header>性別</Card.Header>
                        <Card.Description>{ this.state.user && this.state.user.gender }</Card.Description>
                    </Card.Content>
                </Card>

                <Card>
                    <Card.Content>
                        <Card.Header>興趣 <ModalBase color={ "teal" } message={ "修改興趣" }
                            btn={ <Icon name={ "edit" } className={ style.icon } /> } toDo={ this.editClass }
                            content={
                                (<>
                                    <div className={ style.category_model }>
                                        {
                                            this.state.sub !== undefined ? this.state.sub.map((item, index) => {
                                                return (<Button onClick={ () => { this.handleClick(index) } } className={ (this.state.isToggleOn[index] ? style.selected : style.subBtn) } size='mini'  >{ item }</Button>)
                                            }) : <></>
                                        }
                                    </div>
                                </>)
                            } /></Card.Header>
                        <Card.Description>

                            { Array.isArray(this.props.category) ?
                                <>  <Label.Group>
                                    { this.props.category.map(item => {
                                        return <Label>{ item.name }</Label>
                                    }) }
                                </Label.Group></> : <></> }


                        </Card.Description>
                    </Card.Content>
                </Card>
            </Card.Group>



        </>);
    }
}

class Pprofile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            kpi: {
                series: [10, 50, 40],
                options: {
                    colors: ['#fec240', '#98c4d1', '#de4b43'],
                    labels: ["贊成", "中立", "反對"],
                    chart: { width: 50 }
                },
            },
        }
    }

    toContent = (id) => {
        localStorage.setItem("proposal", id)
        document.location.href = `.#/policyContent/${id.id}`
    }

    componentDidUpdate() {
        if (!this.state.detail && this.props.data) {
            this.setState(this.props.data)
            console.log(this.props.data)
            let voteRow = this.props.data.stand
            console.log(voteRow)
            if (voteRow) {
                let goodc = voteRow[0] ? voteRow[0].score : 0
                let medc = voteRow[1] ? voteRow[1].score : 0
                let badc = voteRow[2] ? voteRow[2].score : 0
                let voteD = goodc + medc + badc
                this.setState({ voteD: [goodc / voteD, medc / voteD, badc / voteD] })
            }


        }


    }

    render() {

        return (<>
            {/* 政治人物個人檔案 */ }
            {/* 第一行：基本資料 */ }
            <Segment><div class="grid grid-rows-1 grid-cols-2 gap-4 p-4 bg-white my-3">
                <div class="grid grid-cols-2 gap-4">
                    <div class="flex justify-center">
                        <img class="m-auto my-2 w-20 h-20 rounded-full border-0 sm:w-40 sm:h-40" alt="" src={ pic } />
                    </div>
                    <div class="items-center self-center mt-2 text-3xl font-semibold">{ this.state.detail ? this.state.detail[0].name : "" }</div>
                </div>
                <div class="grid grid-cols-4 grid-row-5 gap-4 text-center">
                    <div title="聯絡政要RUN：tsungimd106@gmail.com" class="col-start-4 col-end-4 row-start-1 row-end-1 cursor-pointer" slot="avatar">
                        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-info w-5 h-5 mx-2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="16" x2="12" y2="12"></line>
                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                        </svg>
                    </div>

                    <div class="col-start-1 col-end-4 row-start-2 ">
                        <div class="inline-flex items-center  justify-items-end bg-white leading-none text-black rounded-full p-2 shadow text-sm">
                            <span class="inline-flex bg-black text-white rounded-full h-6  px-3 justify-center items-center text-">選區</span>
                            <span class="inline-flex px-2">{ this.state.detail ? this.state.detail[0].e_n : "" }</span>
                        </div>
                    </div>

                    <div class="col-start-1 col-end-4 row-start-5 row-end-5">
                        <div class="inline-flex items-center  bg-white leading-none text-black rounded-full p-2 shadow text-sm">
                            <span class="inline-flex bg-black text-white rounded-full h-6 px-3 justify-center items-center text-">委員會</span>
                            <span class="inline-flex px-2">{ this.state.committee ? this.state.committee[0].name : "" }</span>
                        </div>
                    </div>

                </div>
            </div></Segment>

            {/* 第二行：分數圖表 */ }
            <Segment><div class="grid grid-rows-1 grid-cols-4 gap-4 p-4 bg-white my-3">
                <div><p class="text-center w-20">政見分數</p>
                    <div class="h-full flex" >
                        <div title="您在乎的政治人物有履行政見承諾嗎？
                                        政要RUN整合投票數據，並將運算過程公布此區，讓您更清楚了解分數來由。"
                            class="self-center pb-10">
                            <CircularProgressbar value={ this.state.count_score ? this.state.count_score[0].score * 100 : 0 } text={ `${parseInt(this.state.count_score ? this.state.count_score[0].score * 100 : 0)}` } styles={ buildStyles({
                                strokeLinecap: "butt",
                                pathColor: "#FEC240",
                                textColor: "#000"
                            }) } />
                        </div>
                    </div>
                </div>
                <div><p class="text-center">正負向比例</p>
                    <Thermometer 
                        theme="light"
                        value={ this.state.message ? parseInt(this.state.message[0].score * 100 ): 0 }
                        max="100"
                        steps="4"
                        format="%"
                        size="large"
                        height="300"
                        width="100"
                    />
                </div>
                <div className='span-2' ><p class="text-center ">圓餅圖</p>
                    <div class="h-full flex">
                        <div className='self-center	'>
                            { this.state.voteD ? <>
                                <div style={{width:"200%"}} ><Chart options={ this.state.kpi.options } series={ this.state.voteD } type="donut" /></div>
                            </> : <></> }

                        </div>
                    </div>
                </div>

            </div></Segment>

            {/* 第三行：最熱門政見&提案 */ }
            <Segment>
                <div class="grid grid-rows-1 grid-cols-2 gap-4 p-4 bg-white my-3">
                    <div class="p-5">
                        <h1 class="text-center">最熱門政見</h1>
                        <div class="grid grid-cols-1 ">
                            {
                                Array.isArray(this.state.policy) ? this.state.policy.map((item, index) => {
                                    return (<>
                                        <div class="flex border-gray-300 border-b "> <div class="p-3 text-2xl font-bold ">{ index + 1 }</div>
                                            <div class="w-full p-3">{ item.title }</div>
                                        </div>
                                    </>)
                                }) : <></>
                            }


                        </div>
                    </div>
                    <div class="p-5">
                        <h1 class="text-center">最熱門提案</h1>
                        <div class="grid grid-cols-1 ">
                            {
                                Array.isArray(this.state.proposal) ? this.state.proposal.map((item, index) => {
                                    return (<>
                                        <div class="flex border-gray-300 border-b"> <div class="p-3 text-2xl font-bold">{ index + 1 }</div>
                                            <div class="w-full p-3">{ item.title }</div>
                                        </div>
                                    </>)
                                }) : <></>
                            }


                        </div>
                    </div>
                </div>
            </Segment>

        </>);
    }
}


class MySave extends React.Component {
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
        }
    }
    componentDidMount() {
        console.log(this.props.data)
        this.setState({ save: this.props.data })
    }

    componentWillReceiveProps(newState) {
        console.log(newState)
        this.setState({ save: newState.data })
    }
    changePage = (url) => {
        const path = `${window.location.href.split("/user")[0]}/${url}`
        window.location.href = path
    }
    toContent = (id) => {
        localStorage.setItem("proposal", id)
        document.location.href = `.#/policyContent/${id.id}`
    }
    render() {
        return (<>
            <List divided relaxed animated>

                {
                    Array.isArray(this.state.save) && this.state.save.length > 0 ? this.state.save.map((item, index) => {
                        let voteT = item.goodc + item.medc + item.badc
                        return (<List.Item><Grid><>



                            <Grid.Row className={ style.topicBoxBoldC } onClick={ () => { this.toContent(item) } }>
                                {/* <Grid.Column width={ 1 } /> */ }
                                <Grid.Column width={ 11 }>
                                    <div>提案人：{ item.f_name.map(item => { return (<><Label >{ item }</Label></>) }) }</div>
                                    <h3 className={ style.ellipsis }>{ item.title }</h3>
                                    <div>
                                        <List horizontal>

                                            <List.Item>提案進度：{ item.status }</List.Item>
                                            { item.c_name.map(item => { return (item != null ? <List.Item><Label>{ item }</Label></List.Item> : <></>) }) }
                                        </List>
                                    </div>

                                </Grid.Column>
                                <Grid.Column width={ 5 } computer={ 5 } tablet={ 7 } floated={ "left" }>
                                    <BarChart data={ [
                                        { value: item.goodc > 0 ? item.goodc / voteT * 100 : 0, name: "同意", color: "#fec240" },
                                        { value: item.medc > 0 ? item.medc / voteT * 100 : 0, name: "中立", color: "#98c4d1" },
                                        { value: item.badc > 0 ? item.badc / voteT * 100 : 0, name: "反對", color: "#de4b43" }

                                    ] }> </BarChart>
                                </Grid.Column>
                            </Grid.Row>




                        </></Grid></List.Item>)
                    }) : <></>
                }</List>


        </>);
    }

}


class MyMsgRecord extends React.Component {
    constructor(props) {
        super(props)
        this.state = { open: false }
    }
    componentDidMount() {
        this.setState({ msg: this.props.msg })
        console.log(this.props.msg)
    }
    handleClick = (e, titleProps) => {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index
        this.setState({ activeIndex: newIndex })
    }
    close = () => { this.setState({ open: false }) }
    openDatil = (d, t) => {
        this.setState({ data: d, title: t, open: true })
    }
    toContent = (id) => {

        document.location.href = `.#/policyContent/${id.proposal_id}`
    }


    render() {
        const { activeIndex } = this.state
        return (<>

            <Card.Group itemsPerRow={ 2 }>
                { this.state.msg !== undefined ? this.state.msg.map((item, index) => {

                    return (<>
                        <Card onClick={ () => this.openDatil(item.content, item.title) }>
                            <button onClick={ () => { this.toContent(item) } }
                                class="flex-start bg-gray-400 rounded-full text-gray-200 p-2 transition duration-300 ease-in-out hover:bg-gray-500">
                                點我到此提案
                            </button>
                            <p class="text-black font-semibold text-xl p-3">{ item.title }</p>
                            <Card.Content>
                                {/* { item.content.map(m => { return (<Label content={ m.content } />) }) } */ }
                                <div class="text-black">提案人：{ item.f_name.map(item => { return (<><Label>{ item }</Label></>) }) }</div>
                                <div class="text-black mt-3">{ item.c_name.map(item => { return (item != null ? <Label>{ item }</Label> : <></>) }) }</div>
                            </Card.Content>
                        </Card>

                        {/* <Accordion.Title
                            active={ activeIndex === index }
                            index={ index }
                            onClick={ this.handleClick }
                        ><Icon name='dropdown' />{ item.title }

                        </Accordion.Title>
                        <Accordion.Content active={ activeIndex === index }>
                            <List onClick={ () => { this.changePage(`PolicyContent/${item.proposal_id}`) } } className={ utilStyle.point }>
                                { item.content.map(m => { return (<List.Item content={ m } />) }) } </List>
                        </Accordion.Content> */}

                    </>)
                }) : <></> }</Card.Group>
            <MsgModal>
                title={ this.state.title }
                data={ this.state.data }
                open={ this.state.open }
                close={ this.close }
            </MsgModal>

        </>);
    }
}

class MyVoteRecord extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    componentDidMount() {
        this.setState({ matches: window.matchMedia("(min-width: 768px)").matches })
    }
    render() {
        return (<>
            <Table celled><Table.Header><Table.Row>
                <Table.HeaderCell>提案標題</Table.HeaderCell>
                <Table.HeaderCell>投票立場</Table.HeaderCell>
            </Table.Row></Table.Header>
                { this.props.proposal_vote !== undefined ? (this.props.proposal_vote.length > 0 ? this.props.proposal_vote.map((item, index) => {
                    return (<>
                        <Table.Body>
                            <Table.Row

                            // onClick={ () => { this.changePage(`PolicyContent/${item.proposal_id}`) } }
                            >
                                <Table.Cell>{ item.title } </Table.Cell>
                                <Table.Cell>{ item.type }</Table.Cell>
                            </Table.Row></Table.Body>
                    </>)
                }) : <>尚未有提案投票紀錄</>) : <></> }
            </Table>
        </>);
    }
}

class MyScoreRecord extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    componentDidMount() {
        this.setState({})
    }
    render() {

        return (<>
            <Card.Group itemsPerRow={ 2 } >
                { this.props.policy_vote !== undefined ? (this.props.policy_vote[0].c_name.length>0 ? this.props.policy_vote.map((item, index) => {
                    return (<>
                        <Card>
                            <Card.Content><Card.Header>{ item.content }</Card.Header></Card.Content>
                            <Card.Content>{ item.c_name.map(c => { return (<Label>{ c }</Label>) }) }</Card.Content>
                            <Card.Content>{ item.type }</Card.Content>
                        </Card>
                    </>)
                }) : <>尚未有政見評分
                </>) : <></> }
            </Card.Group>
        </>);
    }
}





export default User = {
    routeProps: {
        path: "/user",
        component: User
    },
    name: "個人檔案"
}
