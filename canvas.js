let canvas, context, bitmap
const image = new Image()

function setCanvasElement(element) {
    canvas = element;
    context = element.getContext('2d')
}

function setImage(path) {
    image.src = path
}

function renderCanvas() {
    canvas.width = bitmap.width
    canvas.height = bitmap.height
    context.drawImage(bitmap, 0, 0)
}

image.onload = () => {
    Promise.resolve(createImageBitmap(image)).then(b => {
        bitmap = b
        renderCanvas()
    })
}

module.exports = {
    setCanvasElement : setCanvasElement,
    setImage: setImage
}