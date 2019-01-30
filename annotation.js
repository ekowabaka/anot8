class Rectangle {
    constructor (left, top, width, height) {
        this.dom = document.createElement('div')
        this.dom.classList.add('annotation')
        this.left = left
        this.top = top
        this.width = width ? width : 10
        this.height = height ? height : 10
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
}

module.exports = {
    Rectangle : Rectangle
}