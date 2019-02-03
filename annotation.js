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

class RectangleAnnotation {
    constructor (left, top, width, height) {
        this.dom = document.createElement('div')
        this.dom.classList.add('annotation')
        this.labelDom = document.createElement('span')
        this.dom.appendChild(this.labelDom)
        this.left = left
        this.top = top
        this.width = width ? width : 0
        this.height = height ? height : 0
        this.label = ""
    }

    set label(value) {
        this.labelDom.innerHTML = value
    }

    get label() {
        return this.labelDom.innerHTML
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
