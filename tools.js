'use strict'

const RectangleAnnotation = require('./annotations').RectangleAnnotation
const canvasManager = require('./canvas_manager')

class Tool {
  constructor(canvas) {
    this.annotations = canvasManager.getAnnotations()
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
  constructor(canvas, annotations) {
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
  mouseUp(_event) {
    if (this.creatingNewAnnotation) {
      this.creatingNewAnnotation = false
      if (this.newAnnotation.width > 2 && this.newAnnotation.height > 2) {
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
    canvasManager.deselectAnnotations()
    this.startPoint = [
      this.canvas.parentNode.scrollLeft + event.offsetX,
      this.canvas.parentNode.scrollTop + event.offsetY
    ]
    this.newAnnotation = new RectangleAnnotation(this.startPoint[0] / canvasManager.getZoomFactor(), this.startPoint[1] / canvasManager.getZoomFactor())
    this.newAnnotation.zoomFactor = canvasManager.getZoomFactor()
    this.creatingNewAnnotation = true
    this.canvas.appendChild(this.newAnnotation.dom)
  }

  mouseMove(event) {
    if (this.creatingNewAnnotation) {
      let newWidth = (this.canvas.parentNode.scrollLeft + event.offsetX - this.startPoint[0]) / canvasManager.getZoomFactor()
      let newHeight = (this.canvas.parentNode.scrollTop + event.offsetY - this.startPoint[1]) / canvasManager.getZoomFactor()
      if (newWidth < 0) {
        this.newAnnotation.left = (this.startPoint[0] + newWidth) / canvasManager.getZoomFactor()
      }
      if (newHeight < 0) {
        this.newAnnotation.top = (this.startPoint[1] + newHeight) / canvasManager.getZoomFactor()
      }
      this.newAnnotation.width = newWidth //Math.abs(newWidth)
      this.newAnnotation.height = newHeight //Math.abs(newHeight)
    }
  }
}

class SelectorTool extends Tool {
  constructor(canvas, annotations) {
    super(canvas, annotations)
    this.cursor = 'default'
    this.mode = 'default'
  }

  activate() {
    this.annotations.forEach(annotation => annotation.dom.style.pointerEvents = 'auto')
  }

  deactivate() {
    this.annotations.forEach(annotation => annotation.dom.style.pointerEvents = 'none')
  }

  mouseDown() {
    canvasManager.deselectAnnotations()
  }
}

module.exports = {
  RectangleTool: RectangleTool,
  SelectorTool: SelectorTool
}
