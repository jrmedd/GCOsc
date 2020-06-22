import React from 'react'
import styled, {css} from "styled-components"

const ControllerBody = styled.path((props)=>css`
    stroke-dasharray: 4410;
    stroke-dashoffset: ${props.visible ? 0 : 4410};
    stroke-width: 4;
    transition: stroke-dashoffset 2s ease;
`)

const ControllerBevel = styled.circle((props) => css`
    stroke-dasharray: 740;
    stroke-dashoffset: ${props.visible ? 0 : 740};
    stroke-width: 4;
    transition: stroke-dashoffset 2s ease;
`)

const ControllerOctagon = styled.path((props) => css`
    stroke-dasharray: 512;
    stroke-dashoffset: ${props.visible ? 0 : 512};
    stroke-width: 4;
    transition: stroke-dashoffset 2s ease;
`)
const NoteWrapper = styled.foreignObject((props)=>css`
    opacity: ${ props.visible ? 1 : 0};
    transition: opacity 1s ease;
`)

const NoteText = styled.span((props)=>css`
    text-align:${props.alignment || "center"};
    color: ${props.pressed ? "#272822" : "#F8F8F2"};
    display:block;
    width:100%;
    font-size: 1.5rem;
    font-family: 'Coda';
    transition: color .25s ease;
`)

const Analog = styled.circle((props)=>css`
    fill: ${!props.moving ? props.fill || '#F8F8F2':'rgba(0,0,0,0)'};
    stroke: ${props.stroke || "#F8F8F2"};
    stroke-width: 4;
    opacity: ${ props.visible ? 0.5 : 0};
    transition: fill .25s ease, opacity 1s ease;
`)

const RoundButton = styled.circle((props) => css `
    fill: ${props.pressed ? (props.fill || "#F8F8F2"):'rgba(0,0,0,0)'};
    stroke: ${props.stroke || "#F8F8F2"};
    stroke-width: 4;
    opacity: ${ props.visible ? 0.5 : 0};
    transition: fill .3s ease, opacity 1s ease;
`)

const ShapeButton = styled.path((props) => css`
    fill: ${props.pressed ? (props.fill || "#F8F8F2") : 'rgba(0,0,0,0)'};
    stroke: ${props.stroke || "#F8F8F2"};
    stroke-width: 4;
    stroke-linejoin: round;
    opacity: ${ props.visible ? 0.5 : 0};
    transition: fill .3s ease, opacity 1s ease;
`)

const NoteDisplay = (props) => {
    return (
        <NoteWrapper onTransitionEnd={props.onTransitionEnd} visible={props.visible} transform={`translate(${props.x} ${props.y}) rotate(${props.rotate || 0})`}  width={props.width} height={props.height || 40}>
            <NoteText pressed={props.pressed} rotate={props.rotate} alignment={props.alignment}>{props.children}</NoteText>
        </NoteWrapper>
    )
}

export const ControllerSVG = (props) => {
    const [controllerVisible, setControllerVisible] = React.useState(false);
    const [buttonsVisible, setButtonsVisible] = React.useState(false)
    const [notesVisible, setNotesVisible] = React.useState(false);
    const handleAnimations = (e) => {
       if (props.connected) {
           if (!controllerVisible) {
            setControllerVisible(true);
           }
           else if (controllerVisible && !buttonsVisible) {
            setButtonsVisible(true);
           }
           else if (buttonsVisible && !notesVisible) {
            setNotesVisible(true);
           }
       }
       else {
           if (notesVisible) {
               setNotesVisible(false)
           }
           else if (!notesVisible && buttonsVisible) {
               setButtonsVisible(false);
           }
           else if (!buttonsVisible && controllerVisible) {
               setControllerVisible(false);
           }
       }
    }
    React.useEffect(()=>{
        handleAnimations();
    }, [props.connected])
    const axes = props.axes;
    const pressed = props.pressed;
    const assignments = props.assignments;
    const fill = "#F8F8F2";
    const empty = "rgba(0,0,0,0);"
    return (
        <svg  width={props.width} height={props.height} viewBox="0 0 998 768" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ControllerBody onTransitionEnd={handleAnimations} visible={controllerVisible} id="controller-body" opacity="0.5" d="M754.702 40.1251C754.841 40.1705 754.984 40.2006 755.129 40.2148C755.991 40.299 756.876 40.3901 757.785 40.4884C758.088 40.5211 758.394 40.4843 758.68 40.3807C769.528 36.4572 784.663 36.7952 801.484 40.1174C818.241 43.427 836.4 49.6431 853.128 57.1884C869.862 64.7363 885.076 73.5748 895.967 82.0842C901.418 86.3425 905.721 90.4683 908.592 94.2559C911.501 98.0924 912.741 101.315 912.58 103.834C912.532 104.577 912.41 105.336 912.263 106.2L912.236 106.361C912.101 107.152 911.95 108.038 911.874 108.936C911.854 109.165 911.833 109.392 911.809 109.616C911.74 110.269 911.996 110.914 912.493 111.342C948.932 142.704 972 189.157 972 241C972 241.179 972 241.357 971.999 241.535V241.55L972 241.748L972 242C972 243.789 971.961 245.574 971.884 247.354L971.884 247.367C971.786 250.03 971.628 252.678 971.41 255.309C971.391 255.537 971.411 255.766 971.47 255.987C988.065 318.453 996 420.032 996 497.398C996 571.385 991.745 643.91 978.13 695.013C971.315 720.591 962.223 740.53 950.375 752.642C944.478 758.67 937.928 762.73 930.648 764.621C923.37 766.511 915.226 766.27 906.083 763.485C906.021 763.466 905.959 763.45 905.895 763.437C895.426 761.326 886.591 754.913 878.905 744.688C871.2 734.437 864.729 720.45 859.021 703.43C847.601 669.377 839.412 623.737 830.292 572.878L830.288 572.858C824.049 538.065 817.38 500.879 808.951 463.458C807.693 457.872 806.745 452.152 806.085 446.331C805.606 442.099 802.854 438.941 799.548 437.872C797.886 437.335 796.056 437.323 794.356 438.03C792.641 438.744 791.215 440.123 790.263 442.086C789.241 444.194 788.352 446.388 787.609 448.668C785.876 453.993 785.097 459.526 784.739 464.981C780.632 527.534 728.592 577 665 577C598.726 577 545 523.274 545 457C545 421.937 560.036 390.388 584.018 368.445C596.436 357.082 608.012 341.213 616.605 323.861C619.414 318.189 615.998 311.596 609.917 310.303C575.39 302.96 538.631 299 500.5 299C461.351 299 423.647 303.174 388.322 310.898C382.253 312.225 378.875 318.828 381.704 324.483C390.265 341.591 401.712 357.217 413.982 368.444C437.964 390.388 453 421.937 453 457C453 523.274 399.274 577 333 577C269.408 577 217.368 527.534 213.261 464.981C212.903 459.526 212.124 453.993 210.391 448.668C209.648 446.389 208.759 444.194 207.737 442.086C206.785 440.123 205.359 438.744 203.644 438.031C201.944 437.323 200.114 437.335 198.452 437.873C195.146 438.941 192.394 442.099 191.915 446.332C191.255 452.152 190.307 457.872 189.049 463.458C180.619 500.88 173.951 538.068 167.711 572.862L167.708 572.878C158.588 623.737 150.399 669.377 138.979 703.43C133.271 720.45 126.8 734.437 119.095 744.688C111.409 754.913 102.574 761.326 92.1046 763.437C92.0414 763.45 91.9789 763.466 91.9172 763.485C82.7739 766.27 74.6298 766.511 67.3515 764.621C60.0716 762.73 53.522 758.67 47.625 752.642C35.7773 740.53 26.6849 720.591 19.8701 695.013C6.25467 643.91 2 571.385 2 497.398C2 420.032 9.93509 318.453 26.5298 255.987C26.5886 255.766 26.6089 255.537 26.59 255.309C26.3721 252.678 26.2138 250.03 26.1164 247.367L26.1158 247.354C26.0387 245.574 26 243.789 26 242C26 241.85 26.0003 241.7 26.0009 241.549L26.0008 241.536C26.0003 241.357 26 241.179 26 241C26 172.489 66.2901 113.385 124.478 86.095C124.921 85.8871 125.273 85.5238 125.466 85.0739C130.569 73.1989 143.226 59.4556 160.368 50.8266C177.449 42.2285 198.827 38.785 221.401 47.2231C221.848 47.3903 222.34 47.392 222.789 47.2278C300.498 18.7758 395.882 2 499 2C593.215 2 680.977 16.0041 754.702 40.1251Z" stroke="#F8F8F2" stroke-width="4" stroke-linejoin="round"/>
        <ControllerBevel visible={controllerVisible} id="left-analog-bevel" opacity="0.5" cx="195.5" cy="232.5" r="117.5" stroke="#F8F8F2" stroke-width="4" stroke-linejoin="round"/>
        <ControllerOctagon visible={controllerVisible} id="left-analog-octagon" opacity="0.5" d="M199.572 150.848C200.806 150.446 202.148 150.54 203.314 151.109L257.796 177.72C258.987 178.302 259.899 179.333 260.33 180.587L279.649 236.774C280.09 238.056 279.991 239.461 279.377 240.668L252.426 293.62C251.824 294.802 250.778 295.696 249.518 296.106L191.863 314.876C190.629 315.278 189.287 315.184 188.12 314.614L133.639 288.003C132.448 287.421 131.536 286.39 131.105 285.136L111.786 228.949C111.345 227.668 111.443 226.263 112.058 225.055L139.009 172.104C139.61 170.922 140.657 170.028 141.917 169.617L199.572 150.848Z" stroke="#F8F8F2" stroke-width="4" stroke-linejoin="round"/>
        <Analog visible={buttonsVisible} moving={axes.LeftStickX == 0 && axes.LeftStickY == 0} id="left-analog" opacity="0.5" cx={196+(20*axes.LeftStickX)} cy={233-(20*axes.LeftStickY)} r="58" />
        <ControllerOctagon visible={controllerVisible} id="right-analog-octagon" opacity="0.5" d="M660.588 375.446C661.792 374.959 663.137 374.959 664.34 375.446L717.059 396.781C718.289 397.279 719.27 398.244 719.787 399.465L741.535 450.762C742.064 452.009 742.064 453.418 741.535 454.665L719.787 505.963C719.27 507.184 718.289 508.149 717.059 508.646L664.34 529.981C663.137 530.468 661.792 530.468 660.588 529.981L607.869 508.646C606.64 508.149 605.659 507.184 605.141 505.963L583.393 454.665C582.864 453.418 582.864 452.009 583.393 450.762L605.141 399.465C605.659 398.244 606.64 397.279 607.869 396.781L660.588 375.446Z" stroke="#F8F8F2" stroke-width="4" stroke-linejoin="round"/>
        <Analog visible={buttonsVisible} moving={axes.RightStickX == 0 && axes.RightStickY == 0} id="right-analog" opacity="0.5" cx={662 + (30 * axes.RightStickX)} cy={453 - (30 * axes.RightStickY)} r="42" fill="#D6CD5B" stroke="#D6CD5B" />
        <ShapeButton onTransitionEnd={handleAnimations} visible={buttonsVisible} pressed={pressed.filter(v => v.indexOf('DPad') >= 0).length > 0} id="d-pad" opacity="0.5" d="M313 436C314.105 436 315 435.105 315 434V396C315 392.686 317.686 390 321 390H348C351.314 390 354 392.686 354 396V434C354 435.105 354.895 436 356 436H393C396.314 436 399 438.686 399 442V468C399 471.314 396.314 474 393 474H356C354.895 474 354 474.895 354 476V513C354 516.314 351.314 519 348 519H321C317.686 519 315 516.314 315 513V476C315 474.895 314.105 474 313 474H276C272.686 474 270 471.314 270 468V442C270 438.686 272.686 436 276 436H313Z" stroke="#F8F8F2" stroke-width="4" stroke-linejoin="round" />
        <ShapeButton visible={buttonsVisible} pressed={pressed.indexOf('X') >= 0 } id="x" opacity="0.5" d="M917.915 263.472C912.763 263.365 907.764 261.322 904.056 257.768C900.678 254.53 898.518 251.294 897.136 247.577C895.742 243.829 895.1 239.488 894.905 233.979C894.523 223.174 892.072 212.613 888.358 202.554C883.098 188.311 883.264 178.163 886.357 171.792C889.373 165.58 895.416 162.482 903.276 162.787C912.145 163.131 922.229 170.349 930.074 181.612C937.855 192.783 943.075 207.458 942.516 221.852C941.995 235.283 940.954 245.86 937.453 253.024C935.736 256.535 933.461 259.15 930.402 260.886C927.326 262.633 923.293 263.584 917.915 263.472Z" />
        <ShapeButton visible={buttonsVisible} pressed={pressed.indexOf('Y') >= 0} id="y" opacity="0.5" d="M824.042 122.97C824.135 128.122 822.288 133.197 818.879 137.04C815.775 140.54 812.625 142.824 808.965 144.349C805.273 145.887 800.961 146.697 795.464 147.105C784.681 147.906 774.223 150.764 764.316 154.866C750.287 160.674 740.141 160.901 733.654 158.057C727.33 155.285 724 149.367 724 141.5C724 132.625 730.822 122.268 741.772 113.993C752.634 105.785 767.095 100 781.5 100C794.941 100 805.55 100.63 812.845 103.852C816.419 105.43 819.121 107.603 820.974 110.592C822.839 113.598 823.946 117.591 824.042 122.97Z" />
        <RoundButton visible={buttonsVisible} pressed={pressed.indexOf('A') >= 0} id="a" opacity="0.5" cx="803" cy="234" r="56" fill="#53C24C"stroke="#53C24C" />
        <RoundButton visible={buttonsVisible} pressed={pressed.indexOf('B') >= 0} id="b" opacity="0.5" cx="691" cy="291" r="34" fill="#FF0021" stroke="#FF0021" />
        <RoundButton visible={buttonsVisible} pressed={pressed.indexOf('Start') >= 0} id="start" opacity="0.5" cx="499.5" cy="246.5" r="19.5" />
        <NoteDisplay onTransitionEnd={handleAnimations} visible={notesVisible} pressed={pressed.indexOf('X') >= 0} rotate={65} x={905} y={150} width={116} height={32}>{assignments.X[1]}</NoteDisplay>
        <NoteDisplay visible={notesVisible} pressed={pressed.indexOf('Y') >= 0} rotate={-10} x={714} y={120} width={116} height={32}>{assignments.Y[1]}</NoteDisplay>
        <NoteDisplay visible={notesVisible} pressed={pressed.indexOf('A') >= 0} x={745} y={220} width={116} height={32}>{assignments.A[1]}</NoteDisplay>
        <NoteDisplay visible={notesVisible} pressed={pressed.indexOf('B') >= 0} x={655}y={276} width={72} height={32}>{assignments.B[1]}</NoteDisplay>
        <NoteDisplay visible={notesVisible} pressed={pressed.indexOf('DPadLeft') >= 0} alignment="right"x={186} y={440} width={80} height={40}>{assignments.DPadLeft[1]}</NoteDisplay>
        <NoteDisplay visible={notesVisible} pressed={pressed.indexOf('DPadUp') >= 0} x={295} y={358} width={80} height={40}>{assignments.DPadUp[1]}</NoteDisplay>
        <NoteDisplay visible={notesVisible} pressed={pressed.indexOf('DPadRight') >= 0} alignment="left" x={403} y={440} width={80} height={40}>{assignments.DPadRight[1]}</NoteDisplay>
        <NoteDisplay visible={notesVisible} pressed={pressed.indexOf('DPadDown') >= 0} x={296} y={518} width={80} height={40}>{assignments.DPadDown[1]}</NoteDisplay>
        </svg>
    )
}