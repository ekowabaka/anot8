let canvas
let activeTool
let annotations = []
let selectedAnnotations = []

const image = document.createElement('img')

function setCanvasContainer(element) {
    canvas = element;
    image.draggable = false
    canvas.appendChild(image)
    

    image.addEventListener('mousedown', event => {
        //activeTool.mouseDown(event)
        eventListeners[0].mouseDown(event)
    });

    image.addEventListener('mouseup', event => {
        //activeTool.mouseUp(event)
        eventListeners[0].mouseUp(event)
    });

    image.addEventListener('mousemove', event => {
        //activeTool.mouseMove(event)
        eventListeners[0].mouseMove(event)
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
    eventListeners = [activeTool]
}

function pushEventListner(listener) {
    eventListeners.unshift(listener)
}

function popEventListener() {
    return eventListeners.shift()
}

function getCanvasContainer() {
    return canvas
}

function getAnnotations() {
    return annotations
}

function disableAnnotations() {
    annotations.forEach(annotation => annotation.dom.style.pointerEvents = 'none')
}

function enableAnnotations() {
    annotations.forEach(annotation => annotation.dom.style.pointerEvents = 'auto')
}

function addSelectedAnnotation(annotation) {
    selectedAnnotations.push(annotation)
}

function removeSelectedAnnotation(annotation) {
    selectedAnnotations.splice(selectedAnnotations.indexOf(annotation), 1)    
}

function deselectAnnotations() {
    annotations.forEach(annotation => annotation.deselect())
    selectedAnnotations = []
}

image.onload = () => Promise.resolve(createImageBitmap(image)).then(b => bitmap = b)

module.exports = {
    setCanvasContainer : setCanvasContainer,
    getCanvasContainer : getCanvasContainer,
    setImagePath: setImagePath,
    getImage: getImage,
    setActiveTool: setActiveTool,
    pushEventListner : pushEventListner,
    popEventListener : popEventListener,
    getAnnotations : getAnnotations,
    disableAnnotations : disableAnnotations,
    enableAnnotations : enableAnnotations,
    addSelectedAnnotation : addSelectedAnnotation,
    removeSelectedAnnotation : removeSelectedAnnotation,
    deselectAnnotations : deselectAnnotations
}
