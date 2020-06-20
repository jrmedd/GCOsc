import React from "react"
import io from 'socket.io-client';
import Gamepad from "react-gamepad"
import { ControllerSVG } from "./ControllerSVG";
import styled, { css } from "styled-components";
import './App.css'

const socket = io('http://localhost:3011');

const tone = 2;
const semitone = 1;

const diatonicScale = [tone, tone, semitone, tone, tone, tone, semitone];

const midiNotes = {
  'A': 21,
  'A#': 22,
  'B': 23,
  'C': 24,
  'C#': 25,
  'D' : 26,
  'D#': 27,
  'E': 28,
  'F': 29,
  'F#': 30,
  'G': 31,
  'G#': 32
}

const notes = Object.keys(midiNotes).sort();

const modes = ['ionian', 'dorian', 'phrygian', 'lydian', 'mixolyidan', 'aeolian', 'lochrian'];

let buttons = ["A", "B", "X", "Y", "DPadLeft", "DPadUp", "DPadRight", "DPadDown", "Start", "Back"];

const setScale = (key, octave, mode, buttonsAssignment) => {
  let scaleOctave = octave;
  let scaleIndex = notes.indexOf(key);
  const scale = {};
  for (let i = 0; i < 8; i++) {
    scaleOctave = octave + Math.floor((scaleIndex) / 12);
    let note = notes[scaleIndex % 12];
    scale[buttonsAssignment[i]] = [midiNotes[note] + (scaleOctave * 12), `${note}${scaleOctave}`];
    scaleIndex += diatonicScale[(i + modes.indexOf(mode)) % 7];
  }
  return scale;
}

const Main = styled.main((props)=>css`
  display: flex;
  width: 100%;
  height: 100vh;
  justify-content: center;
  align-items: center;
  background: #272822;
`)

const App = () => {
  const [pressed, setPressed] = React.useState([])
  const [axes, setAxes] = React.useState({'LeftStickX':1,'LeftStickY':1,'RightStickX':1,'RightStickY':1})
  const [octave, setOctave] = React.useState(3);
  const [key, setKey] = React.useState('C#');
  const [mode, setMode] = React.useState('ionian');
  const [noteAssignments, setNoteAssignments] = React.useState(setScale(key, octave, mode, buttons));
  const handleConnect = e => socket.emit('controller-connection', { 
    'controllerConnected': true 
  });
  const handleDisconnect = e => socket.emit('controller-connection', {
    'controllerConnected': false
  });
  const handleButton = (button, change) => {
    setPressed(change ? [...pressed, button] : pressed.filter(v=> v!=button));
    socket.emit('button', { 'button': noteAssignments[button] ? noteAssignments[button][0] : null || button, 'pressed': change ? 1 : 0 })
  };
  const handleAxis = (axis, value, lastValue) => {
    const axisUpdate = {};
    axisUpdate[axis] = value;
    setAxes({...axes, ...axisUpdate})
    socket.emit('axis', { 'axis': axis, 'value': value })
  }
  return (
    <Main>
      <Gamepad
        onConnect={handleConnect}
        onButtonChange={handleButton}
        onAxisChange={handleAxis}
      >
        <></>
      </Gamepad>
      <ControllerSVG 
        width="50%"
        axes={axes} 
        assignments={noteAssignments} 
        pressed={pressed} />
    </Main>
  )
}

export default App;