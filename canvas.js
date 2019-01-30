let canvas, context, bitmap
let zoomLevel = 1
let startLocation, selectorSize, selectedAnnotation
const image = new Image()
let annotations = []

function setCanvasElement(element) {
    canvas = element;
    context = element.getContext('2d')
    canvas.addEventListener('mousedown', event => {
        startLocation = [
            canvas.parentNode.scrollLeft + event.x, 
            canvas.parentNode.scrollTop + event.y
        ]
    });
    canvas.addEventListener('mouseup', event => {
        if(startLocation) {
            let annotation = {
                left: startLocation[0],
                top: startLocation[1],
                width: selectorSize[0],
                height: selectorSize[1],
                label: null
            }
            selectedAnnotation = annotation
            annotations.push(annotation)
        }
        startLocation = undefined;
        renderCanvas()
    });
    canvas.addEventListener('mousemove', event => {
        if(startLocation) {
            selectorSize = [
                canvas.parentNode.scrollLeft + event.x - startLocation[0], 
                canvas.parentNode.scrollTop + event.y - startLocation[1]
            ]
            renderCanvas()
        }
    });
}

function setImage(path) {
    image.src = path
}

function drawRectAnnotation(annotation) {
    context.save()
    if(Object.is(annotation, selectedAnnotation)) {
        context.fillStyle = 'rgba(0, 255, 0, 0.3)'
        context.strokeStyle = 'rgb(0, 255, 0)'    
    } else {
        context.fillStyle = 'rgba(0, 0, 255, 0.1)'
        context.strokeStyle = 'rgba(0, 0, 255, 0.5)'    
    }
    context.beginPath()
    context.rect(annotation.left, annotation.top, annotation.width, annotation.height)
    context.fill()
    context.stroke()
    context.closePath()
    context.restore()
}

function renderCanvas() {
    if(!bitmap) {
        return;
    }
    const width = bitmap.width * zoomLevel
    const height = bitmap.height * zoomLevel
    canvas.width = width
    canvas.height = height
    context.drawImage(bitmap, 0, 0, width, height)
    annotations.forEach(annotation => drawRectAnnotation(annotation)) 
    if(startLocation) {
        context.strokeRect(startLocation[0], startLocation[1], selectorSize[0], selectorSize[1])
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
