const initialState = {
  pcm: new Uint8Array(0),
  fft: new Uint8Array(0)
}

export const TYPES = {
  SET_PCM: 'SET_PCM',
  SET_FFT: 'SET_FFT'
}

export default function reducer( state=initialState, action ) {
  switch( action.type ) {
    case TYPES.SET_PCM:
      return Object.assign({}, state, { pcm: action.payload })
    case TYPES.SET_FFT:
      return Object.assign({}, state, { fft: action.payload })
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
