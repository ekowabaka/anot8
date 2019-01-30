const Rectangle = require('./annotation').Rectangle
let canvas
let zoomLevel = 1
let selectedAnnotation
let newAnnotation = false
let annotations = []

const image = document.createElement('img')

function setCanvasContainer(element) {
    canvas = element;
    image.draggable = false
    canvas.appendChild(image)

    image.addEventListener('mousedown', event => {
        selectedAnnotation = new Rectangle(
            canvas.parentNode.scrollLeft + event.offsetX, 
            canvas.parentNode.scrollTop + event.offsetY
        )
        newAnnotation = true
        annotations.push(selectedAnnotation)
        annotations.forEach(annotation => annotation.dom.style.pointerEvents = 'none')
        canvas.appendChild(selectedAnnotation.dom)
    });

    image.addEventListener('mouseup', event => {
        if(newAnnotation) {
            annotations.forEach(annotation => annotation.dom.style.pointerEvents = 'auto')
            annotations.push(selectedAnnotation)
            newAnnotation = false
        }
    });

    image.addEventListener('mousemove', event => {
        if(newAnnotation) {
            selectedAnnotation.width = canvas.parentNode.scrollLeft + event.offsetX - selectedAnnotation.left
            selectedAnnotation.height = canvas.parentNode.scrollTop + event.offsetY - selectedAnnotation.top
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

function zoom(level) {
    zoomLevel += level
    renderCanvas()
}

image.onload = () => {
    Promise.resolve(createImageBitmap(image)).then(b => {
        bitmap = b
    })
}

module.exports = {
    setCanvasContainer : setCanvasContainer,
    setImage: setImage,
    zoom: zoom
}
