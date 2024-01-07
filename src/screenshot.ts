import Sortable from 'sortablejs'
import { arrowDown, arrowUp } from './svg'

export class ScreenShot {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  video: HTMLVideoElement
  bottomY = 0
  topY = 0
  baseHeight = 0
  subtitleHeight = 0
  drawHeightPercent = 1
  sortable?: Sortable
  constructor(video: HTMLVideoElement) {
    this.video = video
    this.canvas = document.createElement('canvas')
    this.canvas.width = this.video.videoWidth
    this.canvas.height = this.video.videoHeight
    this.ctx = this.canvas.getContext('2d')!
    this.ctx.globalCompositeOperation = 'destination-over'
  }

  private getNowTime() {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    const date = now.getDate()
    const hour = now.getHours()
    const minute = now.getMinutes()
    const second = now.getSeconds()
    return `${year}-${month}-${date} ${hour}:${minute}:${second}`
  }

  takeLong() {
    this.video.pause()
    this.ctx?.drawImage(this.video, 0, 0)
    this.attachCanvasDom()
  }

  showPannel() {
    const container = document.getElementById('app')!
    const pannel = document.createElement('div')
    pannel.innerHTML = `<div id="shot-collect-pannel">
    <div class="shot-collect-pannel-title">
      <div class="shot-collect-pannel-title-text" data-expanded="true">
        <span>待拼接图片</span>
        <div class="screenshot-pannel-arrow" id="screenshot-arrow-up">${arrowUp}</div>
        <div class="screenshot-pannel-arrow" style="display: none;" id="screenshot-arrow-down">${arrowDown}</div>
      </div>
      <div class="flex-1"></div>
      <button class="screen-shot-btn">截取</button>
      <button class="screen-shot-btn btn-second">生成</button>
      <button class="screen-shot-btn btn-second">退出</button>
      </div>
      <div id="catch-canvas-wrapper"></div>
    </div>
    `
    container.appendChild(pannel)
    const pannelEl = pannel.querySelector('#shot-collect-pannel') as HTMLElement
    const title = pannel.querySelector(
      '.shot-collect-pannel-title-text'
    ) as HTMLElement
    const arrowUpEl = pannel.querySelector(
      '#screenshot-arrow-up'
    ) as HTMLElement
    const arrowDownEl = pannel.querySelector(
      '#screenshot-arrow-down'
    ) as HTMLElement
    title.onclick = (e) => {
      const expanded = title.getAttribute('data-expanded')
      if (expanded === 'true') {
        title.setAttribute('data-expanded', 'false')
        arrowUpEl.style.display = 'none'
        arrowDownEl.style.display = 'block'
        pannelEl.style.height = '300px'
      } else {
        title.setAttribute('data-expanded', 'true')
        arrowUpEl.style.display = 'block'
        arrowDownEl.style.display = 'none'
        pannelEl.style.height = '100vh'
      }
    }
    const pannelBtns = pannel.querySelectorAll('button')
    pannelBtns[0].onclick = () => this.catchScreen()
    pannelBtns[1].onclick = async () => this.genLongPic()
    pannelBtns[2].onclick = () => this.destroy()
    requestAnimationFrame(() => {
      this.sortable = Sortable.create(
        document.getElementById('catch-canvas-wrapper')!,
        {
          animation: 200,
          ghostClass: 'sortable-ghost-class',
        }
      )
    })
  }

  async takeCurrent() {
    this.ctx?.drawImage(this.video, 0, 0)
    return this.downloadPic()
  }

  private genLongPic() {
    const container = document.getElementById('catch-canvas-wrapper')!
    const canvass = container.querySelectorAll('canvas')
    if (!canvass.length) {
      alert('请至少截取一张图片')
      return
    }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    const newCanvas = document.createElement('canvas')
    newCanvas.width = this.canvas.width
    newCanvas.height = this.baseHeight
    const newCtx = newCanvas.getContext('2d')!
    this.canvas.height =
      this.baseHeight + this.subtitleHeight * (canvass.length - 2)
    this.ctx.globalCompositeOperation = 'destination-over'
    for (let i = 0; i < canvass.length; i++) {
      const cvs = canvass[i]
      newCtx.clearRect(0, 0, newCanvas.width, newCanvas.height)
      newCtx.drawImage(cvs, 0, 0)
      this.ctx.drawImage(newCanvas, 0, this.subtitleHeight * (i - 1))
    }
    this.downloadPic()
  }

  private async downloadPic(canvas?: HTMLCanvasElement) {
    const dataUrl = (canvas ?? this.canvas).toDataURL('image/png')
    const blob = await (await fetch(dataUrl)).blob()
    let objectUrl = URL.createObjectURL(blob)
    let link = document.createElement('a')
    link.href = objectUrl
    const fileNmae =
      document.title.split('_')[0] + '-' + this.getNowTime() + '.png'
    link.setAttribute('download', fileNmae)
    document.body.appendChild(link)
    link.click()
    window.URL.revokeObjectURL(link.href)
  }

  attachCanvasDom() {
    const baseHeight = (this.video.getBoundingClientRect().height * 2) / 3
    const screenshotWrapperHeight = document
      .querySelector('.bpx-player-video-area')!
      .getBoundingClientRect().height
    const optionbarHeight = document
      .querySelector('.bpx-player-sending-area')!
      .getBoundingClientRect().height
    const screenshotWrapper = document.createElement('div')
    screenshotWrapper.className = 'pointer-events-visible range-selector'
    screenshotWrapper.id = 'bpx-screenshot-wrapper'
    screenshotWrapper.onclick = (e) => {
      e.stopImmediatePropagation()
    }
    const renderHeight = baseHeight
    const renderWidth =
      (baseHeight * this.video.videoWidth) / this.video.videoHeight
    screenshotWrapper.style.width = '100%'
    screenshotWrapper.style.height = `${screenshotWrapperHeight}px`
    this.canvas.style.width = `${renderWidth}px`
    this.canvas.style.height = `${renderHeight}px`
    screenshotWrapper.appendChild(this.canvas)
    const rightDiv = document.createElement('div')
    const descDiv = document.createElement('div')
    descDiv.style.marginLeft = '24px'
    descDiv.style.color = '#fff'
    descDiv.style.fontSize = '14px'
    descDiv.style.lineHeight = '2'
    descDiv.style.userSelect = 'none'
    descDiv.innerText =
      '在左侧的截图上拖动上下横轴，标定字幕所在区域，然后确定即可。后续在需要截图的帧上点击截取按钮，即可保存此刻页面截图到拼接画布。'
    rightDiv.appendChild(descDiv)
    const btnsDiv = document.createElement('div')
    btnsDiv.className = 'screen-shot-opt-bar-btns'
    btnsDiv.innerHTML = `
    <button id="shot-opt-btn-cancel" class="screen-shot-btn btn-secondary">取消</button>
    <button id="shot-opt-btn-confirm" class="screen-shot-btn btn-primary">确定</button>
    `
    rightDiv.appendChild(btnsDiv)
    screenshotWrapper.appendChild(rightDiv)
    document
      .querySelector('.bpx-player-context-area')
      ?.appendChild(screenshotWrapper)
    ;(
      document.querySelector('#shot-opt-btn-cancel') as HTMLButtonElement
    ).onclick = () => {
      screenshotWrapper.remove()
      topLine.remove()
      bottomLine.remove()
      this.video.play()
    }
    ;(
      document.querySelector('#shot-opt-btn-confirm') as HTMLButtonElement
    ).onclick = () => {
      const bottomY = bottomLine.getBoundingClientRect().y
      const topY = topLine.getBoundingClientRect().y
      this.bottomY = bottomY
      this.topY = topY
      const drawHeightPercent = (bottomY - canvasRect.y) / canvasRect.height
      this.drawHeightPercent = drawHeightPercent
      screenshotWrapper.remove()
      topLine.remove()
      bottomLine.remove()
      this.baseHeight = this.canvas.height * drawHeightPercent
      this.canvas.width = this.video.videoWidth
      this.subtitleHeight =
        this.video.videoHeight * ((bottomY - topY) / canvasRect.height)
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.showPannel()
    }
    const insertCssText =
      ".bpx-screenshot-line::after{content:'';position: absolute;right: 0;bottom: 0;display: block;width: 16px;height: 16px;background: var(--bpx-fn-color,#00a1d6);border-radius: 50% 50% 50% 0;transform: translate(8px,7px) rotate(45deg);transition: background .1s ease;} .pointer-events-visible{pointer-events: visible;}"
    const headerEl = document.querySelector('head')
    if (headerEl) {
      headerEl.insertAdjacentHTML('beforeend', insertCssText)
    }
    const bottomLine = document.createElement('div')
    bottomLine.className =
      'bpx-screenshot-line bpx-screenshot-bottom-line pointer-events-visible'
    bottomLine.style.position = 'absolute'
    const canvasRect = this.canvas.getBoundingClientRect()
    const videoRect = this.video.getBoundingClientRect()
    const baseBottomLineHeight = canvasRect.y - videoRect.y + optionbarHeight
    bottomLine.style.bottom = `${baseBottomLineHeight}px`
    bottomLine.style.left = `${canvasRect.x - videoRect.x - 12}px`
    bottomLine.style.width = `${canvasRect.width + 32}px`
    document.querySelector('.bpx-player-context-area')?.appendChild(bottomLine)
    const topLine = document.createElement('div')
    topLine.className =
      'bpx-screenshot-line bpx-screenshot-top-line pointer-events-visible'
    topLine.style.position = 'absolute'
    topLine.style.bottom = `${
      canvasRect.y - videoRect.y + optionbarHeight + 36
    }px`
    topLine.style.left = `${canvasRect.x - videoRect.x - 12}px`
    topLine.style.width = `${canvasRect.width + 32}px`
    const cvs = screenshotWrapper.querySelector('canvas')!
    const cvsHeight = cvs.getBoundingClientRect().height
    const pointerMoveEvent = (isTop: boolean, startY: number) => {
      let sy = startY
      console.log()
      return (e: PointerEvent) =>
        requestAnimationFrame(() => {
          const move = e.movementY
          const bottomY = parseFloat(bottomLine.style.bottom.replace('px', ''))
          const topY = parseFloat(topLine.style.bottom.replace('px', ''))
          if (isTop) {
            sy -= move
            if (sy - baseBottomLineHeight > cvsHeight)
              sy = cvsHeight + baseBottomLineHeight
            if (sy < bottomY + 10) sy = bottomY + 10
            topLine.style.bottom = `${sy}px`
          } else {
            sy -= move
            if (sy > topY - 10) sy = topY - 10
            if (sy <= baseBottomLineHeight) sy = baseBottomLineHeight
            bottomLine.style.bottom = `${sy}px`
          }
        })
    }
    topLine.addEventListener('pointerdown', (e) => {
      const moveEvent = pointerMoveEvent(
        true,
        parseFloat(topLine.style.bottom.replace('px', ''))
      )
      document.addEventListener('pointermove', moveEvent)
      document.addEventListener('pointerup', () => {
        document.removeEventListener('pointermove', moveEvent)
      })
    })
    bottomLine.addEventListener('pointerdown', (e) => {
      const moveEvent = pointerMoveEvent(
        false,
        parseFloat(bottomLine.style.bottom.replace('px', ''))
      )
      document.addEventListener('pointermove', moveEvent)
      document.addEventListener('pointerup', () => {
        document.removeEventListener('pointermove', moveEvent)
      })
    })
    document.querySelector('.bpx-player-context-area')?.appendChild(topLine)
  }

  private catchScreen() {
    const wrapper = document.querySelector('#catch-canvas-wrapper')!
    const newCanvas = document.createElement('canvas')
    newCanvas.width = this.video.videoWidth
    newCanvas.height = this.video.videoHeight
    const newCanvasStyleWidth = wrapper.getBoundingClientRect().width
    const newCanvasStyleHeight =
      newCanvasStyleWidth * (this.video.videoHeight / this.video.videoWidth)
    newCanvas.style.width = newCanvasStyleWidth + 'px'
    newCanvas.style.height = newCanvasStyleHeight + 'px'
    const newCtx = newCanvas.getContext('2d')!
    newCtx.drawImage(
      this.video,
      0,
      0,
      this.video.videoWidth,
      this.video.videoHeight,
      0,
      0,
      this.video.videoWidth,
      this.video.videoHeight
    )
    const div = document.createElement('div')
    div.className = 'catch-screen-item'
    div.appendChild(newCanvas)
    const span = document.createElement('span')
    span.className = 'bpx-catch-pic-delete'
    span.textContent = '删除'
    span.onclick = () => {
      div.remove()
    }
    div.appendChild(span)
    wrapper.appendChild(div)
  }

  destroy() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.bottomY = 0
    this.topY = 0
    this.baseHeight = 0
    this.subtitleHeight = 0
    this.drawHeightPercent = 1
    document.getElementById('shot-collect-pannel')?.parentElement?.remove()
  }
}
