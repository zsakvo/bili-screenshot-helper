// ==UserScript==
// @name        哔哩哔哩视频字幕拼接
// @description Bilibili 截图助手
// @namespace   https://zsakvo.cc
// @run-at      document-end
// @include     *://www.bilibili.com/video/*
// @require     https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js
// @downloadURL https://unpkg.com/bili-screenshot-helper/dist/bili-screenshot-helper.user.js
// @updateURL   https://unpkg.com/bili-screenshot-helper/dist/bili-screenshot-helper.meta.js
// @version     1.0.1
// @author      zsakvo
// @grant       none
// ==/UserScript==
(function(typedQuerySelector,Sortable){'use strict';const bpxPlayerShotMenuWrap = `.bpx-player-shot-menu-wrap{bottom: 32px;position: absolute;background: hsla(0,0%,8%,.9);}`;
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
.bpx-screenshot-line{
  cursor: row-resize;
  height: 3px;
  background: var(--bpx-fn-color, #00a1d6);
  z-index: 1100;
}
.bpx-screenshot-line::after{
  content: "";
  position: absolute;
  right: 0;
  bottom: 0;
  display: block;
  width: 16px;
  height: 16px;
  background: var(--bpx-fn-color, #00a1d6);
  border-radius: 50% 50% 50% 0;
  -webkit-transform: translate(8px, 7px) rotate(45deg);
  transform: translate(8px, 7px) rotate(45deg);
  transition: background .1s ease;
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
</style>`;
function injectHeader() {
    const headerEl = document.querySelector('head');
    if (headerEl) {
        headerEl.insertAdjacentHTML('beforeend', initialStyle);
    }
}const arrowUp = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.9999 10.8284L7.0502 15.7782L5.63599 14.364L11.9999 8L18.3639 14.364L16.9497 15.7782L11.9999 10.8284Z"></path></svg>`;
const arrowDown = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z"></path></svg>`;
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
class ScreenShot {
    getNowTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const date = now.getDate();
        const hour = now.getHours();
        const minute = now.getMinutes();
        const second = now.getSeconds();
        return `${year}-${month}-${date} ${hour}:${minute}:${second}`;
    }
    takeLong() {
        this.video.pause();
        this.ctx?.drawImage(this.video, 0, 0);
        this.attachCanvasDom();
    }
    showPannel() {
        const container = document.getElementById('app');
        const pannel = document.createElement('div');
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
    `;
        container.appendChild(pannel);
        const pannelEl = pannel.querySelector('#shot-collect-pannel');
        const title = pannel.querySelector('.shot-collect-pannel-title-text');
        const arrowUpEl = pannel.querySelector('#screenshot-arrow-up');
        const arrowDownEl = pannel.querySelector('#screenshot-arrow-down');
        title.onclick = (e)=>{
            const expanded = title.getAttribute('data-expanded');
            if (expanded === 'true') {
                title.setAttribute('data-expanded', 'false');
                arrowUpEl.style.display = 'none';
                arrowDownEl.style.display = 'block';
                pannelEl.style.height = '300px';
            } else {
                title.setAttribute('data-expanded', 'true');
                arrowUpEl.style.display = 'block';
                arrowDownEl.style.display = 'none';
                pannelEl.style.height = '100vh';
            }
        };
        const pannelBtns = pannel.querySelectorAll('button');
        pannelBtns[0].onclick = ()=>this.catchScreen();
        pannelBtns[1].onclick = async ()=>this.genLongPic();
        pannelBtns[2].onclick = ()=>this.destroy();
        requestAnimationFrame(()=>{
            this.sortable = Sortable.create(document.getElementById('catch-canvas-wrapper'), {
                animation: 200,
                ghostClass: 'sortable-ghost-class'
            });
        });
    }
    async takeCurrent() {
        this.ctx?.drawImage(this.video, 0, 0);
        return this.downloadPic();
    }
    genLongPic() {
        const container = document.getElementById('catch-canvas-wrapper');
        const canvass = container.querySelectorAll('canvas');
        if (!canvass.length) {
            alert('请至少截取一张图片');
            return;
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const newCanvas = document.createElement('canvas');
        newCanvas.width = this.canvas.width;
        newCanvas.height = this.baseHeight;
        const newCtx = newCanvas.getContext('2d');
        this.canvas.height = this.baseHeight + this.subtitleHeight * (canvass.length - 2);
        this.ctx.globalCompositeOperation = 'destination-over';
        for(let i = 0; i < canvass.length; i++){
            const cvs = canvass[i];
            newCtx.clearRect(0, 0, newCanvas.width, newCanvas.height);
            newCtx.drawImage(cvs, 0, 0);
            this.ctx.drawImage(newCanvas, 0, this.subtitleHeight * (i - 1));
        }
        this.downloadPic();
    }
    async downloadPic(canvas) {
        const dataUrl = (canvas ?? this.canvas).toDataURL('image/png');
        const blob = await (await fetch(dataUrl)).blob();
        let objectUrl = URL.createObjectURL(blob);
        let link = document.createElement('a');
        link.href = objectUrl;
        const fileNmae = document.title.split('_')[0] + '-' + this.getNowTime() + '.png';
        link.setAttribute('download', fileNmae);
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(link.href);
    }
    attachCanvasDom() {
        const baseHeight = this.video.getBoundingClientRect().height * 2 / 3;
        const screenshotWrapperHeight = document.querySelector('.bpx-player-video-area').getBoundingClientRect().height;
        document.querySelector('.bpx-player-sending-area').getBoundingClientRect().height;
        const screenshotWrapper = document.createElement('div');
        screenshotWrapper.className = 'pointer-events-visible range-selector';
        screenshotWrapper.id = 'bpx-screenshot-wrapper';
        screenshotWrapper.onclick = (e)=>{
            e.stopImmediatePropagation();
        };
        const renderHeight = baseHeight;
        const renderWidth = baseHeight * this.video.videoWidth / this.video.videoHeight;
        screenshotWrapper.style.width = '100%';
        screenshotWrapper.style.height = `${screenshotWrapperHeight}px`;
        this.canvas.style.width = `${renderWidth}px`;
        this.canvas.style.height = `${renderHeight}px`;
        screenshotWrapper.appendChild(this.canvas);
        const rightDiv = document.createElement('div');
        const descDiv = document.createElement('div');
        descDiv.style.marginLeft = '24px';
        descDiv.style.color = '#fff';
        descDiv.style.fontSize = '14px';
        descDiv.style.lineHeight = '2';
        descDiv.style.userSelect = 'none';
        descDiv.innerText = '在左侧的截图上拖动上下横轴，标定字幕所在区域，然后确定即可。后续在需要截图的帧上点击截取按钮，即可保存此刻页面截图到拼接画布。';
        rightDiv.appendChild(descDiv);
        const btnsDiv = document.createElement('div');
        btnsDiv.className = 'screen-shot-opt-bar-btns';
        btnsDiv.innerHTML = `
    <button id="shot-opt-btn-cancel" class="screen-shot-btn btn-secondary">取消</button>
    <button id="shot-opt-btn-confirm" class="screen-shot-btn btn-primary">确定</button>
    `;
        rightDiv.appendChild(btnsDiv);
        screenshotWrapper.appendChild(rightDiv);
        document.querySelector('.bpx-player-context-area')?.appendChild(screenshotWrapper);
        document.querySelector('#shot-opt-btn-cancel').onclick = ()=>{
            screenshotWrapper.remove();
            topLine.remove();
            bottomLine.remove();
            this.video.play();
        };
        document.querySelector('#shot-opt-btn-confirm').onclick = ()=>{
            const bottomY = bottomLine.getBoundingClientRect().y;
            const topY = topLine.getBoundingClientRect().y;
            this.bottomY = bottomY;
            this.topY = topY;
            const drawHeightPercent = (bottomY - canvasRect.y) / canvasRect.height;
            this.drawHeightPercent = drawHeightPercent;
            screenshotWrapper.remove();
            topLine.remove();
            bottomLine.remove();
            this.baseHeight = this.canvas.height * drawHeightPercent;
            this.canvas.width = this.video.videoWidth;
            this.subtitleHeight = this.video.videoHeight * ((bottomY - topY) / canvasRect.height);
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.showPannel();
        };
        const bottomLine = document.createElement('div');
        bottomLine.className = 'bpx-screenshot-line pointer-events-visible';
        bottomLine.style.position = 'absolute';
        const canvasRect = this.canvas.getBoundingClientRect();
        const videoRect = this.video.getBoundingClientRect();
        const baseBottomLineHeight = canvasRect.y - videoRect.y;
        bottomLine.style.bottom = `${baseBottomLineHeight}px`;
        bottomLine.style.left = `${canvasRect.x - videoRect.x - 12}px`;
        bottomLine.style.width = `${canvasRect.width + 32}px`;
        document.querySelector('#bpx-screenshot-wrapper').appendChild(bottomLine);
        const topLine = document.createElement('div');
        topLine.className = 'bpx-screenshot-line pointer-events-visible';
        topLine.style.position = 'absolute';
        topLine.style.bottom = `${canvasRect.y - videoRect.y + 36}px`;
        topLine.style.left = `${canvasRect.x - videoRect.x - 12}px`;
        topLine.style.width = `${canvasRect.width + 32}px`;
        const cvs = screenshotWrapper.querySelector('canvas');
        const cvsHeight = cvs.getBoundingClientRect().height;
        const pointerMoveEvent = (isTop, startY)=>{
            let sy = startY;
            console.log();
            return (e)=>requestAnimationFrame(()=>{
                    const move = e.movementY;
                    const bottomY = parseFloat(bottomLine.style.bottom.replace('px', ''));
                    const topY = parseFloat(topLine.style.bottom.replace('px', ''));
                    if (isTop) {
                        sy -= move;
                        if (sy - baseBottomLineHeight > cvsHeight) sy = cvsHeight + baseBottomLineHeight;
                        if (sy < bottomY + 10) sy = bottomY + 10;
                        topLine.style.bottom = `${sy}px`;
                    } else {
                        sy -= move;
                        if (sy > topY - 10) sy = topY - 10;
                        if (sy <= baseBottomLineHeight) sy = baseBottomLineHeight;
                        bottomLine.style.bottom = `${sy}px`;
                    }
                });
        };
        topLine.addEventListener('pointerdown', (e)=>{
            const moveEvent = pointerMoveEvent(true, parseFloat(topLine.style.bottom.replace('px', '')));
            document.addEventListener('pointermove', moveEvent);
            document.addEventListener('pointerup', ()=>{
                document.removeEventListener('pointermove', moveEvent);
            });
        });
        bottomLine.addEventListener('pointerdown', (e)=>{
            const moveEvent = pointerMoveEvent(false, parseFloat(bottomLine.style.bottom.replace('px', '')));
            document.addEventListener('pointermove', moveEvent);
            document.addEventListener('pointerup', ()=>{
                document.removeEventListener('pointermove', moveEvent);
            });
        });
        document.querySelector('#bpx-screenshot-wrapper').appendChild(topLine);
    }
    catchScreen() {
        const wrapper = document.querySelector('#catch-canvas-wrapper');
        const newCanvas = document.createElement('canvas');
        newCanvas.width = this.video.videoWidth;
        newCanvas.height = this.video.videoHeight;
        const newCanvasStyleWidth = wrapper.getBoundingClientRect().width;
        const newCanvasStyleHeight = newCanvasStyleWidth * (this.video.videoHeight / this.video.videoWidth);
        newCanvas.style.width = newCanvasStyleWidth + 'px';
        newCanvas.style.height = newCanvasStyleHeight + 'px';
        const newCtx = newCanvas.getContext('2d');
        newCtx.drawImage(this.video, 0, 0, this.video.videoWidth, this.video.videoHeight, 0, 0, this.video.videoWidth, this.video.videoHeight);
        const div = document.createElement('div');
        div.className = 'catch-screen-item';
        div.appendChild(newCanvas);
        const span = document.createElement('span');
        span.className = 'bpx-catch-pic-delete';
        span.textContent = '删除';
        span.onclick = ()=>{
            div.remove();
        };
        div.appendChild(span);
        wrapper.appendChild(div);
    }
    destroy() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.bottomY = 0;
        this.topY = 0;
        this.baseHeight = 0;
        this.subtitleHeight = 0;
        this.drawHeightPercent = 1;
        document.getElementById('shot-collect-pannel')?.parentElement?.remove();
    }
    constructor(video){
        _define_property(this, "canvas", void 0);
        _define_property(this, "ctx", void 0);
        _define_property(this, "video", void 0);
        _define_property(this, "bottomY", 0);
        _define_property(this, "topY", 0);
        _define_property(this, "baseHeight", 0);
        _define_property(this, "subtitleHeight", 0);
        _define_property(this, "drawHeightPercent", 1);
        _define_property(this, "sortable", void 0);
        this.video = video;
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.video.videoWidth;
        this.canvas.height = this.video.videoHeight;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.globalCompositeOperation = 'destination-over';
    }
}const settingBox = document.createElement('div');
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
`;
const screenshotBtn = settingBox.firstChild;
function shotCurrent() {
    const ss = new ScreenShot(document.querySelector('video'));
    ss.takeCurrent();
}
function shotLong() {
    const ss = new ScreenShot(document.querySelector('video'));
    ss.takeLong();
    observeVideoSize();
}
function observeVideoSize() {
    let firstResize = true;
    const video = document.querySelector('video');
    if (video) {
        const resizeObserver = new ResizeObserver((size, onserve)=>{
            if (firstResize) {
                firstResize = false;
                return;
            }
            document.querySelector('#bpx-screenshot-wrapper')?.remove();
            document.querySelectorAll('.bpx-screenshot-line').forEach((item)=>{
                item.remove();
            });
            onserve.disconnect();
        });
        resizeObserver.observe(video);
    }
}
function shotGif() {
    console.log('gif');
}
function shotSettins() {
    console.log('截图设置');
}
window.shotCurrent = shotCurrent;
window.shotLong = shotLong;
window.shotGif = shotGif;
window.shotSettins = shotSettins;let pannelTimer;
(()=>{
    console.log('%c字幕拼接工具初始化', 'color: white; background: #00a381; padding: 3px 8px; border-radius: 4px;');
    injectHeader();
    injectButton();
})();
function injectButton() {
    const config = {
        attributes: true,
        childList: true,
        subtree: true
    };
    const callback = function(mutationsList, observer) {
        for (const mutation of mutationsList){
            if ([
                ...mutation.addedNodes
            ].map((node)=>node.className).join(' ').includes('bpx-player-ctrl-btn bpx-player-ctrl-quality')) {
                console.log('注入按钮');
                const fullBtn = document.querySelectorAll('.bpx-player-ctrl-quality')[0];
                const btnElement = screenshotBtn;
                btnElement.addEventListener('mouseenter', (e)=>{
                    clearTimeout(pannelTimer);
                    e.target.classList.add('bpx-state-show');
                });
                btnElement.addEventListener('mouseleave', (e)=>{
                    pannelTimer = setTimeout(()=>{
                        e.target.classList.remove('bpx-state-show');
                    }, 300);
                });
                fullBtn.parentElement.insertBefore(btnElement, fullBtn);
                observer.disconnect();
            }
        }
    };
    const observer = new MutationObserver(callback);
    observer.observe(document.body, config);
}})(null,Sortable);