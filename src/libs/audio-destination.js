import CircularBuffer from 'circular-buffer'

export default class AudioDestination {
  constructor( props ) {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)()
    this.props = Object.assign( {},
      { 
        gain: 1,
        fft_size: 4096,
        // see https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode/type
      }, props)

    this.buffer = new CircularBuffer( 10 )
  }

  /**
   * 
   * @param {function} analyzerCallback 
   * @param {function} pcmCallback 
   */
  start( analyzerCallback ) {
    this.oscillator = this.ctx.createOscillator()

    this.gainNode = this.ctx.createGain()
    this.gainNode.gain.value = this.props.gain

    this.processor = this.ctx.createScriptProcessor(4096, 1, 1)

    this.oscillator.connect( this.gainNode )

    this.analyzer = this.ctx.createAnalyser()
    this.analyzer.fftSize = this.props.fft_size
    this.gainNode.connect( this.processor )
    this.processor.connect( this.analyzer )
    this.analyzer.connect( this.ctx.destination )


    this.oscillator.start()

    this.processor.onaudioprocess = ev => {
      if( this.buffer.size() > 0 ) {
        const out = this.buffer.deq()
        const outputBuffer = ev.outputBuffer.getChannelData(0)

        for( let i = 0; i < outputBuffer.length; i++ ) {
          outputBuffer[i] = out[i]
        }
      }
    }

    const update = _ => {
      requestAnimationFrame( update )
      const pcmArray = new Uint8Array( this.analyzer.frequencyBinCount )
      const fftArray = new Uint8Array( this.analyzer.frequencyBinCount )
      this.analyzer.getByteTimeDomainData( pcmArray )
      this.analyzer.getByteFrequencyData( fftArray )

      if( typeof analyzerCallback === 'function' ) {
        analyzerCallback( { pcmArray, fftArray } )
      }
    }

    update()
  }

  enq( f32arr ) {
    this.buffer.enq( f32arr )
  }
}
