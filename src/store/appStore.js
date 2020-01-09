const initialState = {
  pcm: new Uint8Array(0),
  fft: new Uint8Array(0),
  pcmBeforeOpus: new Float32Array(0),
  outPCM: new Uint8Array(0),
  outFFT: new Uint8Array(0),


}

export const TYPES = {
  SET_PCM: 'SET_PCM',
  SET_FFT: 'SET_FFT',
  SET_PCM_BEFORE_OPUS: 'SET_PCM_BEFORE_OPUS',
  SET_OUT_PCM: 'SET_OUT_PCM',
  SET_OUT_FFT: 'SET_OUT_FFT',
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