export function timeFormat(timestamp: number) {
  const date = new Date(timestamp * 1000)
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} `
}

export function randomString(len: number = 8) {
  const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  const maxPos = chars.length
  let pwd = ''
  for (let i = 0; i < len; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return pwd
}

export function judgeImage(filename: string) {
  const suffix = `(bmp|jpg|png|webp|jpeg)`
  const regular = new RegExp(`.*.${suffix}`)
  return regular.test(filename)
}

export function file2URL(file: File | undefined | null) {
  if (!file) return ''
  return window.URL.createObjectURL(file)
}
