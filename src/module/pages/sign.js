import React from 'react';
import { MemberR } from "../request/memberR.js"
import { PoliticianR } from "../request/politicianR"
import logo from '../../imgs/LOGO.jpg'
import style from "../../css/sign.module.css"
import { trackPromise } from 'react-promise-tracker';
import { Grid, Button, Input, Image, Select, Segment, Form } from 'semantic-ui-react'
import { sha256 } from 'js-sha256';

class Base extends React.Component {

    render() {
        return (<>

            <Grid textAlign={ "center" }   >
                <Grid.Row  >
                    <Grid.Column width={ 8 } only={ "computer tablet" }  >
                        <div className={ style.back } ></div>
                    </Grid.Column>
                    {/* <Grid.Column width={ 1 } only="computer tablet"></Grid.Column> */ }
                    <Grid.Column width={ 8 } mobile={ 14 } computer={ 8 } tablet={ 8 } className={ style.backC } textAlign={ "center" } verticalAlign={ "middle" }>
                        <div className={ style.homeKey } >
                            <a href="./#/"><Image src={ logo } className={ style.homeKey } /></a>
                        </div>
                        <div>
                            { this.props.content }
                        </div>

                    </Grid.Column>
                    {/* <Grid.Column width={ 1 } only="computer tablet"></Grid.Column> */ }
                </Grid.Row></Grid>


        </>)
    }
}

class Sign extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            "showInfo": false,
            "message": "",
        }
    }

    send = () => {

        let account = document.getElementById("account").value
        let psw = sha256(document.getElementById("password").value)
        let age = document.getElementById("birth").value
        let sex = this.state.sex
        let city = this.state.city_id
        let name = document.getElementById("name").value
        let phone = document.getElementById("phone").value
        let degree = this.state.degree
        trackPromise(
            MemberR.sign({ "account": account, password: psw, age: age, sex: sex, areaid: city, name: name, degree: degree, phone: phone }).then(res => {
                if (res.data.success) {
                    localStorage.setItem("login", account)
                    window.location.href = "./#/sign2"
                } else {
                    this.setState({ errorMes: res.message })
                }
            })
        )

    }
    showinfo = (msg) => {
        this.setState({ showinfo: !this.state.showinfo, message: msg })
    }
    componentDidMount() {
        trackPromise(
            PoliticianR.area().then(res => {
                this.setState({ city: res.data.D })
            })
        )
    }
    sexChange = (event, sex) => this.setState({ "sex": sex.value })

    cityChange = (event, city) => this.setState({ "city_id": city.value })
    degreeChange = (event, degree) => this.setState({ "degree": degree.value })


    render() {
        const sexList = [{ value: "男", text: "男" }, { value: "女", text: "女" }]
        const degreeList = [{ value: "0", text: "國小以下" }, { value: "1", text: "國小" }, { value: "2", text: "國中" }, { value: "3", text: "高中" }, { value: "4", text: "專科" }, { value: "5", text: "大學" }, { value: "6", text: "碩士" }, { value: "7", text: "博士" }]
        return (<Base content={ < >
            <Grid centered textAlign={ "center" } >
                <Grid.Row >
                    <Grid.Column width={ 12 } textAlign={ "center" }>
                        <Segment raised >
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div><Input className={ style.select } placeholder='帳號' id="account" /></div>
                                <div><Input className={ style.select } type="text" placeholder="暱稱" id="name" /></div>
                                <div><Input className={ style.select } type="password" placeholder="密碼" id="password" /></div>
                                <div><Input className={ style.select } type="password" placeholder="確認密碼" id="checkpsd" /></div>

                                <div><Select className={ style.select } id="sex" placeholder="性別" options={ sexList } onChange={ this.sexChange } /></div>
                                <div><Select className={ style.select } id="sex" placeholder="學歷" options={ degreeList } onChange={ this.degreeChange } /></div>
                                <p class="text-gray-400 flex px-1"><span class="flex-none self-center">生日：</span><span class='flex-none'><Input className={ style.birth } type="date" id="birth" /></span></p>
                                <div class="pb-1"><Select className={ style.select } id="city" placeholder="居住地" options={ this.state.city } onChange={ this.cityChange } /></div>
                                <p><Input className={ style.select } type="phone" placeholder="手機號碼" id="phone" /></p>
                                <p>{ this.state.errorMes ? this.state.errorMes : "" }</p>
                            </div>
                            <p className={ style.csign }>
                                點擊「繼續註冊」即表示你同意我們的 <a href="./#/information/" target="_blank">《服務條款》</a>、
                                <a href="./#/information/" target="_blank">《資料政策》</a>和<a href="./#/information/" target="_blank">《Cookie 政策》</a>。
                            </p>
                            <p><Button id="continue" variant="secondary" className={ style.continue } onClick={ this.send } >繼續註冊</Button></p>

                            <a href="./#/login">已有帳號  &nbsp; &nbsp; <h5>登入</h5></a>
                        </Segment>

                    </Grid.Column>
                    <Grid.Column width={ 6 }>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </ > }></Base>)
    }
}

class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            "showInfo": false,
            "message": ""
        }
    }

    send = () => {
        var account = document.getElementById("account").value
        var password = sha256(document.getElementById("password").value);
        trackPromise(
            MemberR.login({ "account": account, "password": password }).then(res => {
                console.log(res)
                if (res.data.success) {
                    let resD = res.data.D
                    localStorage.setItem("login", account)
                    localStorage.setItem("identity", resD.data[0].identity)
                    window.history.back()
                } else {
                    this.setState({ errorMes: res.message })
                }

            }, error => console.log("error", error))
        )
    }
    render() {
        return (<Base content={ <div className={ style.need_to_center }>
            <Grid textAlign={ "center" }> <Grid.Row>
                <Grid.Column computer={ 10 } tablet={ 13 } mobile={ 16 }>
                    <Segment raised padded>
                        <Form.Group>
                            <p><Input focus placeholder="帳號" id="account" /></p>
                            <p><Input type="password" focus placeholder="密碼" id="password" /></p>
                            <p>   <Button id="continue" className={ style.loginBtn } onClick={ this.send }>登入</Button></p>
                            <p>{ this.state.errorMes ? this.state.errorMes : "" }</p>
                            
                        </Form.Group>
                        <a href="./#/sign" >沒有帳號  &nbsp; &nbsp; <h5>註冊</h5></a>
                    </Segment>
                </Grid.Column>
            </Grid.Row></Grid>
        </div> }></Base>)
    }
}

class SignNext extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userName: localStorage.getItem("login"),
        }
    }

    componentDidMount() {
        let d = ["財政金融", "教育", "內政", "司法及法制", "科技", "觀光", "國防", "食品安全", "長期照顧",
            "衛生社福", "農業", "交通", "海洋", "性別平等", "動物保育", "原住民", "外交", "兩岸關係", "高齡化",
            "幼托育兒", "年改", "基礎建設", "拒毒品", "客家", "治安", "都市發展", "補助", "都市美化", "汽機車",
            "環保", "體育賽事", "勞工就業", "青年", "文創", "新住民",]
        let istoggle = []
        d.forEach(() => istoggle.push(false))
        this.setState({ sub: d, isToggleOn: istoggle })
    }

    send = () => {
        let c_id = []
        this.state.isToggleOn.forEach((item, index) => {
            if (item) {
                c_id.push(index + 1)
            }
        })
        trackPromise(
            MemberR.category({ "add": c_id, "user_id": this.state.userName, "remove": [] }).then(res => {
                console.log(res)
                if (res.data.success) {
                    window.location.href = "./#/"
                }
            })
        )


    }
    cancel = () => {
        window.location.href = "./#/"
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
        return (<Base content={ <div className={ style.need_to_center }>
            <Segment className={ style.formSBg }>
                <p className={ style.rule }>請選擇有興趣的類別：</p>
                <div>
                    {
                        this.state.sub !== undefined ? this.state.sub.map((item, index) => {
                            return (<Button onClick={ () => { this.handleClick(index) } } className={ (this.state.isToggleOn[index] ? style.selected : style.subBtn) } size='mini'  >{ item }</Button>)
                        }) : <>no non no </>
                    }
                </div>
                <p>
                    <Button id="continue" className={ style.selected } onClick={ this.cancel }>取消</Button>
                    <Button id="continue" className={ style.selected } onClick={ this.send }>確認送出</Button>
                </p>
            </Segment>
        </div> }></Base>)
    }
}

export const sign = {
    routeProps: {
        path: "/sign",
        component: Sign
    },
    name: "註冊"
}

export const signNext = {
    routeProps: {
        path: "/sign2",
        component: SignNext
    },
    name: "興趣選單"
}

export const login = {
    routeProps: {
        path: "/login",
        component: Login
    },
    name: "登入"
}