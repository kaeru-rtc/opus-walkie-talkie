import Graphs from '../components/graphs'
import { setPCM, setFFT }  from '../store/appStore'
import { connect } from 'react-redux'

import AudioSource from '../libs/audio-source'


function mapStateToProps ( state ) {
  const { pcm, fft } = state
  return { 
    pcm, fft
  }
}

function mapDispatchToProps ( dispatch ) {
  return {
    startAudioSource: () => {
      const source = new AudioSource({
        fft_size: 2048
      })
      source.start( ({ pcmArray, fftArray }) => {
        dispatch( setPCM( pcmArray ))
        dispatch( setFFT( fftArray ))
      })
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Graphs)