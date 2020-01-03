/* util.js */

import CircularBuffer from 'circular-buffer'
import { EventEmitter } from 'events'
import TempQuerue from './temp-queue'

/**
 * convert array
 * 
 * @param {Int16Array} arr 
 * @return {Float32Array}
 */
export const convertI16toF32 = i16arr => {
  const f32arr = new Float32Array(i16arr.length)

  for( let i = 0; i < i16arr.length; i++ ) {
    f32arr[i] = parseFloat( i16arr[i] / 32767 )
  }
  return f32arr
}

/**
 * convert array
 * 
 * @param {Float32Array} f32arr 
 * @return {Int16Array}
 */
export const convertF32toI16 = f32arr => {
  const i16arr = new Int16Array(f32arr.length)

  for( let i = 0; i < i16arr.length; i++ ) {
    // todo - use bit calc for high performance
    i16arr[i] = parseInt(f32arr[i] * 32767)
  }
  return i16arr
}

/**
 * music player
 */
export class Player {
  constructor(props) {
    this.props = Object.assign({}, {
      sampleRate: 48000,
      oscillatorFreq: 2048,
      gain: 0.1
    }, props)

    this.pos = 0

    this.ctx = new ( window.AudioContext || window.webkitAudioContext )({
      sampleRate: this.props.sampleRate
    })

    this.oscillator = this.ctx.createOscillator();

    this.oscillator.frequency.value = this.props.oscillatorFreq;

    this.gainNode = this.ctx.createGain()
    this.gainNode.gain.value = this.props.gain

    this.scriptNode = this.ctx.createScriptProcessor(4096, 2, 2)

    this.setScriptHandler()

    this.output = null

    this.buffer = new CircularBuffer(50)
  }

  setScriptHandler() {
    this.scriptNode.onaudioprocess = ev => {
      const input = ev.inputBuffer.getChannelData(0)

      for( let i = 0; i < input.length; i++ ) {
        ev.outputBuffer.getChannelData(0)[i] = input[i]
        ev.outputBuffer.getChannelData(1)[i] = input[i]
      }

      if( this.buffer.size() > 0 ) {
        //const output = this.buffer.get(this.pos)
        const output = this.buffer.get( this.pos )
        for( let i = 0; i < input.length; i++ ) {
          ev.outputBuffer.getChannelData(0)[i] = output[i]
          ev.outputBuffer.getChannelData(1)[i] = output[i]
        }

        this.pos = this.pos++ % this.buffer.size()
      }
    }
  }

  set( output ) {
    this.buffer.enq(output)
  }

  start(){
    this.oscillator.connect(this.gainNode);
    this.gainNode.connect(this.scriptNode);
    this.scriptNode.connect(this.ctx.destination);
    this.oscillator.start();
  }
}

/**
 * encode pcm to opus
 * 
 * @param {Float32Array} pcm 
 * @return {Int8Array}
 */
export class PcmToOpus extends EventEmitter {
  constructor( props ) {
    super( props )

    // ref - https://github.com/ImagicTheCat/libopusjs/blob/master/README.adoc
    this.props = Object.assign( {}, {
      channels: 1,
      sampleRate: 48000,
      bitrate: 24000,
      frameSize: 20,
      voiceOptimization: false
      // voiceOptimization: true
    }, props)

    this.enc = new libopus.Encoder(
      this.props.channels,
      this.props.sampleRate,
      this.props.bitrate,
      this.props.frameSize,
      this.props.voiceOptimization
    )
  }

  encode(pcm) {
    const i16arr = convertF32toI16( pcm ) // convert f32 to i16 for encoder
    this.enc.input( i16arr )

    // get opus frame data as Array
    const frames = []
    let encoded
    while( encoded = this.enc.output() ) {
      // Since `encoded` include chunked opus frame data only
      // to get entire data, you need to use `while loop`
      frames.push( encoded )
    }

    // this.enc.destroy() // terminate encoder
    return frames
  }
}

/**
 * decode opus to pcm
 * 
 * @param {Int8Arrray} opus 
 * @return {Float32Array}
 */
export class OpusToPcm extends EventEmitter {
  // const dec = new libopus.Decoder(1, 48000)
  constructor( props ) {
    super( props )

    // ref - https://github.com/ImagicTheCat/libopusjs/blob/master/README.adoc
    this.props = Object.assign( {}, {
      channels: 1,
      sampleRate: 48000,
    }, props)

    this.dec = new libopus.Decoder(
      this.props.channels,
      this.props.sampleRate,
    )

    this.queue = new TempQuerue({size: 4096})
  }

  decode(frames, callback) {
    for( let i = 0; i < frames.length; i++ ) {
      const frame = frames[i]
      this.dec.input( frame )

      let decoded
      while( decoded = this.dec.output() ) {
        //this.queue.add( decoded, callback )
        callback( decoded )
      }
    }
  }
}