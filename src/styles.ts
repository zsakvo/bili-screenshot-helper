export const bpxPlayerShotMenuWrapClass = `bpx-player-shot-menu-wrap`
export const bpxPlayerShotMenuWrap = `.bpx-player-shot-menu-wrap{bottom: 32px;position: absolute;background: hsla(0,0%,8%,.9);}`
export const bpxStateShow = `bpx-state-show`

const initialStyle = `<style>
${bpxPlayerShotMenuWrap}
.bpx-player-screen-shot{
  -webkit-box-flex: 0;
  -ms-flex: none;
  flex: none;
  font-size: 12px;
  margin-right: 10px;
  width: auto;
}
.bpx-player-screen-shot-result{
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
}
.bpx-player-screen-shot-menu-wrap{

  background-color: hsla(0,0%,8%,.9);
  border-radius: 2px;
  bottom: 41px;
  cursor: pointer;
  left: 50%;
  margin: 0;
  max-height: 580px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
}
.bpx-player-screen-shot-menu{
  list-style: none;
  outline: none;
  display: none;
  margin: 0;
  padding: 0;
}
.bpx-state-show .bpx-player-screen-shot-menu{
  display: block;
}
.bpx-player-screen-shot-menu-item{
  webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  height: 36px;
  padding: 0 12px;
  white-space: nowrap;
  width: 124px;
  color:hsla(0,0%,100%,1);
}
#shot-collect-pannel{
  position: fixed;
  right: 0;
  width: 400px;
  background: #fafafa;
  box-shadow: 0 0 6px #949494;
  box-sizing: border-box;
  padding: 16px;
  z-index: 120000;
  top: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  transition: height 0.2s ease-out;
}
#catch-canvas-wrapper{
  overflow-y: auto;
  flex: 1;
  overscroll-behavior: contain;
}
.sortable-ghost-class{
  background:#fdb4b8;
}
.sortable-ghost-class > canvas{
  opacity: 0.4;
}
.catch-screen-item{
  cursor: move;
  position: relative;
}
.bpx-catch-pic-delete{
  position: absolute;
  left: 0;
  top: 0;
  width: fit-content;
  color: white;
  background: rgba(229, 57, 53,0.84);
  cursor: pointer;
  font-weight: bold;
  height: fit-content;
  padding: 4px 10px;
}
.shot-collect-pannel-title{
  border-bottom: 1px solid #d5d5d5;
  padding-bottom: 12px;
  display: flex;
  align-items: center;
}
.screenshot-pannel-arrow{
  width:24px;
}
.shot-collect-pannel-title-text{
  font-size: 16px;
  font-weight: bold;
  display: flex;
  user-select: none;
  cursor: pointer;
}
.shot-collect-pannel-title .flex-1{
  flex:1;
}
.screen-shot-btn {
  position: relative;
  font-size: .875rem;
  height: 2.15em;
  padding: 0 1em;
  border: none;
  background: rgb(5, 5, 5);
  border-radius: 4px;
  color: rgb(230, 230, 230);
  cursor: pointer;
  -webkit-user-select: none;
  user-select: none;
  box-shadow: 0 1px 1px 1px #0000001a, 0 1px 2px -1px #0000001a;
  font-weight: 600;
  transition: background .2s linear,box-shadow .2s linear,color .2s linear;
  margin-left:8px
}
.shot-collect-pannel-title .btn-second{
  background: rgb(250, 250, 250);
  color: rgb(55, 55, 55);
}
.shot-collect-pannel-title .btn:active:not([disabled]) {
  box-shadow: 0 1px 3px #0000, 0 1px 3px -1px #0000;
  background: rgb(85, 85, 85);
} 
.shot-collect-pannel-title .btn-second:active:not([disabled]) {
  background: rgb(220, 220, 220);
}

.screen-shot-opt-bar-btns{
  padding: 16px;
  user-select: none;
}

.screen-shot-opt-bar-btns .btn-primary{
  background: rgb(0, 161, 214);
  color: rgb(255, 255, 255);
}
.screen-shot-opt-bar-btns .btn-secondary{
  background: rgb(229, 57, 53);
  color: rgb(255, 255, 255);
}
.screen-shot-opt-bar-btns .btn-primary:active:not([disabled]) {
  box-shadow: 0 1px 3px #0000, 0 1px 3px -1px #0000;
  background: rgb(133, 194, 214);
} 
.screen-shot-opt-bar-btns .btn-secondary:active:not([disabled]) {
  background: rgb(229, 124, 121);
}

.range-selector {
  position: absolute;
  pointer-events: all;
  display: flex;
  align-items: center;
  justify-content: space-around;
  box-sizing: border-box;
  top: 0;
  left: 0;
  z-index: 1100;
  border-radius: 6px;
  overflow: hidden;
  background-color: rgba(33, 33, 33, 0.9);
  padding: 16px 32px;
}
.selector-btns-bar{
  position: absolute;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  box-sizing: border-box;
  bottom: 0;
  left: 0;
  z-index: 1100;
  width: 100%;
  background: #fff;
  padding: 8px 0;
}
.bpx-screenshot-top-line{
  cursor: row-resize;
  height: 3px;
  background: var(--bpx-fn-color, #00a1d6);
  z-index: 1100;
}
.bpx-screenshot-bottom-line{
  height: 3px;
  background: var(--bpx-fn-color, #00a1d6);
  cursor: row-resize;
  z-index: 1100;
}
.range-selector-btn-cancel{
  width: 62px;
  margin-right: 8px;
  height: 100%;
  background-color: #ff4d4f;
  color: #fff;
  font-size: 13px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  cursor: pointer;
}
.range-selector-btn-confirm{
  width: 62px;
  margin-right: 8px;
  height: 100%;
  background-color: var(--bpx-fn-color,#00a1d6);
  color: #fff;
  font-size: 13px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  cursor: pointer;
}
</style>`
export function injectHeader() {
  const headerEl = document.querySelector('head')
  if (headerEl) {
    headerEl.insertAdjacentHTML('beforeend', initialStyle)
  }
}
