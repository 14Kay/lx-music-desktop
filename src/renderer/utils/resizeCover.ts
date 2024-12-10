export const resizeImage = (imgUrl: string, size = 512) => {
  if (!imgUrl) return ''
  let httpsImgUrl = imgUrl
  if (imgUrl.slice(0, 5) !== 'https') {
    httpsImgUrl = 'https' + imgUrl.slice(4)
  }
  const url = new URL(httpsImgUrl)
  const domain = url.hostname
  return domain.includes('kugou') ? httpsImgUrl.replace('/100/', '/400/') : `${httpsImgUrl}?param=${size}y${size}`
}
