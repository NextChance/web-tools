export const createPlaceholderImage = () => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('viewBox', '0 0 9 11')
  svg.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', 'http://www.w3.org/1999/xlink')
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
  rect.setAttribute('x', '0')
  rect.setAttribute('y', '0')
  rect.setAttribute('height', '100%')
  rect.setAttribute('width', '100%')
  rect.setAttribute('fill', '#F7F7F7')
  svg.appendChild(rect)
  return svg
}

export const replaceNodeWithErrorImage = (nodeElement: HTMLElement) => {
  const errorImage: Element = document.createElement('div')
  errorImage.classList.add('placeholder-image', 'placeholder-image--error')
  const svg = createPlaceholderImage()
  errorImage.appendChild(svg)
  nodeElement.parentElement?.replaceChild(errorImage, nodeElement)
}

export const generateLoaderImage = () => {
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient')
    gradient.setAttribute('id', 'loaderGradient')
    gradient.setAttribute('x1', '0')
    gradient.setAttribute('x2', '1')
    gradient.setAttribute('y1', '0')
    gradient.setAttribute('y2', '0')
    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop')
    stop1.setAttribute('offset', '0%')
    stop1.setAttribute('stop-color', 'rgb(247, 247, 247)')
    stop1.setAttribute('stop-opacity', '0')
    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop')
    stop2.setAttribute('offset', '50%')
    stop2.setAttribute('stop-color', '#FFF')
    stop2.setAttribute('stop-opacity', '0.5')
    const stop3 = document.createElementNS('http://www.w3.org/2000/svg', 'stop')
    stop3.setAttribute('offset', '100%')
    stop3.setAttribute('stop-color', 'rgb(247, 247, 247)')
    stop3.setAttribute('stop-opacity', '0')
    gradient.appendChild(stop1)
    gradient.appendChild(stop2)
    gradient.appendChild(stop3)
    defs.appendChild(gradient)
    const loader = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    loader.setAttribute('x', '0')
    loader.setAttribute('y', '0')
    loader.setAttribute('height', '100%')
    loader.setAttribute('width', '100%')
    loader.setAttribute('class', 'placeholder-image__loader')
    loader.setAttribute('fill', 'url(#loaderGradient)')
    return {
        defs,
        loader
    }
}

export const addSiblingNodeWithLoadingImage = (nodeElement: HTMLElement) => {
    const loadingImage: HTMLElement = document.createElement('div')
    loadingImage.classList.add('placeholder-image', 'placeholder-image--loading')
    const svg = createPlaceholderImage()
    loadingImage.appendChild(svg)
    nodeElement.parentElement?.appendChild(loadingImage)
    return loadingImage
}
