import { observable, computed, action } from 'mobx'

import TempQueue from '../libs/temp-queue'
import { 
  Player,
  PcmToOpus,
  OpusToPcm,
  convertI16toF32
} from '../libs/util'




// mobx stores
export default class TranceiverStore  {
  @observable stream // local media stream (voice)
  @observable ctx // audio context

  @observable sourcePcm
  @observable opusFrames
  // @observable decoded
  @observable decodedFrames = []
  @observable timeDecodeds = []

  @computed get opusData() {
    if( !this.opusFrames ) return null

    const dataLen = this.opusFrames.reduce( (prev, frame) => {
      prev += frame.length
      return prev
    }, 0)

    const ret = new Int16Array( dataLen )
    let idx = 0

    for( let frame of this.opusFrames ) {
      for( let k = 0; k < frame.length; k++ ) {
        ret[idx++] = frame[k]
      }
    }

    return ret
  }


  @action getLocalStream = async _ => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true })
      .catch( err => { throw err })

    this.stream = stream
  }

  @action getPCMStream = async _ => {
    // setup encoder and decoder 
    const pcmToOpus = new PcmToOpus()
    const opusToPcm = new OpusToPcm()

    const player = new Player({
      oscillatorFreq: 1024,
      gain: 1
    })
    player.start()


    const inputQueue = new TempQueue({size: 48000})
    const outputQueue = new TempQueue({size: 4096})

    const onOutputReady = data => {
      // data is 960bytes...
      this.decodedFrames.push( data )
      this.timeDecodeds.push( Date.now() )

      // data is Int16Array, we should convert it to Float32
      const f32arr = convertI16toF32( data )

      outputQueue.add( f32arr, data => {
        player.set( data )
      })
    }

    const onInputReady = data => {
      // part - encode raw pcm to opus then generate frames
      this.sourcePcm = data // MUST be Float32Array (source pcm data)

      // return value is array of Int16Array (opus frames)
      this.opusFrames = pcmToOpus.encode( data )

      // part - decode each opus frames
      // when it gets specified data size of pcm, it will fire
      // 'data:ready', you can see the example below
      opusToPcm.decode( this.opusFrames, onOutputReady )
    }

    ///////////////////////////////////////////////////////
    // PART:: handle local stream as a source
    //
    ///////////////////////////////////////////////////////
    this.ctx = new ( window.AudioContext || window.webkitAudioContext )({
      sampleRate: 48000
    })
    const oscillator = this.ctx.createOscillator()
    oscillator.type = 'square' // for easy debug
    const source = this.ctx.createMediaStreamSource( this.stream )
    const scriptNode = this.ctx.createScriptProcessor(4096, 2, 2)

    scriptNode.onaudioprocess = ev => {
      // RAW PCM float32Array, we only care about channel0 only

      inputQueue.add( ev.inputBuffer.getChannelData(0), onInputReady )
    }

    //source.connect( scriptNode )
    oscillator.connect( scriptNode )
    scriptNode.connect( this.ctx.destination )
    oscillator.start()
  }
}