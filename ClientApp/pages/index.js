import React from "react"
import io from 'socket.io-client';
import Gamepad from "react-gamepad"

const socket = io('http://localhost:3011');


const App = () => {
    const handleConnect = e => socket.emit('controller-connection', {'controllerConnected': true});
    const handleDisconnect = e => socket.emit('controller-conneciton', {'controllerConnected': false})
    const handleButton = (button, change) => {
        socket.emit('button', {'button': button, 'pressed' : change ? 1 : 0})
    };
    const handleAxis = (axis, value, lastValue) => {
        socket.emit('axis', {'axis': axis, 'value': value})
    }
    const testSend = () => socket.emit('test', {
        'data': "test",
        'value': "test"
    })
    return (
        <div>
            <Gamepad 
            onConnect={handleConnect}
            onButtonChange={handleButton} 
            onAxisChange={handleAxis}
            >
                <></>
            </Gamepad>
            <button onClick={testSend}>Test send</button>
        </div>
    )
}

export default App;