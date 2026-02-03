export const resizeImage = (imgUrl: string, size = 512) => {
  if (!imgUrl) return ''

  try {
    const url = new URL(imgUrl)
    const domain = url.hostname

    if (domain.includes('kugou')) {
      return imgUrl.replace('/100/', `/${size}/`)
    }

    return `${imgUrl}${imgUrl.includes('?') ? '&' : '?'}param=${size}y${size}`
  } catch (e) {
    return imgUrl
  }
}
