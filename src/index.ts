import 'typed-query-selector'
import { injectHeader } from './styles'
import { screenshotBtn } from './ctrl_btn'
let pannelTimer: number
;(() => {
  console.log(
    '%c字幕拼接工具初始化',
    'color: white; background: #00a381; padding: 3px 8px; border-radius: 4px;'
  )
  injectHeader()
  injectButton()
})()

function injectButton() {
  const config = { attributes: true, childList: true, subtree: true }
  const callback = function (
    mutationsList: MutationRecord[],
    observer: MutationObserver
  ) {
    for (const mutation of mutationsList) {
      if (
        ([...mutation.addedNodes] as HTMLElement[])
          .map((node) => node.className)
          .join(' ')
          .includes('bpx-player-ctrl-btn bpx-player-ctrl-quality')
      ) {
        console.log('注入按钮')
        const fullBtn = document.querySelectorAll('.bpx-player-ctrl-quality')[0]
        const btnElement = screenshotBtn
        btnElement.addEventListener('mouseenter', (e) => {
          clearTimeout(pannelTimer)
          ;(e.target as HTMLElement).classList.add('bpx-state-show')
        })
        btnElement.addEventListener('mouseleave', (e) => {
          pannelTimer = setTimeout(() => {
            ;(e.target as HTMLElement).classList.remove('bpx-state-show')
          }, 300)
        })
        fullBtn.parentElement!.insertBefore(btnElement, fullBtn)
        observer.disconnect()
      }
    }
  }
  const observer = new MutationObserver(callback)
  observer.observe(document.body, config)
}
