'use strict'

const {remote, clipboard} = require('electron')
const fs = require('fs')

const canvasManager = require('../../src/canvas_manager')
const tools = require('../../src/tools')
const annotations = require('../../src/annotations')

let currentFile = null


function loadImage() {
  remote.dialog.showOpenDialog(
    remote.getCurrentWindow(),
    {
      filters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif', 'webp'] }],
      multipleSelections: false
    }
  ).then(
    response => {
      if (!response.canceled) {
        canvasManager.setImagePath(response.filePaths[0]).then(() => {
          currentFile = response.filePaths[0]
          const jsonFile = currentFile + '.anot8'
          fs.readFile(jsonFile, (err, contents) => {
            if (err) return;
            try {
              const annotationsFromFile = JSON.parse(contents)
              annotationsFromFile.forEach(annotation => canvasManager.addAnnotation(annotations.getAnnotationObject(annotation)))  
              canvasManager.enableAnnotations()
            } catch (e) {
              alert(`The annotation file ${jsonFile} is corrupt`)
            }
          })  
        })
      }
    }
  ).catch(err => console.log(err));
}

function saveAnnoations() {
  let annotations = JSON.stringify(canvasManager.getAnnotations().map(annotation => annotation.data))
  fs.writeFile(currentFile + '.anot8', annotations, err => {
    if (err) alert("Failed to save annotations")
  })
}

function copyAnnotations() {
  let selectedAnnotations = canvasManager.getSelectedAnnotations().map(annotation => annotation.data)
  selectedAnnotations = {type: 'annotations', data: selectedAnnotations}
  clipboard.writeText(JSON.stringify(selectedAnnotations))
}

function pasteAnnotations() {
  let readAnnotations = clipboard.readText()
  try{
    readAnnotations = JSON.parse(readAnnotations)
  } catch (e) { }
  console.log(readAnnotations)
  if(readAnnotations.type == 'annotations') {
    readAnnotations.data.forEach(annotation => canvasManager.addAnnotation(annotations.getAnnotationObject(annotation)))  
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('canvas-container')
  const toolInstances = {
    rectangle: new tools.RectangleTool(canvas),
    selector: new tools.SelectorTool(canvas)
  }
  document.querySelector("#open-image-button").addEventListener('click', loadImage)
  document.querySelector("#save-image-button").addEventListener('click', saveAnnoations)
  document.querySelector('#zoom-in-button').addEventListener('click', canvasManager.zoomIn)
  document.querySelector('#zoom-out-button').addEventListener('click', canvasManager.zoomOut)
  document.querySelectorAll("#toolbar > .tool").forEach(
    toolButton =>
      toolButton.addEventListener('click', () => {
        canvasManager.setActiveTool(toolInstances[toolButton.getAttribute('tool-name')])
      })
  )
  document.addEventListener('paste', event => {
    pasteAnnotations()
  });
  document.addEventListener('copy', event => {
    copyAnnotations()
  });
  toolbar = document.getElementById('toolbar')
  canvasManager.setCanvasContainer(canvas)
  canvasManager.setDefaultTool(toolInstances.selector)
});
