import {
  Component,
  html,
  Tag,
} from "https://cdn.jsdelivr.net/npm/componentforge@1.1.33";

//import SiriWave from "siriwave"; /// "siriwave": "^2.3.0",
import SiriWave from "https://unpkg.com/siriwave/dist/siriwave.esm.min.js";



const BUFFER_SIZE = 1024;
const MAX_READING = 80; // How loud of audio till we consider it max
const ZERO = 127;
const UPDATE_INTERVAL = 50; // How often in ms do we update
const MAX_AMPLITUDE = 4; // The max amplitude of the waveform
const RECORD_SPEED = 0.3; // The speed of the waveform when recording
const STANDBY_AMPLITUDE = 0.5; // The amplitude of the waveform when in standby
const STANDBY_SPEED = 0.001; // The speed of the waveform on standby

const COLOR_ONE = "86, 130, 0";
const COLOR_TWO = "121,181,0";
const COLOR_THREE = "86, 130, 0";
const SUPPORT_LINE_COLOR = "121,181,0";

const ELEMENT_ID = "siriwave";

export default class SiriWaveForm extends Component {
  constructor() {
    const _props = {
      height: 50,
      show: true,
    };
    super(true, _props);
  }
  
  ComponentDidMount(){
    
    
    setTimeout(() => {
      this.InitSiriWare();
    }, 100);
    
  }
  InitSiriWare() {
    debugger;
    this.siriWave = new SiriWave({
      container: this.root.getElementById(ELEMENT_ID),
      height: this.props.height,
      style: "ios9",
      speed: RECORD_SPEED,
      color: "#000000",
      pixelDepth: 0.4,
      curveDefinition: [
        {
          color: SUPPORT_LINE_COLOR,
          supportLine: true,
        },
        {
          color: COLOR_ONE,
        },
        {
          color: COLOR_TWO,
        },
        {
          color: COLOR_THREE,
        },
      ],
    });
  }

  Template() {
    return html`
      <div id="siriwave" height="${this.props.height}" class="wave"></div>
    `;
  }

  Style() {
    return html`
      <style>
        #siriwave {
          width: ${this.props.width + "px"};
          height: ${this.props.height + "px"};
          background-size: cover;
          margin: 20px;
          margin: 0 auto;
          background-color: white;
          border: 1px dashed rgba(255, 255, 255, 0.4);
        }

        #siriwave canvas {
          float: left;
        }
      </style>
    `;
  }
}

Tag("fid-wave", SiriWaveForm);
