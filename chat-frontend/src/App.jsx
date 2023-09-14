import { Fragment, useState } from 'react'
import './App.css'

// components
import Login from "./components/Login";
import Logout from "./components/Logout";
import MessageWindow from './components/MessageWindow';
import TextBar from './components/TextBar';
import useToken from './useToken';
import { registerOnMessageCallback, send } from './websocket'

function App() {
  const { token, setToken } = useToken();

  const [userName, setUserName] = useState('');

  const [messages, setMessages] = useState([]);


  const sendMessage = (text) => {

    const message = {
      username: userName,
      text: text
    }
    send(JSON.stringify(message))
  }

  const onMessageReceived = (msg) => {
    msg = JSON.parse(msg)
    setMessages(messages.concat(msg))
  }

  if (!token) {
    return (
      <Fragment>
        <Login setToken={setToken} setUserName={setUserName} />
      </Fragment>
    )
  }
  registerOnMessageCallback(onMessageReceived)
  return (
    <Fragment >
      <div className="container">
        <Logout />
        <div className='container-title'>Messages</div>
        <MessageWindow messages={messages} username={userName} />
        <TextBar onSend={sendMessage} />
      </div>
    </Fragment >
  );
}

export default App
