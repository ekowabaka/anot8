const remote = require('electron').remote
const canvas = require('./canvas')

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
    canvas.setCanvasElement(document.getElementById("canvas"));
});
