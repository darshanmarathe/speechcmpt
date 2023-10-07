// import { Component, html, Tag } from "componentforge";
import {
  Component,
  html,
  Tag,
} from "https://cdn.jsdelivr.net/npm/componentforge";
import { WaveFile } from "wavefile/dist/wavefile";

import MediaRecorder from "./Speech/Index.js";
import Siri from "./Siri.js";
export default class VoiceChat extends Component {
  mediaRecorder = null;
  audiofile = null;
  download = this.root.querySelector("#download");
  siriWave = null;
  constructor() {
    const _props = {
      label: "NA",
      recognizefunc: null,
      token: "abcd",
    };
    super(false, _props);
    this.state = {
      message: "ready",
      currentMessage: "type or record something",
      showPlay: false,
      isRecording: false,
    };
  }

  stop() {
    this.mediaRecorder.stop();
    this.setState({
      message: "recording stopped hit download",
      showPlay: true,
      isRecording: false,
    });
  }

  textToSpeech(file) {
    var myHeaders = new Headers();
    myHeaders.append("FID-LOG-TRACKING-ID", "IAM_WAS_HERE");
    myHeaders.append("VX-SB-APPID", "AP139709");
    myHeaders.append("BIT", "16");
    myHeaders.append("Authorization", "Bearer " + this.props.token);
    myHeaders.append(
      "Cookie",
      "MC=9bKZDfxJ_sJq_DWfHxGe1VFUJEcSAmRj6PP5qnMpgeRo39viqjMGBAAAAQAGBWRj6PMAQ03"
    );

    var formdata = new FormData();
    formdata.append("audiofile", file, "Audio1.wav");

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };
    this.setState({ message: "parsing" });
    fetch(
      "https://simplibyt-xq1-aws.fmr.com/v1/simplibytes/stt/instant",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        this.setState({
          currentMessage: result.text,
          message: "",
        });
      })
      .catch((error) => console.log("error", error));
  }

  start() {
    this.mediaRecorder.start();
    this.audiofile = null;
    this.setState({
      showPlay: false,
      message: "recording....",
      isRecording: true,
    });

  }

  play() {
    const audio = new Audio(this.audiofile);
    audio.play();
  }

  send() {
    this.fireEvent("send", "value", this.state.currentMessage);
    this.setState({ currentMessage: "", showPlay: true, isRecording: false });
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

      this.fireEvent("recored", this.audiofile);

      //  if(this.props.recognizefunc != null){
      //   try {
      //     const text   = await this.props.recognizefunc(this.audiofile)
      //     this.setState({currentMessage : text})
      //     this.fireEvent('send' , text)
      //   } catch (error) {
      //     this.currentMessage({currentMessage : error})
      //   }
      //  }
      this.textToSpeech(wavblob);

      //            if (e.data.size > 0) recordedChunks.push(e.data)
    });

    this.mediaRecorder.addEventListener("stop", () => {
      this.setState({ showPlay: true }, () => {
        console.log(this.state.showPlay);
        this.download = this.root.querySelector("#download");
        this.download.download = "acetest.wav";
        this.download.href = this.audiofile;
      });

      setTimeout(() => {
        this.download = this.root.querySelector("#download");
        this.download.download = "acetest.wav";
        this.download.href = this.audiofile;
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

        ${this.state.isRecording
          ? html`<siri-wave width="300px"></siri-wave>`
          : html`
              <textarea
                .value=${this.state.currentMessage}
                @change=${(e) => {
                  this.setState({
                    ...this.state,
                    currentMessage: e.target.value,
                  });
                }}
                cols="60"
                rows="5"
              ></textarea>
            `}
        <br />
        ${this.state.showPlay ? html`<a id="download">Download</a>` : null}

        <button @click=${() => this.send()} id="send">send</button>
        ${this.state.isRecording
          ? html`<button @click=${() => this.stop()} id="stop">Stop</button>`
          : html`<button @click=${() => this.start()} id="start">
              Start
            </button>`}
        ${this.state.showPlay
          ? html`<button @click=${() => this.play()}>Play</button>`
          : ``}
        <br />
        ${this.state.message}
      </div>
    `;
  }

  Style() {
    return html`<style>
      .speech {
        text-align:'left';
        border: 1px ${this.state.isRecording ? "red" : "black"}
          ${this.state.isRecording ? "dashed" : "solid"};
        padding: 10px;
        
      }

      siri-wave {
        width: 600px;
        height: 300px;
        background-size: cover;
        margin: 20px;
        margin: 0 auto;
        border: 1px dashed rgba(255, 255, 255, 0.4);
      }
    </style>`;
  }
}

Tag("voice-chat", VoiceChat);

