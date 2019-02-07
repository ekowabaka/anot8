const canvasManager = require('./canvas_manager')

class LabelEditor {
    constructor(label) {
        this.dom = document.createElement('input')
        this.dom.style.position = 'absolute'
        this.dom.classList.add('label-editor')
        this.label = label == "" ? "Blank Label" : label

    }

    saveLabel (annotation) {
        annotation.label = this.dom.value
        this.dom.parentNode.removeChild(this.dom)    
    }

    attach(annotation) {
        this.dom.style.left = annotation.left + 'px'
        this.dom.style.top = ((annotation.height / 2) - 13 + annotation.top) + 'px'
        this.dom.style.width = annotation.width + 'px'
        this.dom.style.height = '26px'
        this.dom.value = this.label
        annotation.dom.parentNode.appendChild(this.dom)
        this.dom.addEventListener('blur', () => this.saveLabel(annotation))
        this.dom.addEventListener('keypress', event => {
            if(event.charCode == 13) this.saveLabel(annotation)
        });
        this.dom.select()
        this.dom.focus()
    }
}

class Annotation {
    constructor() {
        const resizeTabTypes = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw']

        this.dom = document.createElement('div')
        this.dom.classList.add('annotation')

        this.labelElement = document.createElement('span')
        this.dom.appendChild(this.labelElement)
        this.resizeTabs = {}

        for(let resizeTabType of resizeTabTypes) {
            let tab = document.createElement('div')
            tab.classList.add('resize-tab')
            tab.classList.add(`${resizeTabType}-resize-tab`)
            tab.style.cursor = `${resizeTabType}-resize`
            this.resizeTabs[resizeTabType] = tab
        }

        this.selected = false

        this.dom.addEventListener('mousedown', event => {
            if(!this.selected) {
                this.select()
            }
            this.grabPosition = [event.offsetX + this.left, event.offsetY + this.top]
            this.originalPosition = [this.left, this.top]
            canvasManager.disableAnnotations()
            canvasManager.pushEventListner(this)
        })
    }

    mouseMove(event) {
        this.left = this.originalPosition[0] + event.offsetX - this.grabPosition[0]
        this.top = this.originalPosition[1] + event.offsetY - this.grabPosition[1]
    }

    mouseUp(event) {
        canvasManager.popEventListener()
        canvasManager.enableAnnotations()
    }

    select() {
        const resizeTabPositions = {
            n : [-6, this.width / 2 - 6, this.nResize],
            s : [this.height - 6, this.width / 2 - 6, this.sResize],
            e : [this.height / 2 - 6, this.width - 6, this.eResize],
            w : [this.height / 2 - 6, -6, this.wResize],
            ne : [-6, this.width - 6, this.neResize],
            nw : [-6, -6, this.nwResize],
            se : [this.height - 6, this.width - 6, this.seResize],
            sw : [this.height - 6, -6, this.nResize],
        }

        for(const tab in resizeTabPositions) {
            this.resizeTabs[tab].style.top = resizeTabPositions[tab][0] + 'px'
            this.resizeTabs[tab].style.left = resizeTabPositions[tab][1] + 'px'
            this.dom.appendChild(this.resizeTabs[tab])
        }

        this.dom.style.cursor = 'move'
        this.selected = true
    }
}

class RectangleAnnotation extends Annotation {
    constructor (left, top, width, height) {     
        super()   
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
        this.dom.style.left = value + 'px'
    }

    get left() {
        return this.dom.offsetLeft
    }

    set top(value) {
        this.dom.style.top = value + 'px'
    }

    get top() {
        return this.dom.offsetTop
    }

    set width(value) {
        this.dom.style.width = value + 'px'
    }

    get width() {
        return this.dom.getBoundingClientRect().width
    }

    set height(value) {
        this.dom.style.height = value + 'px'
    }

    get height() {
        return this.dom.getBoundingClientRect().height
    }

    editLabel() {
        const labelEditor = new LabelEditor(this.label)
        labelEditor.attach(this)
    }
}

module.exports = {
    RectangleAnnotation : RectangleAnnotation
}
