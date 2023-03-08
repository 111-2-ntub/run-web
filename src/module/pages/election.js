import React from 'react';
import { Pages } from "../pages.js";
import { Grid, Ref, Embed,  Image } from 'semantic-ui-react';
import vote1 from "../../imgs/vote3-1.jpg"
import vote2 from "../../imgs/vote3-2.jpg"
import vote3 from "../../imgs/vote5.jpg"
import vote4 from "../../imgs/vote6.jpg"
import time from "../../imgs/time.jpg"
import ele from "../../imgs/election.jpg"
import "tailwindcss/tailwind.css"



class Election extends React.Component {
    constructor(props) {
        super(props)
        this.voteRef = React.createRef();
        this.QARef = React.createRef();
        this.thingRef = React.createRef();
        this.searchRef = React.createRef();
        this.state = {
            qa: [{ title: "選舉前幾天不能宣傳嗎?為甚麼?會有甚麼後果?", content: "投票日不可從事競選或助選活動：1.不可從事競選或助選活動(包含用簡訊或LINE等通訊軟體進行拉票)，違反者，處新臺幣50萬元以上5百萬元以下罰鍰，經制止不聽者，按次連續處罰。2.不可於投票所四周30公尺內喧嚷或干擾勸誘他人投票或不投票，經警衛人員制止後仍繼續為之者，處1年以下有期徒刑、拘役或科新臺幣1萬5千以下罰金。" },
            { title: "身心障礙者可否由家屬協助投票?", content: "選舉人如因身心障礙不能自行圈投，而能表示其意思者，得依其請求，由家屬1人在場，依據本人意思，眼同協助或代為圈投；如當事人無法表示其意思，則不適用上開規定。" },
            { title: "我去投票所排隊的時候，下午四點到了，還能投票嗎?", content: "只要您在投票時間截止前到達投票所前排隊領票，仍可投票。" },
            { title: "不小心圈選於圈選欄之外的選票是否有效?", content: "選票圈選欄為3公分＊2.5公分之空白欄位，圈選工具之印文直徑則為1公分，是以選舉人在正常圈選之情況下，圈印印文應不致跨出欄外，但如不小心蓋出欄外，只要所蓋印文蓋於欄格線，仍可辨別圈選何候選人時，仍將被認定為有效票。" },
            { title: "投票的時候，我不小心蓋錯選票，我該怎麼辦?可以重新領票再投嗎?", content: "投票的時候，不小心蓋錯選票，無法重新領票再投。請選舉人於投票時應審慎圈選，若不小心蓋錯選票，仍請投入票匭，請勿撕毀選票，或將選票攜出。若有違反者，撕毀選舉票，將處新臺幣5千 元以上5萬元以下罰鍰；攜出選舉票，將處1年以下有期徒刑、拘役或科新臺幣1萬5千元以下罰金。（總統副總統選舉罷免法第93條第1項、第96條第8項；公職人員選舉罷免法第108條第1項、第110條第8項）" },
            { title: "甚麼時候會收到選舉公報?", content: "各鄉(鎮、市、區)公所會在投票日2日前將選舉公報送達選舉區內各戶。" },
            { title: "我沒收到投票通知單，怎麼辦?", content: "投票通知單由戶政機關依據確定之選舉人名冊填造，送由鄉（鎮、市、區）公所於投票日2日前分送選舉區內各戶。屆時選舉人如未收到，可逕向戶籍地鄉（鎮、市、區）公所洽詢。" },

            ], activeIndex: 0,
            note: ["公告全國性公民投票案第20案投票日期、投票起、止時間、編號、主文、理由書、政府機關針對公民投票案提出之意見書、公民投票權行使範圍及方式、正反意見支持代表於全國性無線電視頻道發表意見或進行辯論之辦理期間與應遵行之事項等事項", "中選會提醒有意參加公投意見發表會或辯論會者，請在6月4日前申請許可設立辦事處並完成報名", "公告全國性公民投票案第19案投票日期、投票起、止時間、編號、主文、理由書、政府機關針對公民投票案提出之意見書、公民投票權行使範圍及方式、正反意見支持代表於全國性無線電視頻道發表意見或進行辯論之辦理期間與應遵行之事項等事項"]
        }


    }

    componentDidMount() {
        let tabsContainer = document.querySelector("#tabs");
        let tabsContainerVote = document.querySelector("#voteTabs");
        let tabTogglers = tabsContainer.querySelectorAll("a");
        let tabTogglersVote = tabsContainerVote.querySelectorAll("a");
        console.log(tabTogglers);
        console.log(tabTogglersVote);

        tabTogglers.forEach(function (toggler) {
            toggler.addEventListener("click", function (e) {
                e.preventDefault();

                let tabName = this.getAttribute("href");
                console.log(tabName)
                let tabContents = document.querySelector("#tab-contents");

                for (let i = 0; i < tabContents.children.length; i++) {

                    tabTogglers[i].parentElement.classList.remove("border-blue-800", "bg-white", "border-b", "-mb-px", "opacity-100");
                    tabContents.children[i].classList.remove("hidden");
                    if ("#" + tabContents.children[i].id === tabName) {
                        continue;
                    }
                    tabContents.children[i].classList.add("hidden");

                }
                e.target.parentElement.classList.add("border-blue-800", "bg-white", "border-b-4", "-mb-px", "opacity-100");
            });
        });

        tabTogglersVote.forEach(function (toggler) {
            toggler.addEventListener("click", function (e) {
                e.preventDefault();

                let tabName = this.getAttribute("href");
                console.log(tabName)
                let tabContentsVote = document.querySelector("#tab-contentsVote");

                for (let i = 0; i < tabContentsVote.children.length; i++) {

                    tabTogglersVote[i].parentElement.classList.remove("border-blue-800", "bg-white", "border-b", "-mb-px", "opacity-100");
                    tabContentsVote.children[i].classList.remove("hidden");
                    if ("#" + tabContentsVote.children[i].id === tabName) {
                        continue;
                    }
                    tabContentsVote.children[i].classList.add("hidden");

                }
                e.target.parentElement.classList.add("border-blue-800", "bg-white", "border-b-4", "-mb-px", "opacity-100");
            });
        });

        document.getElementById("default-tab").click();
        document.getElementById("default-tabVote").click();
    }
    // toVote = () => {

    //     this.voteRef.current.scrollIntoView({ behavior: 'smooth' })
    // }
    // toQa = () => {
    //     this.QARef.current.scrollIntoView({ behavior: 'smooth' })
    // }
    // toSearch = () => {
    //     this.searchRef.current.scrollIntoView({ behavior: 'smooth' })
    // }
    // toThing = () => {
    //     this.thingRef.current.scrollIntoView({ behavior: 'smooth' })
    // }
    handleClick = (e, titleProps) => {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index

        this.setState({ activeIndex: newIndex })
    }





    render() {
        const rate = 3
        const { activeIndex } = this.state
        // const panes1 = [
        //     {
        //         menuItem: '投票三口訣', render: () =>
        //             <Tab.Pane>
        //                 <Image src={vote1} size='huge' centered />
        //             </Tab.Pane>
        //     },
        //     {
        //         menuItem: '投票三寶', render: () =>
        //             <Tab.Pane>
        //                 <Image src={vote2} size='huge' centered />
        //             </Tab.Pane>
        //     },
        //     {
        //         menuItem: '投票這五步', render: () =>
        //             <Tab.Pane>
        //                 <Image src={vote3} size='large' centered />
        //             </Tab.Pane>
        //     },
        //     {
        //         menuItem: '投票這六不', render: () =>
        //             <Tab.Pane>
        //                 <Image src={vote4} size='large' centered />
        //             </Tab.Pane>
        //     },
        //     {
        //         menuItem: '投票流程教學', render: () =>
        //             <Tab.Pane>
        //                 <Embed id='uZp4P70H6E8' /*placeholder='/images/image-16by9.png'*/ source='youtube' />
        //             </Tab.Pane>
        //     },
        // ]
        return (<Pages id={1} class="p-0" pageInfo={[{ content: '選舉報你知', active: true, href: "./#/election" }]} page={
            (<>
                <div class="flex justify-center "> <img class="w-0 lg:w-3/5 " alt="" src={ele}></img></div>
                <div class="w-full  mt-4  rounded">
                    {/* <!-- Tabs --> */}
                    <ul id="tabs" class="flex justify-center ">
                        <li class="px-2 py-1 lg:px-8.py-2 -mb-px font-semibold bg-white  border-b-2 border-blue-800  rounded-t opacity-50"><a class="text-gray-700 hover:text-blue-800 focus:text-blue-900" id="default-tab" href="#second">投票要點</a></li>
                        <li class="px-2 py-1 lg:px-8.py-2 font-semibold bg-white  rounded-t opacity-50"><a class="text-gray-700 hover:text-blue-800 focus:text-blue-900" href="#third">QA大集合</a></li>
                        <li class="px-2 py-1 lg:px-8.py-2 font-semibold bg-white  rounded-t opacity-50"><a class="text-gray-700 hover:text-blue-800 focus:text-blue-900" href="#fourth">民主大事紀</a></li>
                    </ul>

                    {/* <!-- Tab Contents --> */}
                    <div id="tab-contents" class="bg-white w-full">

                        <div id="second" class="hidden p-4">
                            <Grid><Grid.Row>
                                {/* <Grid.Column width={ rate } computer={ rate } mobile={ 16 }>
                            
                                            <Button color={ "teal" } variant="secondary" size="lg" disabled >投票要點</Button>
                                        
                                    </Grid.Column> */}
                                <Grid.Column width={16}>
                                    <div class="p-4 rounded-md">
                                        <Ref innerRef={this.voteRef}><h1 class="flex justify-center text-3xl lg:text-5xl mb-12">投票要點</h1></Ref>
                                        {/* <Tab class="text-xl" panes={panes1} /> */}
                                        <div class="w-full  mt-4  rounded">
                                            {/* <!-- 投票Tabs --> */}
                                            <ul id="voteTabs" class="flex justify-center ">
                                                <li class="px-2 py-1 lg:px-8.py-2 -mb-px font-semibold bg-white  border-b-2 border-blue-800  rounded-t opacity-50"><a class="text-gray-700 hover:text-blue-800 focus:text-blue-900" id="default-tabVote" href="#one">投票三口訣</a></li>
                                                <li class="px-2 py-1 lg:px-8.py-2 font-semibold bg-white  rounded-t opacity-50"><a class="text-gray-700 hover:text-blue-800 focus:text-blue-900" href="#two">投票三寶</a></li>
                                                <li class="px-2 py-1 lg:px-8.py-2 font-semibold bg-white  rounded-t opacity-50"><a class="text-gray-700 hover:text-blue-800 focus:text-blue-900" href="#three">投票這五步</a></li>
                                                <li class="px-2 py-1 lg:px-8.py-2 font-semibold bg-white  rounded-t opacity-50"><a class="text-gray-700 hover:text-blue-800 focus:text-blue-900" href="#four">投票這六不</a></li>
                                                <li class="px-2 py-1 lg:px-8.py-2 font-semibold bg-white  rounded-t opacity-50"><a class="text-gray-700 hover:text-blue-800 focus:text-blue-900" href="#five">投票流程教學</a></li>
                                            </ul>

                                            {/* <!-- 投票Tab Contents --> */}
                                            <div id="tab-contentsVote" class="bg-white w-full">
                                                <div id="one" class="hidden p-4">
                                                    <Image src={vote1} size='huge' centered />
                                                </div>
                                                <div id="two" class="hidden p-4">
                                                    <Image src={vote2} size='huge' centered />
                                                </div>
                                                <div id="three" class="hidden p-4">
                                                    <Image src={vote3} size='large' centered />
                                                </div>
                                                <div id="four" class="hidden p-4">
                                                    <Image src={vote4} size='large' centered />
                                                </div>
                                                <div id="five" class="hidden p-4">
                                                    <Embed id='uZp4P70H6E8' /*placeholder='/images/image-16by9.png'*/ source='youtube' />
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </Grid.Column>
                            </Grid.Row></Grid>
                        </div>

                        <div id="third" class="hidden p-4">
                            <Grid><Grid.Row>
                                {/* <Grid.Column width={ rate } computer={ rate } mobile={ 16 }>
                                
                                            <Button color={ "teal" } variant="secondary" size="lg" disabled >QA大集合</Button>
                                        
                                    </Grid.Column> */}

                                <Grid.Column width={16}  >
                                    <div class="p-4 lg:px-24 rounded-md">
                                        <Ref innerRef={this.QARef}>
                                            <h1 class="flex justify-center text-3xl lg:text-5xl mb-12">Q & A 大集合</h1>
                                        </Ref>
                                        {this.state.qa.map((item, index) => {
                                            return (<>
                                                <div class="bg-red-50 p-0 lg:p-6  flex items-center space-x-6 rounded-lg hover:scale-105 transition transform duration-500">
                                                    <div class="h-15 w-10 lg:h-20 lg:w-20 p-3 lg:px-0 text-3xl lg:text-6xl inline-block align-middle py-1 text-red-600 font-semibold">Q.
                                                        {/* <img src={Q}></img> */}
                                                    </div>
                                                    <div class="w-full">
                                                        <p class="text-xl lg:text-3xl font-bold">{item.title}</p>
                                                    </div>
                                                </div>
                                                <div class="p-0 lg:p-6  mb-12 bg-white flex items-center space-x-6 rounded-lg">
                                                    <div class="h-15 w-10 lg:h-20 lg:w-20 p-3 lg:px-0 text-3xl lg:text-6xl inline-block align-middle py-1 text-gray-700 font-semibold">A.
                                                        {/* <img src={Q}></img> */}
                                                    </div>
                                                    <div class="w-full">
                                                        <p class="py-4 text-base lg:text-2xl text-gray-700 flex text-left">{item.content}</p>
                                                    </div>
                                                </div>
                                                {/* <Accordion>
                                        
                                                <Accordion.Title
                                                    active={activeIndex === index}
                                                    index={index}
                                                    onClick={this.handleClick}
                                                >
                                                    <Icon name='dropdown' />
                                                    {item.title}
                                                </Accordion.Title>
                                                <Accordion.Content active={activeIndex === index}>
                                                    {item.content}
                                                </Accordion.Content>
                                            
                                        


                                        </Accordion> */}
                                            </>)
                                        })}
                                    </div>
                                </Grid.Column>
                            </Grid.Row></Grid>
                        </div>

                        <div id="fourth" class="hidden p-4">
                            <Grid><Grid.Row>
                                {/* <Grid.Column width={ rate } computer={ rate } mobile={ 16 }>
                                        <Button color={ "teal" } variant="secondary" size="lg" disabled >選舉大事紀</Button>
                                    </Grid.Column> */}
                                <Grid.Column width={16} >
                                    <div class="p-4 rounded-md">
                                        <Ref innerRef={this.thingRef}><h1 class="flex justify-center text-3xl lg:text-5xl mb-12">民主大事紀</h1></Ref>
                                        <p class="flex justify-center">這裡是民主大事紀,記錄著台灣民主有關發生的大事件。 </p>
                                        <Image src={time} size='huge' centered />
                                    </div>
                                </Grid.Column>
                            </Grid.Row></Grid>
                        </div>

                    </div>
                </div>
            </>)
        } />)
    }
}





export default Election = {
    routeProps: {
        path: "/election",
        component: Election
    },
    name: "選舉專區"
}
