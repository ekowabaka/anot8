const remote = require('electron').remote
const canvasManager = require('./canvas_manager')
const tools = require('./tools')
const annotations = require('./annotations')
const fs = require('fs')
let currentFile = null


function loadImage() {
    remote.dialog.showOpenDialog(
        remote.getCurrentWindow(),
        {
            filters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif'] }],
            multipleSelections: false
        },
        filename => {
            if(filename) {
                canvasManager.setImagePath(filename[0])
                currentFile = filename[0]
                fs.readFile(currentFile + '.anot8', (err, contents) => {
                    const annotationsFromFile = JSON.parse(contents)
                    annotationsFromFile.forEach(annotation => canvasManager.addAnnotation(annotations.getAnnotationObject(annotation)))
                })
            }
        }
    );
}

function saveAnnoations() {
    let annotations = JSON.stringify(canvasManager.getAnnotations().map(annotation => annotation.data))
    fs.writeFile(currentFile + '.anot8', annotations, err => {
        if(err) alert("Failed to save annotations")
    })
}

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas-container')
    const toolInstances = {
        rectangle : new tools.RectangleTool(canvas),
        selector : new tools.SelectorTool(canvas)
    }
    document.querySelector("#open-image-button").addEventListener('click', loadImage)
    document.querySelector("#save-image-button").addEventListener('click', saveAnnoations)
    document.querySelectorAll("#toolbar > .tool").forEach(
        toolButton => 
            toolButton.addEventListener('click', () => {
                canvasManager.setActiveTool(toolInstances[toolButton.getAttribute('tool-name')])
            })
        )
    toolbar = document.getElementById('toolbar')
    canvasManager.setCanvasContainer(canvas)
    canvasManager.setActiveTool(toolInstances.selector)
});
