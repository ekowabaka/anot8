const remote = require('electron').remote
const canvasManager = require('./canvas_manager')
const tools = require('./tools')
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
            }
        }
    );
}

function saveAnnoations() {
    console.log(JSON.stringify(canvasManager.getAnnotations().map(annotation => annotation.data)))
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
