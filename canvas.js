let canvas, context, bitmap
let zoomLevel = 1
let startLocation, selectorSize;
const image = new Image()

function setCanvasElement(element) {
    canvas = element;
    context = element.getContext('2d')
    canvas.addEventListener('mousedown', event => {
        startLocation = [event.clientX, event.clientY]
    });
    canvas.addEventListener('mouseup', event => {
        startLocation = undefined;
    });
    canvas.addEventListener('mousemove', event => {
        if(startLocation) {
            selectorSize = [event.clientX - startLocation[0], event.clientY - startLocation[1]]
        }
    });
}

function setImage(path) {
    image.src = path
}

function renderCanvas() {
    const width = bitmap.width * zoomLevel
    const height = bitmap.height * zoomLevel
    canvas.width = width
    canvas.height = height
    context.drawImage(bitmap, 0, 0, width, height)
    if(startLocation) {
        context.rect(startLocation[0], startLocation[1], selectorSize[0], selectorSize[1])
    }
}

function zoom(level) {
    zoomLevel += level
    renderCanvas()
}

image.onload = () => {
    Promise.resolve(createImageBitmap(image)).then(b => {
        bitmap = b
        renderCanvas()
    })
}

module.exports = {
    setCanvasElement : setCanvasElement,
    setImage: setImage,
    zoom: zoom
}