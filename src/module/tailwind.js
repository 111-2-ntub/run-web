import React from 'react';
import { Icon } from 'semantic-ui-react'
class HomeFirst extends React.Component {
    render() {
        return (<>
            <div class="p-3 w-full self-center ">
                <div class="mt-8 h-20 w-4/5 sm:w-80 absolute flex justify-center items-center">
                    { this.props.person ? <img
                        class="object-cover h-24 w-24 rounded-full"
                        src={ this.props.person }
                        alt=""
                    /> : <></> }
                </div>
                <div class="mx-4  w-5/6 bg-gray-600 rounded-3xl shadow-md sm:w-80 sm:mx-0 ">
                    <div class="h-1/2 w-full flex justify-between items-baseline px-3 py-5"></div>

                    <div class="bg-white p-5 w-full rounded-3xl flex flex-col justify-around items-center">
                        <div class="w-full h-1/2 flex    justify-end px-3 pt-2">

                            <div class="flex flex-col justify-end">
                                <h1 class="text-gray-500 text-xs"><Icon name={ "thumbs up" } /></h1>
                                <h1 class="text-gray-600 text-sm">{ this.props.score }</h1>
                            </div>
                        </div>
                        <div class="w-full flex flex-col justify-center items-center">
                            { Array.isArray(this.props.name) ? this.props.name.map(item => <div>{ item }</div>) : <h1 class="text-gray-700 font-bold"> { this.props.name }</h1> }
                            <div class="text-gray-500 text-sm md:text-lg font-bold"> 「{ this.props.title }」</div>
                        </div>
                    </div>
                </div>
            </div>
        </>)
    }


}

class HomeTable extends React.Component {
    render() {
        return (<>
            <div class="flex items-center justify-center  ">
                <div class="w-full">
                    <div class="overflow-auto lg:overflow-visible ">
                        <table class="table  border-separate space-x-4 text-sm w-full">

                            <tbody>
                                { Array.isArray(this.props.data) ? <>
                                    { this.props.data.map((item, index) => {
                                        return (index > 0 ? <>
                                            <tr class="bg-white text-lg  ">
                                                {
                                                    "name" in item ? <td class="p-3 w-24">
                                                        <div class="flex align-items-center justify-start">
                                                            <img class="rounded-full h-12 w-12   object-cover" src={ this.props.person !== undefined ? this.props.person : item.photo } alt="" />
                                                        </div>
                                                    </td> : <></>
                                                }
                                                { "name" in item ?
                                                    <td class="w-32">
                                                        <div class="p-3  ">
                                                            <div class="p-3">{ item.name }</div>
                                                        </div>
                                                    </td>
                                                    : <></> }



                                                <td class="p-3">{ item.title }</td>
                                                <td class="p-3  w-10">{ item.score }</td>


                                            </tr>
                                        </> : <></>)
                                    }) }

                                </> : <></> }


                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>)
    }
}

class TailwindModal extends React.Component {
    render() {
        return (this.props.show ? <>
            <div class="min-w-screen h-screen animated fadeIn faster  fixed  left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover" id="modal-id">
                <div class="absolute bg-black opacity-80 inset-0 z-0"></div>
                <div class="w-full  max-w-lg p-5 relative mx-auto my-auto rounded-xl shadow-lg  bg-white ">
                    {/* <!--content--> */ }
                    <div class="">
                        {/* <!--body--> */ }
                        <div class="text-center p-5 flex-auto justify-center">

                            {/* <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 -m-1 flex items-center text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 flex items-center text-red-500 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                            </svg> */}
                            <h2 class="text-xl font-bold py-4 ">{ this.props.title ?? "標題" }</h2>
                            <p class="text-sm  px-8">{ this.props.child ?? "內文" }</p>
                        </div>
                        {/* <!--footer--> */ }
                        <div class="p-3  mt-2 text-center space-x-4 md:block">
                            {
                                this.props.onlyOK ? <>
                                    <button class="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-full hover:shadow-lg hover:bg-gray-100">
                                        確定
                                    </button>
                                </> : this.props.onlyCancel ? <>
                                    <button class="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-full hover:shadow-lg hover:bg-gray-100">
                                        取消
                                    </button>
                                </> : <>
                                    <button class="mb-2 md:mb-0 bg-green-500 px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-white rounded-full hover:shadow-lg hover:bg-green-600">
                                        確定
                                    </button>
                                    <button class="mb-2 md:mb-0 bg-red-500 border border-red-500 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-red-600">取消</button>
                                </>
                            }

                        </div>
                    </div>
                </div>
            </div>
        </> : <></>)
    }
}

class ColorNumber extends React.Component {
    render() {
        return (<>
            { this.props.neg ?
                <span class="flex items-center px-2 py-0.5 mx-2 text-sm text-red-600 bg-red-100 rounded-full">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>{ this.props.value }</span>
                </span> : <span class="flex items-center px-2 py-0.5 mx-2 text-sm text-green-600 bg-green-100 rounded-full">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 15L12 9L6 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span>{ this.props.value }</span>
                </span> }

        </>)
    }
}

export { HomeFirst, HomeTable, TailwindModal, ColorNumber }