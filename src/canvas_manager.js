/**
 * Maintains the image and all the annotations on it in a manner analagous to a canvas.
 * @todo Look at prospects of converting this to a web component.
 */

'use strict'

let canvas
let activeTool
let annotations = []
let selectedAnnotations = []
let zoomFactor = 0.25
let imageSize
let eventListeners = []

let image
let defaultTool

function setCanvasContainer(element) {
  canvas = element;
}


/**
 * Loads a new image unto the canvas.
 * Called when either an annotation is opened, or a new annotation is created.
 * 
 * @param string path 
 */
function setImagePath(path) {
  if(image) {
    canvas.removeChild(image)
  }
  image = document.createElement('img')
  image.draggable = false
  canvas.appendChild(image)

  image.addEventListener('mousedown', event => {
    eventListeners[0].mouseDown(event)
  });

  image.addEventListener('mouseup', event => {
    eventListeners[0].mouseUp(event)
  });

  image.addEventListener('mousemove', event => {
    eventListeners[0].mouseMove(event)
  });

  image.src = path
  return new Promise(function(resolve, reject) {
    image.addEventListener('load', () => {
      imageSize = [image.width, image.height]
      annotations.forEach(annotation => annotation.delete())
      annotations = []    
      console.log('cleared all annotations')
      setActiveTool(defaultTool)
      fitWidth()    
      resolve()
    })
  })
}
/**
 * Get the image currently on the canvas.
 */
function getImage() {
  return image
}

function zoom(level) {
  zoomFactor = level
  image.width = imageSize[0] * zoomFactor;
  image.height = imageSize[1] * zoomFactor;
  annotations.forEach(annotation => annotation.zoomFactor = zoomFactor)
}

function zoomIn() {
  zoom(zoomFactor * 1.1)
}

function zoomOut() {
  zoom(zoomFactor * 0.9)
}

function fitWidth() {
  if (canvas.offsetWidth > canvas.offsetHeight) {
    zoom(canvas.offsetWidth / imageSize[0])
  } else {
    zoom(canvas.offsetHeight / imageSize[1])
  }
}

function setActiveTool(tool) {
  if (activeTool) {
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

function getSelectedAnnotations() {
  return selectedAnnotations;
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

function addAnnotation(annotation) {
  annotation.zoomFactor = zoomFactor
  annotations.push(annotation)
  canvas.appendChild(annotation.dom)
}

function deleteSelectedAnnotations() {
  selectedAnnotations.forEach(annotation => {
    annotations.splice(annotations.indexOf(annotation), 1)
    annotation.delete()
  })
  selectedAnnotations = []
}

module.exports = {
  setCanvasContainer: setCanvasContainer,
  getCanvasContainer: getCanvasContainer,
  setImagePath: setImagePath,
  getImage: getImage,
  setActiveTool: setActiveTool,
  pushEventListner: pushEventListner,
  popEventListener: popEventListener,
  getAnnotations: getAnnotations,
  getSelectedAnnotations: getSelectedAnnotations,
  addAnnotation: addAnnotation,
  disableAnnotations: disableAnnotations,
  enableAnnotations: enableAnnotations,
  addSelectedAnnotation: addSelectedAnnotation,
  removeSelectedAnnotation: removeSelectedAnnotation,
  deselectAnnotations: deselectAnnotations,
  deleteSelectedAnnotations : deleteSelectedAnnotations,
  zoomIn: zoomIn,
  zoomOut: zoomOut,
  getZoomFactor : () => zoomFactor,
  setDefaultTool : tool => {defaultTool = tool}
}
