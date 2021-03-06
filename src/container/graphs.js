import Graphs from '../components/graphs'
import { 
  setPCM, 
  setPcmBeforeOpus,
  setFFT,
  setOutPCM,
  setOutFFT,
  setPCMSize,
  setOpusSize,
  setBufferSize,
  d_setOpusFrame,
  d_setPcmFrame,
}  from '../store/appStore'
import { connect } from 'react-redux'
import AudioSource from '../libs/audio-source'
import AudioDestination from '../libs/audio-destination'

import {
  PcmToOpus, 
  OpusToPcm,
  convertI16toF32
} from '../libs/util'

import TempQueue from '../libs/temp-queue'

const encoder = new PcmToOpus()
const decoder = new OpusToPcm()
const outputQueue = new TempQueue({ size: 4096 })
const destination = new AudioDestination()



function mapStateToProps ( state ) {
  const { 
    pcm, 
    fft, 
    pcmBeforeOpus, 
    outPCM, 
    outFFT,
    pcmSize,
    opusSize,
    bufferSize,
    d_opusframe,
    d_pcmframe
  } = state
  return { 
    pcm, fft, pcmBeforeOpus, outPCM, outFFT, pcmSize, opusSize, bufferSize,
    d_opusframe, d_pcmframe
  }
}

function mapDispatchToProps ( dispatch ) {
  return {
    startAudioSource: () => {
      // callback for analyzer node
      const source = new AudioSource({
        fft_size: 2048,
        type: 'sine',
        gain: 1
      })
      source.start( 
        ({ pcmArray, fftArray }) => {
          dispatch( setPCM( pcmArray ))
          dispatch( setFFT( fftArray ))
        }, pcmBeforeOpus => {
          // Float32Arrray pcm
          const pcmsize = pcmBeforeOpus.byteLength
          // callback for opus encode
          // dispatch( setPcmBeforeOpus( pcmBeforeOpus ))
          const opusFrames = encoder.encode( pcmBeforeOpus )
          const opussize = opusFrames.reduce((prev, curr) => {
            // curr ; Int8Array opus frame
            return prev + curr.length
          }, 0)

          dispatch( setPCMSize( pcmsize) )
          dispatch( setOpusSize( opussize) )

          decoder.decode( opusFrames, decoded => {
            // every single opus frame will call callback 
            // 960 bytes of Int16Array, 50 times (in case 48kHz sampling)

            // debug.
            // dispatch( d_setOpusFrame( decoded ))

            const f32arr = convertI16toF32( decoded )
            outputQueue.add(f32arr, arr => {
              // arr : 4096 bytes of Float32Array
              destination.enq( arr )
            })
          })
        }
      )

      destination.start( ({pcmArray, fftArray} ) => {
        dispatch( setOutPCM( pcmArray ) )
        dispatch( setOutFFT( fftArray ) )
      })

      destination.on('buffer:size', size => {
        dispatch( setBufferSize( size ))
      })
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Graphs)