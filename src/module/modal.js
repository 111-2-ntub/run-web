import React from "react";
import { Modal, Button, List } from 'semantic-ui-react'
import "tailwindcss/tailwind.css"


function close_icon() {
    return (<>
        <svg class="fill-current bg-gray-200 text-black font-bold rounded p-2" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25">
            <path fill="currentcolor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
        </svg>
    </>)
}

export class ModalBase extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false
        }
    }
    setOpen = (val) => this.setState({ open: val })
    toDo = async () => {
        console.log("enter modalbase todo")
        // let check = this.props.toDo()
        // this.setState({"check":check})
        let d = this.props.toDo().then()
        d.then(res => {
            console.log(res.data.success)
            if (res.data.success) {
                this.setOpen(false)
            }
        })
    }
    render() {

        return (<>
            <Modal
                onClose={ () => this.setOpen(false) }
                onOpen={ () => this.setOpen(true) }
                open={ this.state.open }
                size='small'
                trigger={ this.props.btn != null ? this.props.btn :
                    <Button labelPosition={ this.props.labelPosition } color={ this.props.color } content={ this.props.btnText } /> }
            >
                <Modal.Header>
                    <div className="flex mb-4">
                        <div className="flex-1">{ this.props.message }</div>
                        <div className="justify-end">
                            <button onClick={ () => this.setOpen(false) } class="float-right">
                                { close_icon() }
                            </button>
                        </div>
                    </div>
                </Modal.Header>
                <Modal.Content image>
                    <Modal.Description>
                        { this.props.content }
                    </Modal.Description>
                </Modal.Content>
                { this.state.error ? <>
                    <Modal.Content>
                        <Modal.Description>
                            { this.state.errorText }
                        </Modal.Description>
                    </Modal.Content>
                </> : <></> }
                <Modal.Actions>
                    <Button color='black' onClick={ () => this.setOpen(false) } content={ "取消" } />
                    <Button
                        content="確定"
                        labelPosition='right'
                        icon='checkmark'
                        onClick={ this.toDo }
                        positive
                    />
                </Modal.Actions>
            </Modal>
        </>)
    }

}





export class InfoModal extends React.Component {
    render() {
        return (<>
            <Modal
                onClose={ () => this.props.close }

                open={ this.props.open }
                size={ this.props.size !== undefined ? this.props.size : "mini" }
            // trigger={ this.props.btn != null ? this.props.btn : <Button>{ this.props.btnText }</Button> }
            >
                <Modal.Header>
                    <div class="float-right">
                        { this.props.message }
                    </div>
                </Modal.Header>
                <Modal.Content image>
                    <Modal.Description>
                        <div class="float-right">
                            {/* <Button
                            content={<Icon name='close' />}
                            color={"black"}
                            onClick={this.props.close}
                            /> */}
                            <button onClick={ this.props.close } class="float-right">
                                <svg class="fill-current bg-gray-200 text-black font-bold rounded p-2" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25">
                                    <path fill="currentcolor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                                </svg>
                            </button>
                        </div>
                        { this.props.content }
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        content="關閉視窗"
                        color={ "black" }
                        onClick={ this.props.close }

                    />
                </Modal.Actions></Modal>

        </>)
    }
}

export class ReportModal extends React.Component {
    render() {
        return (<>
            <ModalBase
                message="檢舉"
                btn={ this.props.btn }
                toDo={ this.props.toDo }
                content={ (<>

                    { this.props.rule && this.props.rule.map((item, index) => {
                        return (<div><input type="checkbox" name="report" id={ `reportInput-${item.id}` } />
                            <label for={ `reportInput-${item.id}` }>{ item.context }</label></div>)
                    }) }
                    <p>備註：</p>
                    <textarea
                        id={ "reportInputRemark" }
                        class="resize-x border rounded-md"
                        rows="3"
                        placeholder="請描述檢舉內容"
                    ></textarea>

                </>) } />
        </>)
    }
}


export class ScoreModal extends React.Component {
    render() {
        return (<>
            <Modal
                onClose={ () => this.props.setOpen(false) }
                onOpen={ () => this.props.setOpen(true) }
                open={ this.props.open }
                size='small'
            // trigger={ this.props.btn != null ? this.props.btn : <Button>{ this.props.btnText }</Button> }
            >
                <Modal.Header>
                    <div class="flex mb-4">
                        <div class="flex-1">{ this.props.message }</div>
                        <div class="justify-end">
                            <button className="bg-gray-300 hover:bg-gray-400 rounded" onClick={ () => this.props.setOpen(false) }  >
                                { close_icon() }
                            </button>
                        </div>
                    </div>
                </Modal.Header>
                <Modal.Content >
                    <Modal.Description>
                        { this.props.content }
                    </Modal.Description>
                </Modal.Content>
                { this.props.error ? <>
                    <Modal.Content>
                        <Modal.Description>
                            { this.props.errorText }
                        </Modal.Description>
                    </Modal.Content>
                </> : <></> }
                <Modal.Actions>
                    <Button color='black' onClick={ () => this.props.setOpen(false) } content={ "取消" } />
                    <Button
                        content="確定"
                        labelPosition='right'
                        icon='checkmark'
                        onClick={ this.props.toDo }
                        positive
                    />
                </Modal.Actions>
            </Modal>
        </>)
    }
}

export class MsgModal extends React.Component {
    render() {
        return (<>
            <InfoModal message={ this.props.title }
                close={ this.props.close }
                onClick={ this.props.close }
                open={ this.props.open }
                size={ "small" }
                content={ (<>
                    <List celled>
                        { this.props.data && this.props.data.map(item => {
                            return (<>
                                <List.Item>
                                    <List.Content floated={ "right" }>{ item.time }</List.Content>
                                    { item.content }

                                </List.Item>
                            </>)
                        }) }</List>
                </>) }
            />
        </>)
    }
}