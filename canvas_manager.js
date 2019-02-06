let canvas
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

function setImagePath(path) {
    image.src = path
}

function getImage() {
    return image
}

function zoom(level) {
    zoomLevel += level
}

function setActiveTool(tool) {
    if(activeTool) {
        activeTool.deactivate()
    }
    tool.activate()
    image.style.cursor = tool.cursor
    activeTool = tool
}

function getCanvasContainer() {
    return canvas
}

image.onload = () => Promise.resolve(createImageBitmap(image)).then(b => bitmap = b)

module.exports = {
    setCanvasContainer : setCanvasContainer,
    getCanvasContainer : getCanvasContainer,
    setImagePath: setImagePath,
    getImage: getImage,
    setActiveTool: setActiveTool
}
