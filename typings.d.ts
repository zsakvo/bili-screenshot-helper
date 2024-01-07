declare module '*.svg' {
  const content: any
  export default content
}

// window 对象声明 shortCurrent 方法
declare interface Window {
  shotCurrent: (current: string) => void
  shotLong: () => void
  shotGif: () => void
  shotSettins: () => void
}
