'use strict'

const canvasManager = require('./canvas_manager')

class LabelEditor {
  constructor(label) {
    this.dom = document.createElement('input')
    this.dom.style.position = 'absolute'
    this.dom.classList.add('label-editor')
    this.label = label == "" ? "Blank Label" : label

  }

  saveLabel(annotation) {
    annotation.label = this.dom.value
    if (this.dom.parentNode.contains(this.dom)) {
      this.dom.parentNode.removeChild(this.dom)
    }
  }

  attach(annotation) {
    this.dom.style.left = annotation.displayLeft + 'px'
    this.dom.style.top = ((annotation.displayHeight / 2) - 13 + annotation.displayTop) + 'px'
    this.dom.style.width = annotation.displayWidth + 'px'
    this.dom.style.height = '26px'
    this.dom.value = this.label
    annotation.dom.parentNode.appendChild(this.dom)
    this.dom.addEventListener('keypress', event => {
      if (event.charCode == 13) {
        this.saveLabel(annotation)
      }
      event.stopPropagation()
    });
    this.dom.select()
    setTimeout(() => this.dom.focus(), 200)
    setTimeout(() => this.dom.addEventListener('blur', () => this.saveLabel(annotation)), 200)
  }
}

/**
 * Base class for all annotations
 */
class Annotation {
  constructor() {
    const resizeTabTypes = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw']

    this.dom = document.createElement('div')
    this.dom.setAttribute('tabindex', '-1')
    this.dom.classList.add('annotation')

    this.labelElement = document.createElement('span')
    this.dom.appendChild(this.labelElement)
    this.labelElement.classList.add('label')
    this.resizeTabs = {}
    this._zoomFactor = 1

    for (let resizeTabType of resizeTabTypes) {
      let tab = document.createElement('div')
      tab.classList.add('resize-tab')
      tab.classList.add(`${resizeTabType}-resize-tab`)
      tab.style.cursor = `${resizeTabType}-resize`
      tab.style.display = 'none'
      tab.addEventListener('mousedown', event => {
        this.grabPosition = [
          event.offsetX + tab.offsetLeft + this.displayLeft,
          event.offsetY + tab.offsetTop + this.displayTop
        ]
        this.originalPosition = [this.displayLeft, this.displayTop]
        this.originalSize = [this.displayWidth, this.displayHeight]
        this.interractionMode = resizeTabType
        canvasManager.disableAnnotations()
        canvasManager.pushEventListner(this)
        event.stopPropagation()
      })
      this.resizeTabs[resizeTabType] = tab
      this.dom.appendChild(tab)
    }

    this.selected = false

    this.labelElement.addEventListener('mousedown', event => {
      this.editLabel()
      event.stopPropagation()
    })

    this.dom.addEventListener('mousedown', event => {
      if (!this.selected) {
        this.select()
      }
      this.grabPosition = [event.offsetX + this.displayLeft, event.offsetY + this.displayTop]
      this.originalPosition = [this.displayLeft, this.displayTop]
      this.interractionMode = 'move'
      canvasManager.disableAnnotations()
      canvasManager.pushEventListner(this)
    })

    this.dom.addEventListener('keydown', event => {
      const increment = event.shiftKey ? 1 : 10
      if(event.keyCode == 39) {
        this.left += increment / this.zoomFactor
        event.preventDefault()
      } else if (event.keyCode == 37) {
        this.left -= increment / this.zoomFactor
        event.preventDefault()
      } else if (event.keyCode == 38) {
        this.top -= increment / this.zoomFactor
        event.preventDefault()
      } else if (event.keyCode ==40) {
        this.top += increment / this.zoomFactor
        event.preventDefault()
      } else if (event.key == "Escape") {
        canvasManager.deselectAnnotations()
        event.preventDefault()
      } else if (event.key == "Delete") {
        canvasManager.deleteSelectedAnnotations()
        event.preventDefault()
      }
    })
  }

  mouseMove(event) {
    let deviationX = event.offsetX - this.grabPosition[0]
    let deviationY = event.offsetY - this.grabPosition[1]
    if (this.interractionMode == "move") {
      this.left = (this.originalPosition[0] + deviationX) / this.zoomFactor
      this.top = (this.originalPosition[1] + deviationY) / this.zoomFactor
    } else {
      for (const char of this.interractionMode) {
        if (char == "s") {
          this.height = (this.originalSize[1] + deviationY) / this.zoomFactor
        }
        if (char == "e") {
          this.width = (this.originalSize[0] + deviationX) / this.zoomFactor
        }
        if (char == "n") {
          this.top = (this.originalPosition[1] + deviationY) / this.zoomFactor
          this.height = (this.originalSize[1] - deviationY) / this.zoomFactor
        }
        if (char == "w") {
          this.left = (this.originalPosition[0] + deviationX) / this.zoomFactor
          this.width = (this.originalSize[0] - deviationX) / this.zoomFactor
        }
      }
      this.repositionTabs()
    }
  }

  mouseUp(event) {
    canvasManager.popEventListener()
    canvasManager.enableAnnotations()
  }

  repositionTabs() {
    const resizeTabPositions = {
      n: [-6, this.displayWidth / 2 - 6, this.nResize],
      s: [this.displayHeight - 6, this.displayWidth / 2 - 6, this.sResize],
      e: [this.displayHeight / 2 - 6, this.displayWidth - 6, this.eResize],
      w: [this.displayHeight / 2 - 6, -6, this.wResize],
      ne: [-6, this.displayWidth - 6, this.neResize],
      nw: [-6, -6, this.nwResize],
      se: [this.displayHeight - 6, this.displayWidth - 6, this.seResize],
      sw: [this.displayHeight - 6, -6, this.nResize],
    }

    for (const tab in resizeTabPositions) {
      this.resizeTabs[tab].style.top = resizeTabPositions[tab][0] + 'px'
      this.resizeTabs[tab].style.left = resizeTabPositions[tab][1] + 'px'
      this.resizeTabs[tab].style.display = 'block'
    }
  }

  select() {
    canvasManager.deselectAnnotations()
    this.repositionTabs()
    this.dom.style.cursor = 'move'
    this.selected = true
    canvasManager.addSelectedAnnotation(this)
    this.dom.classList.add('selected')
  }

  deselect() {
    if (!this.selected) return;
    const resizeTabTypes = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw']
    for (const tab of resizeTabTypes) {
      this.resizeTabs[tab].style.display = 'none'
    }
    this.selected = false
    this.dom.style.cursor = 'default'
    this.dom.classList.remove('selected')
    canvasManager.removeSelectedAnnotation(this)
  }

  editLabel() {
    const labelEditor = new LabelEditor(this.label)
    labelEditor.attach(this)
  }

  delete () {
    this.dom.parentNode.removeChild(this.dom)
  }

  get zoomFactor() {
    return this._zoomFactor
  }

  set zoomFactor(value) {
    this._zoomFactor = value
    this.redraw()
    if(this.selected) {
      this.repositionTabs()
    }
  }

  redraw() {
    throw new Error("Please implement redraw for annotation type")
  }
}

class RectangleAnnotation extends Annotation {
  constructor(left, top, width, height) {
    super()
    this.shape = {left: 0, top: 0, width: 0, height: 0}
    this.left = left
    this.top = top
    this.width = width ? width : 0
    this.height = height ? height : 0
    this.label = ""
  }

  set label(value) {
    this.labelElement.innerHTML = value
  }

  get label() {
    return this.labelElement.innerHTML
  }

  set left(value) {
    this.shape.left = value
    this.dom.style.left = this.displayLeft + 'px'
  }

  get left() {
    return this.shape.left
  }

  set top(value) {
    this.shape.top = value
    this.dom.style.top = this.displayTop + 'px'
  }

  get top() {
    return this.shape.top
  }

  set width(value) {
    this.shape.width = value
    this.dom.style.width = this.displayWidth + 'px'
  }

  get width() {
    return this.shape.width
  }

  set height(value) {
    this.shape.height = value
    this.dom.style.height = this.displayHeight + 'px'
  }

  get height() {
    return this.shape.height
  }

  get displayWidth() {
    return this.shape.width * this.zoomFactor
  }

  get displayHeight() {
    return this.shape.height * this.zoomFactor
  }

  get displayTop() {
    return this.shape.top * this.zoomFactor
  }

  get displayLeft() {
    return this.shape.left * this.zoomFactor
  }

  get data() {
    return {
      left: this.left,
      top: this.top,
      width: this.width,
      height: this.height,
      label: this.label,
      type: 'rectangle'
    }
  }

  redraw() {
    this.dom.style.left = this.displayLeft + 'px'
    this.dom.style.top = this.displayTop + 'px'
    this.dom.style.width = this.displayWidth + 'px'
    this.dom.style.height = this.displayHeight + 'px'
  }
}

function getAnnotationObject(object) {
  let annotation

  switch (object.type) {
    case "rectangle":
      annotation = new RectangleAnnotation(object.left, object.top, object.width, object.height)
      annotation.label = object.label
      break;
  }

  return annotation
}

module.exports = {
  RectangleAnnotation: RectangleAnnotation,
  getAnnotationObject: getAnnotationObject
}
