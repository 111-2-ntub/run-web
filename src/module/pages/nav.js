import React from 'react';
import logo_dark from '../../imgs/LOGO1.png'
import { Person, SignOut, Info, Star, TextAlignJustified } from 'akar-icons';

import style from "../../css/nav.module.css"
import { Grid, Icon } from 'semantic-ui-react'
import { InfoModal } from '../modal';

export default class Nav extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            "login": !!localStorage.getItem("login"),
            "check": localStorage.getItem("identity") === "2",
            menu: false,
            showInfo: false
        }

    }
    logout = () => {
        localStorage.clear()
        this.setState({ "login": false, menu: false, })
        this.setState({ showInfo: true, mes: "已登出" })
        document.location.reload()

    }
    show = () => {
        this.setState(prevState => ({ menu: !prevState.menu }))
    }
    closeInfo = () => this.setState({ showInfo: false })

    render() {
        return (<>

            <Grid >
                <Grid.Row
                    verticalAlign={ "middle" }
                    id={ style.navtop }
                    className={ style.navtop + " " + style.i_dont_know_how_to_name_it + "   " }>

                    <div class="inline-grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 h-20 w-full">
                        <a href="./#/" class="p-5">
                            <img class="flex object-contain object-left h-14 w-full" src={ logo_dark } alt="" />
                        </a>
                        <div class="sm:flex col-start-2 col-end-5 hidden invisible lg:visible">
                            <span class="p-5 mt-5 flex content-center" ><a href="./#/" className={ this.props.id === 0 ? style.pageOn : style.page } >首頁</a></span>
                            <span class="p-5 mt-5 flex content-center" ><a href="./#/election" className={ this.props.id === 1 ? style.pageOn : style.page }>選舉報你知</a></span>
                            <span class="p-5 mt-5 flex content-center"><a href="./#/policy/1" className={ this.props.id === 2 ? style.pageOn : style.page }>提案專區</a></span>
                            <span class="p-5 mt-5 flex content-center"><a href="./#/figure/" className={ this.props.id === 3 ? style.pageOn : style.page }>政治人物</a></span>
                        </div>
                        <div class="flex col-start-5 justify-end pt-5 mt-4 text-right text-lg lg:text-3xl"><TextAlignJustified onClick={ this.show } /></div>
                    </div>


                </Grid.Row>
                <Grid.Row className={ this.state.menu ? style.open : style.close } columns={ 1 } id={ style.open }>

                    <Grid.Column >
                        <div class="grid grid-rows-2 sm:grid-rows-3 grid-flow-col w-full sm:divide-x divide-black">
                            {/* 政要RUN資訊 */ }
                            <div class="col-start-1 col-end-2 md:col-end-3 row-span-3 place-self-center p-4 hidden sm:flex" >
                                <div class="grid grid-rows-7 grid-cols-2">
                                    <p class="row-span-5 col-span-1">製作團隊</p>
                                    <p class="col-start-2">廖暄毓</p> <p class="col-start-2">羅毓翔</p> <p class="col-start-2">曹芷瑜</p>
                                    <p class="col-start-2">王昱喆</p> <p class="col-start-2">王佳淇</p>
                                    <p class="row-span-1 text-2xl pr-2"><Icon name="instagram" /></p> <p class="col-start-2"><a class="text-black" target='blank' href='https://www.instagram.com/politics_is_running/'>politics_is_running</a></p>
                                    <p class="row-span-1 text-2xl pr-2 "><Icon name="linechat" /></p> <p class="col-start-2"><a class="text-black" target='blank' href='https://line.me/R/ti/p/%40975vlmkd'>政要RUN</a></p>
                                    <p class="row-span-1 col-span-2">
                                        <div class="grid grid-cols-4 divide-x divide-black pt-14">
                                            <span>資料來源</span>
                                            <span class="text-center"><a class="text-black" target='blank' href='https://www.cec.gov.tw/#gsc.tab=0'>中央選舉委員會</a></span>
                                            <span class="text-center"><a class="text-black" target='blank' href='https://data.ly.gov.tw/'>立法院開放資料</a></span>
                                            <span class="text-center pl-2"><a class="text-black" target='blank' href='https://data.gov.tw/'>政府開放資料平台</a></span>
                                        </div>
                                    </p>
                                </div>
                            </div>

                            {/* 主功能 */ }

                            <div class="cols-span-2 row-span-1  border-0 pt-16 sm:pt-4 p-4 sm:border sm:border-t-0 border-black ">
                                <p class="text-center"><a href="./#/" className={ this.props.id === 0 ? style.pageOn : style.pageOff }>首頁</a></p>
                                <p class="text-center"><a href="./#/election" className={ this.props.id === 1 ? style.pageOn : style.pageOff }>選舉報你知</a></p>
                                <p class="text-center"><a href="./#/policy/1" className={ this.props.id === 2 ? style.pageOn : style.pageOff }>提案專區</a></p>
                                <p class="text-center"><a href="./#/figure/" className={ this.props.id === 3 ? style.pageOn : style.pageOff }>政治人物</a></p>
                            </div>

                            {/* 其他功能 */ }
                            <div class="cols-span-2 row-span-1 p-4 pt-16 pr-8 sm:pr-16  border border-t-0 border-b-0 border-r-0 sm:border-0  border-black">
                                <p class="grid gap-2 grid-rows-1 grid-cols-2 justify-center">
                                    <span class="place-self-end"><a href="./#/information/" className={ this.props.id === 6 ? style.pageOn : style.pageOff }><Info /></a></span>
                                    <a href="./#/information/" className={ this.props.id === 6 ? style.pageOn : style.pageOff }>法規與條款資訊</a>
                                </p>
                                { (this.state.login || false ? (<>

                                    <p class="grid gap-2 grid-rows-1 grid-cols-2 justify-center">
                                        <span class="place-self-end"><a href="./#/user/" className={ this.props.id === 4 ? style.pageOn : style.pageOff }><Person /></a></span>
                                        <a href="./#/user/" className={ this.props.id === 4 ? style.pageOn : style.pageOff }>會員檔案</a>
                                    </p>

                                    { this.state.check ?
                                        <p class="grid gap-2 grid-rows-1 grid-cols-2 justify-center">
                                            <span class="place-self-end"><a href="./#/manage/" className={ this.props.id === 6 ? style.pageOn : style.pageOff }><Star /></a></span>
                                            <span class="place-self-start"><a href="./#/manage/" className={ this.props.id === 6 ? style.pageOn : style.pageOff }>管理者</a></span>
                                        </p> : <></> }

                                    <p class="grid gap-2 grid-rows-1 grid-cols-2 justify-center cursor-pointer" onClick={ this.logout }>
                                        <span class="hover:text-gray-300 place-self-end text-xl"><SignOut /></span>
                                        <span class="hover:text-gray-300">登出</span>
                                    </p>
                                </>) : (<>
                                    <p class="grid gap-2 grid-rows-1 grid-cols-1 pl-12 text-center cursor-pointer">
                                        <a className={ style.pageOff } href="./#/login">登入</a>
                                    </p>
                                    <p class="grid gap-2 grid-rows-1 grid-cols-1 pl-12 text-center cursor-pointer">
                                        <a className={ style.pageOff } href="./#/sign">註冊</a>
                                    </p>
                                </>)) }
                            </div>
                        </div>
                    </Grid.Column>


                </Grid.Row>
            </Grid>
            <InfoModal open={ this.state.showInfo } close={ this.closeInfo = {} } content={ this.state.mes ? this.state.mes : "" } />

        </>)
    }
}
