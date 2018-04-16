/**
 * Created by huangw1 on 2018/4/16.
 */

class Element {

	constructor(tagName, props, children) {
		if(Array.isArray(props)) {
			children = props
			props = {}
		}

		this.tagName = tagName
		this.props = props || {}
		this.key = this.props || undefined
		this.children = children || []

		let count = 0
		this.children.forEach((child, index) => {
			if(child instanceof Element) {
				count += child.count
			} else {
				this.children[index] = '' + child
			}
			count++
		})

		this.count = count
	}

	render() {
		const element = document.createElement(this.tagName)
		Object.keys(this.props).forEach((key) => {
			element.setAttribute(key, this.props[key])
		})

		this.children.forEach((child) => {
			child = child instanceof Element? child.render(): document.createTextNode(child)
			element.appendChild(child)
		})
		return element
	}
}

export default (...params) => {
	return new Element(...params)
}