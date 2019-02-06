const remote = require('electron').remote
const canvasManager = require('./canvas_manager')
const annotations = []
const tools = require('./tools')


function loadImage() {
    remote.dialog.showOpenDialog(
        remote.getCurrentWindow(),
        {
            filters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif'] }],
            multipleSelections: false
        },
        filename => {
            if(filename) canvasManager.setImagePath(filename[0])
        }
    );
}

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas-container')
    const toolInstances = {
        rectangle : new tools.RectangleTool(canvas, annotations),
        selector : new tools.SelectorTool(canvas, annotations)
    }
    document.querySelector("#open-image-button").addEventListener('click', loadImage)
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
