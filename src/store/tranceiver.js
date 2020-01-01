import { observable, computed, action } from 'mobx'
import { EventEmitter } from 'events'
import { tsThisType } from '@babel/types'

/**
 * convert array
 * 
 * @param {Int16Array} arr 
 * @return {Float32Array}
 */
const convertI16toF32 = arr => {
  const ret = new Float32Array(arr.length)
  for( let i = 0; i < ret.length; i++ ) {
    ret[i] = parseFloat( arr[i] / 65535 )
  }
  return ret
}

/**
 * convert array
 * 
 * @param {Float32Array} arr 
 * @return {Int16Array}
 */
const convertF32toI16 = arr => {
  const ret = new Int16Array(arr.length)
  for( let i = 0; i < ret.length; i++ ) {
    ret[i] = parseInt( arr[i] * 65535 )
  }
  return ret
}




// mobx stores
export default class TranceiverStore  {
  @observable stream // local media stream (voice)
  @observable ctx // audio context
  @observable logging = true // handler for pcm logging in `onaudioprocess` of Web Audio API

  @observable originalData = [] // original audio data (Int16Array, maybe)
  @observable outData = [] // opus decoded data (Int16Array, maybe)

  @observable pos = 0 // position of source audio
  @observable ready = false

  @computed get target() {
    const ret = []
    this.originalData.length > 0 ? this.originalData.forEach( ( curr, idx ) => ret.push({
      x: idx, y: curr
    })): []

    return ret
  }


  @action getLocalStream = async _ => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true })
      .catch( err => { throw err })

    this.stream = stream
  }

  @action getPCMStream = async _ => {
    this.ctx = new ( window.AudioContext || window.webkitAudioContext )({
      sampleRate: 48000
    })

    // initialize libopus encoder and decoder
    const enc = new libopus.Encoder(1, 48000, 24000, 20, false)
    const dec = new libopus.Decoder(1, 48000)

    // this will be used when decoded opus data is ready to play.
    const emitter = new EventEmitter()

    // setup dummy white noise data in Int16Array (sampling rate is 48kHz)
    // then, start encoding for it.
    // const samples = new Int16Array(48000);
    const samples = new Float32Array( 48000 )
    const osamples = new Int16Array(48000)

    emitter.on('ready', _ => {
      enc.input( convertF32toI16(samples) )
      let encoded, decoded, p = 0

      while( encoded = enc.output() ) {
        dec.input( encoded )

        while( decoded = dec.output() ) {
          for( let k = 0; k < decoded.length; k++ ) {
            osamples[p++] = decoded[k]
          }
        }
      }
      this.pos = 0
      this.ready = true
    })

    const source = this.ctx.createMediaStreamSource( this.stream )
    const scriptNode = this.ctx.createScriptProcessor(4096, 2, 2)

    let sp = 0
    scriptNode.onaudioprocess = ev => {
      const inputBuffer = ev.inputBuffer
      const outputBuffer = ev.outputBuffer

      const inData = inputBuffer.getChannelData(0) // RAW PCM (Float32 stereo left) - typed arrray
      for( let i = 0; i< inData.length; i++ ) {
        samples[sp++] = inData[i]
        if( sp > 48000) {
          sp = 0
          emitter.emit('ready')
        }
      }
      

      

      if( this.ready ) {
        const _samples = convertI16toF32(osamples) // use Float32Array not Int16Array for playing
        const out = outputBuffer.getChannelData(0)

        for( let i = 0; i < out.length; i++ ) {
          this.pos = ++this.pos % 48000

          outputBuffer.getChannelData(0)[i] = _samples[this.pos] // just debug
          outputBuffer.getChannelData(1)[i] = _samples[this.pos] // just debug
        }
      }
    }

    source.connect( scriptNode )
    scriptNode.connect( this.ctx.destination )
  }
}