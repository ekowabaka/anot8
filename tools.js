const RectangleAnnotation = require('./annotation').RectangleAnnotation

class Tool {
    constructor(canvas, annotations) {
        this.annotations = annotations
        this.canvas = canvas
    }

    mouseUp() { }

    mouseDown(event) { }

    mouseMove(event) { }    

    activate() { }

    deactivate() { }
}

/**
 * A tool for creating and editing rectangle annotations.
 */
class RectangleTool extends Tool {

    /**
     * Create a new rectangle annotation
     * 
     * @param {Array} annotations 
     */
    constructor (canvas, annotations) {
        super(canvas, annotations)
        this.creatingNewAnnotation = false
        this.newAnnotation = undefined
        this.startPoint = undefined
        this.cursor = 'crosshair'
    }

    /**
     * Event handler 
     * 
     * @param {MouseEvent} event 
     */
    mouseUp(event) {
        if(this.creatingNewAnnotation) {
            this.creatingNewAnnotation = false
            if(this.newAnnotation.width > 2 && this.newAnnotation.height > 2) {
                console.log(this.newAnnotation.width, this.newAnnotation.height)
                this.annotations.push(this.newAnnotation)
                this.newAnnotation.editLabel()
            } else {
                this.canvas.removeChild(this.newAnnotation.dom)
            }
        }
    }

    /**
     * 
     * 
     * @param {MouseEvent} event 
     */
    mouseDown(event) {
        this.startPoint = [
            this.canvas.parentNode.scrollLeft + event.offsetX, 
            this.canvas.parentNode.scrollTop + event.offsetY
        ]
        this.newAnnotation = new RectangleAnnotation(this.startPoint[0], this.startPoint[1])
        this.creatingNewAnnotation = true
        this.canvas.appendChild(this.newAnnotation.dom)
    }

    mouseMove(event) {
        if(this.creatingNewAnnotation) {
            let newWidth = this.canvas.parentNode.scrollLeft + event.offsetX - this.startPoint[0]
            let newHeight = this.canvas.parentNode.scrollTop + event.offsetY - this.startPoint[1]
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
    constructor(canvas, annotations) {
        super(canvas, annotations)
        this.cursor = 'default'
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
