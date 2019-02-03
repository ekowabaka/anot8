const Rectangle = require('./annotation').Rectangle
let canvas
let zoomLevel = 1
let selectedAnnotation
let newAnnotation = false
let annotations = []
let activeTool

const image = document.createElement('img')

function setCanvasContainer(element) {
    canvas = element;
    image.draggable = false
    canvas.appendChild(image)

    image.addEventListener('mousedown', event => {
        activeTool.mouseDown(event, canvas)
    });

    image.addEventListener('mouseup', event => {
        activeTool.mouseUp(event, canvas)
    });

    image.addEventListener('mousemove', event => {
        activeTool.mouseMove(event, canvas)
    });
}

function setImage(path) {
    image.src = path
}

function zoom(level) {
    zoomLevel += level
}

function setActiveTool(tool) {
    if(activeTool) {
        activeTool.deactivate()
    }
    tool.activate()
    activeTool = tool
}

image.onload = () => Promise.resolve(createImageBitmap(image)).then(b => bitmap = b)

module.exports = {
    setCanvasContainer : setCanvasContainer,
    setImage: setImage,
    zoom: zoom,
    setActiveTool: setActiveTool
}
