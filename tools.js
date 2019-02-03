const RectangleAnnotation = require('./annotation').RectangleAnnotation

class Tool {
    constructor(annotations) {
        this.annotations = annotations
    }

    mouseUp() { }

    mouseDown(event, canvas) { }

    mouseMove(event, canvas) { }    

    activate() { }

    deactivate() { }
}

class RectangleTool extends Tool {
    constructor (annotations) {
        super(annotations)
        this.creatingNewAnnotation = false
        this.newAnnotation = undefined
        this.startPoint = undefined
    }

    mouseUp(event, canvas) {
        if(this.creatingNewAnnotation) {
            this.creatingNewAnnotation = false
            if(this.newAnnotation.width > 2 && this.newAnnotation.height > 2) {
                console.log(this.newAnnotation.width, this.newAnnotation.height)
                this.annotations.push(this.newAnnotation)
                this.newAnnotation.editLabel()    
            } else {
                canvas.removeChild(this.newAnnotation.dom)
            }
        }
    }

    mouseDown(event, canvas) {
        this.startPoint = [canvas.parentNode.scrollLeft + event.offsetX, canvas.parentNode.scrollTop + event.offsetY]
        this.newAnnotation = new RectangleAnnotation( this.startPoint[0], this.startPoint[1])
        this.creatingNewAnnotation = true
        canvas.appendChild(this.newAnnotation.dom)
    }

    mouseMove(event, canvas) {
        if(this.creatingNewAnnotation) {
            let newWidth = canvas.parentNode.scrollLeft + event.offsetX - this.startPoint[0]
            let newHeight = canvas.parentNode.scrollTop + event.offsetY - this.startPoint[1]
            if(newWidth < 0) {
                this.newAnnotation.left = this.startPoint[0] + newWidth
            }
            if(newHeight < 0) {
                this.newAnnotation.top = this.startPoint[1] + newHeight
            }
            this.newAnnotation.width = Math.abs(newWidth)
            this.newAnnotation.height = Math.abs(newHeight)
        }
    }
}

class SelectorTool extends Tool {
    constructor(annotations) {
        super(annotations)
    }

    activate() {
        this.annotations.forEach(annotation => annotation.dom.style.pointerEvents = 'auto')
    }

    deactivate() {
        this.annotations.forEach(annotation => annotation.dom.style.pointerEvents = 'none')
    }
}

module.exports = {
    RectangleTool : RectangleTool,
    SelectorTool: SelectorTool
}

