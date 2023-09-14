import React, { Component } from 'react'
import { Textarea, Button } from 'flowbite-react';
import './TextBar.css'

const TextBar = (props) => {
    let input = React.createRef()

    const sendMessage = () => {
        props.onSend && props.onSend(input.current.value)
        input.current.value = ''
    }
    const sendMessageIfEnter = (e) => {
        if (e.keyCode === 13) {
            sendMessage()
        }
    }

    return (
        <div className='grid grid-cols-3 gap-1'>
            <div className="col-span-2">
                <Textarea ref={input} onKeyDown={sendMessageIfEnter} />
            </div>
            <div>
                <Button onClick={sendMessage} outline>
                    Enviar
                </Button>
            </div>

        </div>
    )
}
export default TextBar