import React from 'react';

import { Button, Comment, Header, Form, List, Segment, Icon, Label } from 'semantic-ui-react'
import { Pages } from "../pages.js";
import Chart from 'react-apexcharts'
import style from "../../css/policyContent.module.css"
import utilStyle from "../../css/util.module.css"

import { trackPromise } from 'react-promise-tracker';

import { FaceHappy, FaceNeutral, FaceSad } from 'akar-icons';
import { ProposalR } from "../request/proposalR"
import { InfoModal, ReportModal } from "../modal"

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/page-navigation/lib/styles/index.css';




class PolicyContent extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            "login": !!localStorage.getItem("login"),
            userName: localStorage.getItem("login"),
            reportModal: false,
            kpi: {
                series: [10, 50, 40],
                options: {
                    colors: ['#fec240', '#98c4d1', '#de4b43'],
                    labels: ["贊成", "中立", "反對"],
                    chart: { width: 50 }
                },
            },
            proposal_id: props.match.params.id,
            open: false,
            proposal: localStorage.getItem("proposal"),
            parent_b: 0,
            parent_id: 0
        }
    }
    componentDidMount() {
        this.getMsg()
    }
    showNoteModal = (m) => {
        this.setState({ open: !this.state.open, noteModalC: m })
        if (!m) document.location.reload()
    }
    closeNoteModal = () => {
        this.setState({ noteModal: false })

    }
    vote = () => {
        trackPromise(
            ProposalR.vote({ user_id: this.state.userName, sp_id: this.state.voteValue, proposal_id: this.state.proposal_id }).then(response => {
                console.log(response)
                if (response.data.success) {
                    this.showNoteModal("投票成功")
                    this.getMsg()
                }
            })
        )

    }
    voteChange = (val) => this.setState({ voteValue: val });

    getMsg = () => {
        trackPromise(
            ProposalR.msgList(this.state.proposal_id, { "user_id": this.state.userName }).then(response => {
                let resData = response.data.D
                let msgL = resData.msg
                let detail = resData.detail[0]
                let vote = resData.vote[0]
                let heart = resData.heart.length
                let rule = resData.rule
                let voteT = (vote.goodc + vote.badc + vote.medc)
                let voteD = [vote.goodc === 0 ? 0 : vote.goodc / voteT * 100, vote.medc === 0 ? 0 : vote.medc / voteT * 100, vote.badc === 0 ? 0 : vote.badc / voteT * 100]
                let msgL_B = []
                if (Array.isArray(msgL)) {
                    msgL.forEach(item => {
                        msgL_B.push(item.id)
                    })
                }
                this.setState({ detail: detail, heart: heart, msgL: msgL, rule: rule, voteD: voteD, msgL_B: msgL_B })
            })
        )


    }

    msg = () => {
        let msg = document.getElementById("msg")
        console.log(msg.value)
        trackPromise(
            ProposalR.msg({ user_id: this.state.userName, content: msg.value, article_id: this.state.proposal_id, parent_id: this.state.parent_id }).then(response => {
                if (response.data.success) {
                    msg.value = ""
                    this.setState({ parent_b: 0, parent_id: 0 })
                    this.showNoteModal("留言成功")
                    this.getMsg()

                }
                else{
                    this.showNoteModal(response.message)
                }
            })
        )
    }
    showReport = (msgid) => {

        if (!this.state.ReportModal) {
            this.setState({
                reportModal: !this.state.reportModal,
                msgid: msgid
            })
        }
        else {
            this.setState({
                reportModal: !this.state.reportModal,
                msgid: null
            })
        }

    }
    report = () => {
        let ruleInput = []
        for (let i of this.state.rule) {
            if (document.getElementById(`reportInput-${i.id}`).checked) ruleInput.push(i.id)
        }
        let remark = document.getElementById("reportInputRemark").value || " "
        console.log(this.state.report_id)
        return ProposalR.report({ user_id: this.state.userName, message_id: this.state.report_id, remark: remark, rule: ruleInput }).then()
    }

    save = () => {
        if (this.state.heart) {
            trackPromise(
                ProposalR.removeSave({ user_id: this.state.userName, proposal_id: this.state.proposal_id }).then(res => {
                    console.log(res)
                })
            )
        }

        else {
            trackPromise(
                ProposalR.save({ "user_id": this.state.userName, "proposal_id": this.state.proposal_id }).then(res => {
                    console.log(res)
                })
            )
        }
        this.setState({ heart: !this.state.heart })
    }



    reply = (msg_id, b_id) => {
        this.setState({ parent_id: msg_id, parent_b: b_id })
        document.getElementById("msg").scrollIntoView();
    }
    cancelReply = () => this.setState({ parent_b: 0, parent_id: 0 })


    render() {
        return (<Pages id={ 2 }
            pageInfo={ [{ content: '提案專區', link: true, href: "./#/Policy" },
            { content: this.state.detail && this.state.detail.title, active: true, href: `./#/PolicyContent/${this.state.proposal_id}` }] }
            page={
                (<>{ }
                    { this.state.detail != null ? (<>
                        <div>
                            <div className={ style.topicBold }>{ this.state.detail.title }</div>
                            <Segment basic>
                                <List verticalAlign='middle'>
                                    <List.Item>
                                        <List horizontal>
                                            <List.Item><Header>提案人</Header></List.Item>
                                            { this.state.detail !== undefined ?
                                                this.state.detail.f_name.map(item => {
                                                    return (<List.Item ><Label> { item }</Label></List.Item>)
                                                }) : <></> }
                                        </List>
                                    </List.Item>
                                    <List.Item>
                                        <List.Content floated='right'>
                                            {
                                                this.state.login && <><Icon name={ "heart" } onClick={ this.save }
                                                    className={ utilStyle.point + " " + this.state.heart ? style.redHeart : style.heart } />
                                                    { this.state.heart ? "已收藏" : "收藏" }
                                                </>
                                            }
                                        </List.Content>
                                        <List horizontal verticalAlign='middle'>
                                            <List.Item><Header>提案進度</Header></List.Item>
                                            <List.Item>
                                                <Label>  { this.state.detail !== undefined ? this.state.detail.status : "" }</Label>
                                            </List.Item>
                                        </List>
                                    </List.Item>
                                </List>

                            </Segment>
                            <Label.Group>
                                { this.state.detail.c_name !== null ? this.state.detail.c_name.map(item => { return (item != null ? <Label>{ item }</Label> : <></>) }) : <></> }
                            </Label.Group>

                            <div className="w-full">
                                <iframe src={ this.state.detail !== undefined ? this.state.detail.pdfUrl : "" } title="doc" className="w-full h-screen"></iframe>
                            </div>
                        </div>

                    </>) : (<></>) }
                    <div class="grid grid-rows-3 sm:grid-rows-1 grid-flow-col gap-4 mt-6">
                        { this.state.login === true ? (<>

                            <div class="row-span-2 w-full inset-0 sm:col-start-1 sm:col-end-7 sm:row-span-1 flex flex-col bg-white p-4 shadow rounded-lg">
                                <div className={ style.lable }>
                                    <p class="float-left">您的看法：(請點選投票)</p>
                                </div>
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-0 justify-items-center" role="group">
                                    <button type="button" class="bg-white rounded w-30 p-5 hover:bg-gray-200 cursor-pointer focus:bg-gray-200" onClick={ () => this.voteChange(0) } >
                                        <FaceHappy className={ style.green + " " + style.size } />
                                    </button>
                                    <button type="button" class="bg-white rounded w-30 p-5 hover:bg-gray-200 cursor-pointer focus:bg-gray-200" onClick={ () => this.voteChange(1) } >
                                        <FaceNeutral className={ style.yellow + " " + style.size } />
                                    </button>
                                    <button type="button" class="bg-white rounded w-30 p-5 hover:bg-gray-200 cursor-pointer focus:bg-gray-200" onClick={ () => this.voteChange(2) } >
                                        <FaceSad className={ style.red + " " + style.size } />
                                    </button>
                                </div>

                                <div class="grid justify-items-center mt-3">
                                    <div><Button onClick={ this.vote }> 確定投票</Button></div>
                                </div>
                            </div>




                        </>) : <>請登入後，投票對於此提案的立場</> }
                        <div class="row-start-3 w-full inset-0 sm:row-start-1 sm:col-start-8 sm:col-end-10 row-span-1 flex flex-col items-center justify-center bg-white p-4 shadow rounded-lg">
                            <div>
                                <div className={ style.lable }>RUN民看法：</div>
                                { this.state.voteD ? <>
                                    <div><Chart options={ this.state.kpi.options } series={ this.state.voteD } type="donut" /></div>
                                </> : <></> }

                            </div>
                        </div>
                    </div>

                    <div class="mt-6">
                        <Segment>
                            <Comment.Group >
                                <Header as='h3' dividing>RUN民討論區</Header>
                                { this.state.msgL || false ? (this.state.msgL.map((placement, index) => {

                                    return (<>
                                        <Comment>
                                            <Comment.Content>
                                                <Comment.Author as={ "span" } className='bg-red'>{ placement.name }</Comment.Author>
                                                { placement.parent_id !== 0 ? <Comment.Metadata><Label>回覆 B{ this.state.msgL_B.indexOf(placement.parent_id) + 1 } </Label></Comment.Metadata> : "" }

                                                <Comment.Metadata>B{ index + 1 }</Comment.Metadata>
                                                { placement.risk !== 0 ? <Comment.Metadata><Icon name="exclamation circle" />待觀察</Comment.Metadata> : <></> }
                                                <Comment.Metadata>{ placement.time }</Comment.Metadata>
                                                <Comment.Text>{ placement.content }</Comment.Text>
                                                <Comment.Actions>
                                                    <Comment.Action onClick={ () => this.reply(placement.id, index + 1) }>回覆</Comment.Action>
                                                    <ReportModal btn={ (<Comment.Action onClick={ () => this.setState({ "report_id": placement.id }) }>檢舉</Comment.Action>) }
                                                        rule={ this.state.rule } toDo={ this.report }
                                                    />

                                                </Comment.Actions>
                                            </Comment.Content>
                                        </Comment>
                                    </>)
                                })) : <></> }
                                { this.state.login && <>
                                    <Form reply>
                                        { this.state.parent_b ? this.state.parent_b === 0 ? <></> : <Button onClick={ this.cancelReply } content={ <>回覆 B{ this.state.parent_b }</> } icon="close" /> : <></> }
                                        <Form.TextArea rows={ 1 } className={ style.input } id="msg" />
                                        <Button content='發佈' labelPosition='left' icon='edit' primary onClick={ this.msg } />
                                    </Form>
                                </> }

                            </Comment.Group></Segment>
                    </div>


                    <InfoModal open={ this.state.open } content={ this.state.noteModalC } close={ this.showNoteModal } />
                </>)
            } />)
    }
}





export default PolicyContent = {
    routeProps: {
        path: "/PolicyContent/:id",
        component: PolicyContent
    },
    name: "提案內容"
}
