const remote = require('electron').remote
const canvas = require('./canvas')
let toolbar, canvasElement

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
    document.querySelector("#zoom-in-button").addEventListener('click', () => canvas.zoom(+0.2))
    document.querySelector("#zoom-out-button").addEventListener('click', () => canvas.zoom(-0.2))
    toolbar = document.getElementById('toolbar')
    canvasElement = document.getElementById('canvas')
    canvas.setCanvasElement(canvasElement)
});
