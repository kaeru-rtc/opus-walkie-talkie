import { EventEmitter } from 'events'

export default class TempQueue extends EventEmitter {
  constructor( props ) {
    super( props )
    
    this.props = Object.assign( {}, {size: 48000}, props )
    this.pos = 0 // current position of buffer
    this.queue = new Float32Array( this.props.size )
  }

  /**
   * 
   * @param {Float32Array} f32arr 
   * @param {function} callback
   */
  add( f32arr, callback ) {
    for( let i = 0; i < f32arr.length; i++ ) {
      this.queue[ this.pos++ ] = f32arr[i]

      // when position reaches queue size (e.g. 48000)
      // we will reset postion and emit data which are queued
      if( this.pos === this.props.size ) {
        // method `slice()` makes deep copy
        // for more detail: https://stackoverflow.com/questions/35563529/how-to-copy-typedarray-into-another-typedarray
        if( typeof callback === 'function')
          callback( this.queue.slice() )

        this.pos = 0
      }
    }
  }
}

