import TempQueuer from './temp-queue'

export default class AudioSource {
  constructor( props ) {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)()
    this.props = Object.assign( {},
      { 
        frequency: 1024,
        gain: 1,
        fft_size: 4096,
        type: 'sine' // square, sawtooth, triangle, custom
        // see https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode/type
      }, props)

    this.queue = new TempQueuer( { size: 48000 })
  }

  /**
   * 
   * @param {function} analyzerCallback 
   * @param {function} pcmCallback 
   */
  start( analyzerCallback, pcmCallback ) {
    this.oscillator = this.ctx.createOscillator()
    this.oscillator.type = this.props.type
    this.oscillator.frequency.value = this.props.frequency

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
      const inputBuffer  = ev.inputBuffer.getChannelData(0)
      const outputBuffer = ev.outputBuffer.getChannelData(0)

      for( let i = 0; i < inputBuffer.length; i++ ) {
        outputBuffer[i] = inputBuffer[i]
      }
      this.queue.add( inputBuffer, pcmCallback )
    }

    const update = _ => {
      requestAnimationFrame( update )
      const pcmArray = new Uint8Array( this.analyzer.frequencyBinCount )
      const fftArray = new Uint8Array( this.analyzer.frequencyBinCount )
      this.analyzer.getByteTimeDomainData( pcmArray )
      this.analyzer.getByteFrequencyData( fftArray )

      if( typeof analyzerCallback === 'function' ) {
        // todo - eventemitter
        analyzerCallback( { pcmArray, fftArray } )
      }
    }

    update()
  }
}
