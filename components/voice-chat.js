import { Component, html, Tag } from "componentforge";
import { WaveFile } from "wavefile/dist/wavefile";

import MediaRecorder from "./Speech/Index.js";
class VoiceChat extends Component {
  mediaRecorder = null;
  audiofile = null;
  download = this.root.querySelector('#download');
  
  constructor() {
    const _props = {
      label: "NA",
      recognizefunc : null
    };
    super(true, _props);
    this.state = {
      message: "ready",
      currentMessage: "type or record something",
      showPlay:false,
      isRecording : false
    }
  
  }

  stop() {
    this.mediaRecorder.stop();
    this.setState({
      message: "recording stopped hit download",
      showPlay: true,
      isRecording: false
    });
  }

  start() {
    this.mediaRecorder.start();
    this.audiofile = null;
    this.setState({
      showPlay: false,
      message: "recording....",
      isRecording: true
    });
  }

  play() {
    const audio = new Audio(this.audiofile);
    audio.play();
  }


  send() {
    this.fireEvent('send' , this.state.currentMessage);
  }

  handleSuccess(stream) {
    this.mediaRecorder = new MediaRecorder(stream);
    let arraybuffer;

    this.mediaRecorder.addEventListener("dataavailable", async (e) => {
      arraybuffer = await e.data.arrayBuffer();

      const wav = new WaveFile(new Uint8Array(arraybuffer));
      wav.toRIFF();
      wav.toBitDepth(16);
      wav.toSampleRate(16000);

      const wavblob = new Blob([wav.toBuffer()], {
        type: "audio/wav",
      });

      
      this.audiofile = URL.createObjectURL(wavblob);
    
      arraybuffer = null;

      this.fireEvent('recored' , this.audiofile);
     
     if(this.props.recognizefunc != null){
      try {
        const text   = await this.props.recognizefunc(this.audiofile)
        this.setState({currentMessage : text})
        this.fireEvent('send' , text)
      } catch (error) {
        this.currentMessage({currentMessage : error})
      }
     }
       textToSpeech(wavblob)

      //            if (e.data.size > 0) recordedChunks.push(e.data)
    });

    this.mediaRecorder.addEventListener("stop", () => {
      this.setState({showPlay : true} , () => {
        console.log(this.state.showPlay )
        this.download = this.root.querySelector('#download');
        this.download.download = 'acetest.wav';
        this.download.href =this.audiofile;
      })

      setTimeout(() => {
        this.download = this.root.querySelector('#download');
        this.download.download = 'acetest.wav';
        this.download.href =this.audiofile;
      }, 1000);
      arraybuffer = null;
      //   download.value.href = URL.createObjectURL(new Blob(recordedChunks));
      //   download.value.download = 'acetest.wav';
      //   emit('onRecordFinish', audiofile.value)
      //   textToSpeech(new Blob(recordedChunks))
    });
  }


  ComponentDidMount() {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then((s) => {
        this.setState({ message: "Audio enabled..." });
        this.handleSuccess(s);
      });
  }

  Template() {
    return html`
      <div class="speech">
        ${this.props.label} <br />
        <textarea
          .value=${this.state.currentMessage}
          @change=${(e) => {
            this.setState({ ...this.state, currentMessage: e.target.value });
          }}
          cols="60"
          rows="5"
        ></textarea>
        <br />
        ${this.state.showPlay ? html`<a id="download">Download</a>` : null  }
        
        <button @click=${() => this.send()} id="send">send</button>
        ${this.state.isRecording ? 
        html`<button @click=${() => this.stop()} id="stop">Stop</button>` :
        html`<button @click=${() => this.start()} id="start">Start</button>`
        }

        ${this.state.showPlay ? html`<button @click=${() => this.play()}>Play</button>` : ``}
        <br />
        ${this.state.message}
      </div>
    `;
  }

  Style() {
    return html`<style>
    .speech {
      border: 1px ${this.state.isRecording ? 'red' : 'black'} ${this.state.isRecording ? 'dashed' : 'solid'};
      padding: 10px;
    }
    
    
    </style>`;
  }
}

Tag("voice-chat", VoiceChat);

export default VoiceChat;
