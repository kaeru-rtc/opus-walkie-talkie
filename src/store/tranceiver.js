import { observable, computed, action } from 'mobx'

export default class TranceiverStore  {
  @observable stream

  @action getLocalStream = async _ => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true })
      .catch( err => { throw err })

    this.stream = stream
  }
}