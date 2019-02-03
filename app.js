const remote = require('electron').remote
const canvas = require('./canvas')
const annotations = []
const tools = require('./tools')
const toolInstances = {
    rectangle : new tools.RectangleTool(annotations),
    selector : new tools.SelectorTool(annotations)
}

function loadImage() {
    remote.dialog.showOpenDialog(
        remote.getCurrentWindow(),
        {
            filters: [
                { name: 'Images', extensions: ['jpg', 'png', 'gif'] }
            ],
            multipleSelections: false
        },
        filename => {
            canvas.setImage(filename[0])
        }
    );
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector("#open-image-button").addEventListener('click', loadImage)
    document.querySelectorAll("#toolbar > .tool").forEach(
        toolButton => 
            toolButton.addEventListener('click', () => {
                console.log(toolInstances[toolButton.getAttribute('tool-name')])
                canvas.setActiveTool(toolInstances[toolButton.getAttribute('tool-name')])
            })
        )
    toolbar = document.getElementById('toolbar')
    canvas.setCanvasContainer(document.getElementById('canvas-container'))
    canvas.setActiveTool(toolInstances.selector)
});
