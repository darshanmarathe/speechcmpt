import {
  Component,
  html,
  Tag,
} from "https://cdn.jsdelivr.net/npm/componentforge";

import SiriWave from "https://unpkg.com/siriwave/dist/siriwave.esm.min.js";

export default class Siri extends Component {
  Template() {
    return html` <div id="siri"></div> `;
  }

  constructor() {
    const _props = {
      width: 200,
      height: 100,
    };
    super(true, _props);
  }

  ComponentDidReceiedProps(prop ,newProp , oldProp){
    console.log(prop , newProp , oldProp)
    const elem = this.root.getElementById("siri");
    elem.innerHTML = ''; 
    this.siri  = new SiriWave({
      container: elem,
      autostart: true,
      width: this.props.width,
      height: this.props.height
    });
  }
  ComponentDidMount() {
    setTimeout(() => {
      const elem = this.root.getElementById("siri");
    this.siri  = new SiriWave({
        container: elem,
        autostart: true,
        width: this.props.width,
        height: this.props.height
      });
    }, 100);
  }

  Style() {
    return html`
      <style>
        #siri {
          width: ${this.props.width + "px"};
          height: ${this.props.height + "px"};
          background-size: cover;
          margin: 20px;
          margin: 0 auto;
          background-color: black;
          border: 1px dashed rgba(255, 255, 255, 0.4);
        }

        #siri canvas {
          float: left;
        }
      </style>
    `;
  }
}

Tag("fid-siri-wave", Siri);
