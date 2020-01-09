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
  }

  start( callback ) {
    this.oscillator = this.ctx.createOscillator()
    this.oscillator.type = this.props.type
    this.oscillator.frequency.value = this.props.frequency

    this.gainNode = this.ctx.createGain()
    this.gainNode.gain.value = this.props.gain

    this.oscillator.connect( this.gainNode )

    this.analyzer = this.ctx.createAnalyser()
    this.analyzer.fftSize = this.props.fft_size
    this.gainNode.connect( this.analyzer )
    this.analyzer.connect( this.ctx.destination )

    this.oscillator.start()

    const update = _ => {
      requestAnimationFrame( update )
      const pcmArray = new Uint8Array( this.analyzer.frequencyBinCount )
      const fftArray = new Uint8Array( this.analyzer.frequencyBinCount )
      this.analyzer.getByteTimeDomainData( pcmArray )
      this.analyzer.getByteFrequencyData( fftArray )

      if( typeof callback === 'function' ) {
        callback( { pcmArray, fftArray } )
      }
    }

    update()
  }
}
