import './lib/gif/gif.js'
import { getGifWorkerURL } from './lib/gif/worker.js'

export class GifShot {
  interval: number = 16
  scale: number = 0.5
  video: HTMLVideoElement
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  timer: number | undefined
  gif: any
  startTime: number = 0
  flag: boolean = false

  constructor(video: HTMLVideoElement) {
    this.video = video
    // this.video.pause()
    this.canvas = document.createElement('canvas')
    this.canvas.width = this.video.videoWidth
    this.canvas.height = this.video.videoHeight
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true })!
    this.showPannel()
  }

  showPannel() {
    const container = document.getElementById('app')!
    const pannel = document.createElement('div')
    pannel.innerHTML = `<div id="shot-collect-pannel" style="height:auto;">
    <div class="shot-collect-pannel-title">
      <div class="shot-collect-pannel-title-text" data-expanded="true">
        <span>录制设定</span>
      </div>
      <div class="flex-1"></div>
      <button class="screen-shot-btn" id="gif-opt-button">开始</button>
      <button class="screen-shot-btn btn-second">退出</button>
      </div>
      <div id="gif-settings-wrapper">
        <div class="gif-input-wrapper">
          <input class="poc-input" value="100" style="height: 24px;" id="shot-interval" type="number" value="500" />
          <label class="poc-label gif-input-label" for="shot-interval">间隔时间(ms)</label>
        </div>
        <div class="gif-input-wrapper">
          <input class="poc-input" style="height: 24px;" id="shot-scale" type="number" value="0.4" />
          <label class="poc-label gif-input-label" for="shot-scale">缩放比例(%)</label>
        </div>
      </div>
    </div>
    `
    container.appendChild(pannel)
    const pannelBtns = pannel.querySelectorAll('button')
    pannelBtns[0].addEventListener('click', this.toggle)
    pannelBtns[1].addEventListener('click', this.destory)
  }

  toggle = () => {
    if (this.flag) {
      this.stop()
      this.flag = false
      const btn = document.getElementById('gif-opt-button') as HTMLButtonElement
      btn.innerText = '生成中……'
      btn.disabled = true
    } else {
      this.begin()
      this.flag = true
      const btn = document.getElementById('gif-opt-button') as HTMLButtonElement
      btn.innerText = '停止'
    }
  }

  begin = () => {
    this.interval = Number(
      (document.getElementById('shot-interval') as HTMLInputElement).value
    )
    this.scale = Number(
      (document.getElementById('shot-scale') as HTMLInputElement).value
    )

    this.scale = this.scale > 1 ? 1 : this.scale

    this.canvas.width = this.video.videoWidth * this.scale
    this.canvas.height = this.video.videoHeight * this.scale

    // @ts-ignore
    this.gif = new GIF({
      workers: 4,
      workerScript: getGifWorkerURL(),
      width: this.video.videoWidth * this.scale,
      height: this.video.videoHeight * this.scale,
    })

    this.gif.on('start', () => (this.startTime = Date.now()))
    this.gif.on('finished', (blob: Blob) => {
      const a = document.createElement('a')
      const fileNmae = document.title.split('_')[0] + '-gif-' + '.gif'
      a.href = URL.createObjectURL(blob)
      a.download = fileNmae
      a.click()
      const btn = document.getElementById('gif-opt-button') as HTMLButtonElement
      btn.innerText = '开始'
      btn.disabled = false
    })

    this.timer = setInterval(this.catchFrame, this.interval)
  }

  stop = () => {
    clearInterval(this.timer)
    this.gif.render()
  }

  catchFrame = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height)
    this.gif.addFrame(this.ctx, {
      copy: true,
      delay: this.interval,
    })
  }

  destory = () => {
    this.gif = null
    document.getElementById('shot-collect-pannel')?.parentElement?.remove()
  }
}
