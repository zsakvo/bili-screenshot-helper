import { ScreenShot } from './screenshot'

const settingBox = document.createElement('div')
settingBox.innerHTML = `<div
class="bpx-player-ctrl-btn bpx-player-screen-shot"
role="button"
aria-label="截图工具"
tabindex="0"
style="width: 50px"
>
<div class="bpx-player-screen-shot-result">截图</div>
<div class="bpx-player-screen-shot-menu-wrap"  id="screen-shot-menu-wrap"><ul class="bpx-player-screen-shot-menu">
  <li class="bpx-player-screen-shot-menu-item" onclick="shotCurrent()">
  <span class="bpx-player-screen-shot-text">截取当前</span>
  </li>
  <li class="bpx-player-screen-shot-menu-item" onclick="shotLong()">
    <span class="bpx-player-screen-shot-text">连续截屏</span>
  </li>
</ul></div>
</div>
`

export const screenshotBtn = settingBox.firstChild!

function shotCurrent() {
  const ss = new ScreenShot(document.querySelector('video')!)
  ss.takeCurrent()
}

function shotLong() {
  const ss = new ScreenShot(document.querySelector('video')!)
  ss.takeLong()
  observeVideoSize()
}

function observeVideoSize() {
  let firstResize = true
  const video = document.querySelector('video')
  if (video) {
    const resizeObserver = new ResizeObserver((size, onserve) => {
      if (firstResize) {
        firstResize = false
        return
      }
      document.querySelector('#bpx-screenshot-wrapper')?.remove()
      document.querySelectorAll('.bpx-screenshot-line').forEach((item) => {
        item.remove()
      })
      onserve.disconnect()
    })
    resizeObserver.observe(video)
  }
}

function shotGif() {
  console.log('gif')
}

function shotSettins() {
  console.log('截图设置')
}

window.shotCurrent = shotCurrent
window.shotLong = shotLong
window.shotGif = shotGif
window.shotSettins = shotSettins
