class RectangleAnnotation {
    constructor (left, top, width, height) {
        this.dom = document.createElement('div')
        this.dom.classList.add('annotation')
        this.left = left
        this.top = top
        this.width = width ? width : 0
        this.height = height ? height : 0
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

    set height(value) {
        this.dom.style.height = value + 'px'
    }

    edit() {
        
    }
}

module.exports = {
    RectangleAnnotation : RectangleAnnotation
}