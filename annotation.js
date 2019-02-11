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
        this.dom.addEventListener('keypress', event => {
            if(event.charCode == 13) this.saveLabel(annotation)
        });
        this.dom.select()
        setTimeout(() => this.dom.focus(), 200)
        setTimeout(() => this.dom.addEventListener('blur', () => this.saveLabel(annotation)), 200)
    }
}

class Annotation {
    constructor() {
        const resizeTabTypes = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw']

        this.dom = document.createElement('div')
        this.dom.classList.add('annotation')

        this.labelElement = document.createElement('span')
        this.dom.appendChild(this.labelElement)
        this.labelElement.classList.add('label')
        this.resizeTabs = {}

        for(let resizeTabType of resizeTabTypes) {
            let tab = document.createElement('div')
            tab.classList.add('resize-tab')
            tab.classList.add(`${resizeTabType}-resize-tab`)
            tab.style.cursor = `${resizeTabType}-resize`
            tab.style.display = 'none'
            tab.addEventListener('mousedown', event => {
                this.grabPosition = [
                    event.offsetX + tab.offsetLeft + this.left, 
                    event.offsetY + tab.offsetTop + this.top
                ]
                this.originalPosition = [this.left, this.top]
                this.originalSize = [this.width, this.height]
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
            console.log('Hello!')
            this.editLabel()
            event.stopPropagation()
        })

        this.dom.addEventListener('mousedown', event => {
            if(!this.selected) {
                this.select()
            }
            this.grabPosition = [event.offsetX + this.left, event.offsetY + this.top]
            this.originalPosition = [this.left, this.top]
            this.interractionMode = 'move'
            canvasManager.disableAnnotations()
            canvasManager.pushEventListner(this)
        })
    }

    mouseMove(event) {
        let deviationX = event.offsetX - this.grabPosition[0]
        let deviationY = event.offsetY - this.grabPosition[1]
        if(this.interractionMode == "move") {
            this.left = this.originalPosition[0] + deviationX
            this.top = this.originalPosition[1] + deviationY
        } else {
            for(const char of this.interractionMode) {
                if(char == "s") {
                    this.height = this.originalSize[1] + deviationY
                }
                if(char == "e") {
                    this.width = this.originalSize[0] + deviationX
                }
                if(char == "n") {
                    this.top = this.originalPosition[1] + deviationY
                    this.height = this.originalSize[1] - deviationY
                }
                if(char == "w") {
                    this.left = this.originalPosition[0] + deviationX
                    this.width = this.originalSize[0] - deviationX
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
        if(!this.selected) return;
        const resizeTabTypes = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw']
        for(const tab of resizeTabTypes) {
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

    get data() {
        return {left: this.left, top:this.top, width: this.width, height: this.height, label: this.label}
    }
}

module.exports = {
    RectangleAnnotation : RectangleAnnotation
}
