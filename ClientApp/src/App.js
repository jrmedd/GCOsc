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
  const [connected, setConnected] = React.useState(false)
  const [pressed, setPressed] = React.useState([])
  const [axes, setAxes] = React.useState({'LeftStickX':0,'LeftStickY':0,'RightStickX':0,'RightStickY':0})
  const [octave, setOctave] = React.useState(3);
  const [key, setKey] = React.useState('C');
  const [mode, setMode] = React.useState('ionian');
  const [noteAssignments, setNoteAssignments] = React.useState(setScale(key, octave, mode, buttons));

  const handleButton = (button, change) => {
    setPressed(change ? [...pressed, button] : pressed.filter(v=> v!=button));
    socket.emit('button', { 'button': noteAssignments[button] ? noteAssignments[button][0] : null || button, 'pressed': change ? 1 : 0 });
    const modeIndex = modes.indexOf(mode);
    const keyIndex = notes.indexOf(key);
    if (button == "RB" && change) {
      if (pressed.includes("Start")){
        setMode(modes[(modeIndex+1) % modes.length]);
      }
      else if (pressed.includes("Back")) {
        setKey(notes[(keyIndex + 1) % notes.length]);
      }
      else {
        setOctave((octave + 1) % 9);
      }
    }
    else if (button =="LB" && change) {
      if (pressed.includes("Start")) {
        setMode(modeIndex == 0 ? modes[modes.length - 1] : modes[modeIndex - 1]);
      }
      else if (pressed.includes("Back")) {
        setKey(keyIndex == 0 ? notes[notes.length - 1] : notes[keyIndex - 1]);
      }
      else {
        setOctave(octave == 0 ? 8 : octave - 1);
      }
    }
  };
  const handleAxis = (axis, value, lastValue) => {
    const axisUpdate = {};
    axisUpdate[axis] = value;
    setAxes({...axes, ...axisUpdate})
    socket.emit('axis', { 'axis': axis, 'value': value })
  }
  React.useEffect(()=> {
    setNoteAssignments(setScale(key, octave, mode, buttons));
  }, [key, octave, mode])
  return (
    <Main>
      <Gamepad
        onConnect={() => setConnected(true)}
        onDisconnect={()=>setConnected(false)}
        onButtonChange={handleButton}
        onAxisChange={handleAxis}
      >
        <></>
      </Gamepad>
      <ControllerSVG 
        width="50%"
        connected={connected}
        axes={axes} 
        assignments={noteAssignments} 
        pressed={pressed} 
        mode={mode}
        />
    </Main>
  )
}

export default App;