import React from "react"
import io from 'socket.io-client';
import Gamepad from "react-gamepad"
import { ControllerSVG } from "./ControllerSVG";
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

const App = () => {
  const [pressed, setPressed] = React.useState(false)
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
    setPressed(change);
    socket.emit('button', { 'button': noteAssignments[button][0] || button, 'pressed': change ? 1 : 0 })
  };
  const handleAxis = (axis, value, lastValue) => {
    socket.emit('axis', { 'axis': axis, 'value': value })
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
      <ControllerSVG assignments={noteAssignments} width="50%" pressed={pressed} />
    </div>
  )
}

export default App;