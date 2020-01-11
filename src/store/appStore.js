const initialState = {
  pcm: new Uint8Array(0),
  fft: new Uint8Array(0),
  pcmBeforeOpus: new Float32Array(0),
  outPCM: new Uint8Array(0),
  outFFT: new Uint8Array(0),

  pcmSize: 0,
  opusSize: 0,

  bufferSize: 0, // size of circular-buffer


  // debug
  d_opusframe: new Int16Array(0),
  d_pcmframe: new Float32Array(0)
}

export const TYPES = {
  SET_PCM: 'SET_PCM',
  SET_FFT: 'SET_FFT',
  SET_PCM_BEFORE_OPUS: 'SET_PCM_BEFORE_OPUS',
  SET_OUT_PCM: 'SET_OUT_PCM',
  SET_OUT_FFT: 'SET_OUT_FFT',
  SET_PCM_SIZE:  'SET_PCM_SIZE',
  SET_OPUS_SIZE: 'SET_OPUS_SIZE',
  SET_BUFFER_SIZE: 'SET_BUFFER_SIZE',
  D_SET_OPUS_FRAME: 'D_SET_OPUS_FRAME',
  D_SET_PCM_FRAME: 'D_SET_OPUS_FRAME'
}

export default function reducer( state=initialState, action ) {
  switch( action.type ) {
    case TYPES.SET_PCM:
      return Object.assign({}, state, { pcm: action.payload })
    case TYPES.SET_FFT:
      return Object.assign({}, state, { fft: action.payload })
    case TYPES.SET_OUT_PCM:
      return Object.assign({}, state, { outPCM: action.payload })
    case TYPES.SET_OUT_FFT:
      return Object.assign({}, state, { outFFT: action.payload })
    case TYPES.SET_PCM_BEFORE_OPUS:
      return Object.assign({}, state, { pcmBeforeOpus: action.payload })
    case TYPES.SET_PCM_SIZE:
      return Object.assign({}, state, { pcmSize: action.payload })
    case TYPES.SET_OPUS_SIZE:
      return Object.assign({}, state, { opusSize: action.payload })
    case TYPES.SET_BUFFER_SIZE:
      return Object.assign({}, state, { bufferSize: action.payload })
    case TYPES.D_SET_OPUS_FRAME:
      return Object.assign({}, state, { d_opusframe: action.payload })
    case TYPES.D_SET_PCM_FRAME:
      return Object.assign({}, state, { d_pcmframe: action.payload })

    default:
      return state
  }
}

export const setPCM = pcm => {
  return {
    type: TYPES.SET_PCM,
    payload: pcm
  }
}

export const setFFT = fft => {
  return {
    type: TYPES.SET_FFT,
    payload: fft
  }
}

export const setPcmBeforeOpus = pcmBeforeOpus => {
  return {
    type: TYPES.SET_PCM_BEFORE_OPUS,
    payload: pcmBeforeOpus
  }
}

export const setOutPCM = outPCM => {
  return {
    type: TYPES.SET_OUT_PCM,
    payload: outPCM
  }
}

export const setOutFFT = outFFT => {
  return {
    type: TYPES.SET_OUT_FFT,
    payload: outFFT
  }
}

export const setPCMSize = pcmSize => {
  return {
    type: TYPES.SET_PCM_SIZE,
    payload: pcmSize
  }
}

export const setOpusSize = opusSize => {
  return {
    type: TYPES.SET_OPUS_SIZE,
    payload: opusSize
  }
}

export const setBufferSize = bufferSize => {
  return {
    type: TYPES.SET_BUFFER_SIZE,
    payload: bufferSize
  }
}

export const d_setOpusFrame = opusFrame => {
  return {
    type: TYPES.D_SET_OPUS_FRAME,
    payload: opusFrame
  }
}

export const d_setPcmFrame = pcmFrame => {
  return {
    type: TYPES.D_SET_PCM_FRAME,
    payload: pcmFrame
  }
}