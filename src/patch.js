/**
 * Created by huangw1 on 2018/4/16.
 */

import { isString } from './util'

export const types = {
	TEXT: 'TEXT',
	PROPS: 'PROPS',
	REPLACE: 'REPLACE',
	REMOVE: 'REMOVE',
	INSERT: 'INSERT'
}

const applyProps = (node, props) => {
	Object.keys(props).forEach((key) => {
		if(!props[key]) {
			node.removeAttribute(key)
		} else {
			node.setAttribute(key, props[key])
		}
	})
}

const applyPatches = (node, currentPatches) => {
	let removeCount = 0
	currentPatches.forEach((currentPatch) => {
		switch(currentPatch.type) {
			case types.REPLACE:
				{
					const newNode = isString(currentPatch.node)? document.createTextNode(currentPatch.node): currentPatch.node.render()
					node.parentNode.replaceChild(newNode, node)
				}
				break

			case types.INSERT:
				{
					const newNode = isString(currentPatch.node)? document.createTextNode(currentPatch.node): currentPatch.node.render()
					node.parentNode.appendChild(newNode)
				}
				break

			case types.REMOVE:
				const removeIndex = currentPatch.index - removeCount
				node.removeChild(node.childNodes[removeIndex])
				removeCount++
				break

			case types.TEXT:
				node.textContent = currentPatch.content
				break

			case types.PROPS:
				applyProps(node, currentPatch.props);
				break
			default:
				throw "未知类型: " + currentPatch.type

		}
	})
}

const walkTree = (node, walker, patches) => {
	const currentPatches = patches[walker.index]
	const childNodes = node.childNodes
	if(childNodes) {
		Array.from(childNodes).forEach((childNode) => {
			walker.index++
			walkTree(childNode, walker, patches)
		})
	}

	if(currentPatches) {
		applyPatches(node, currentPatches)
	}
}

export default (node, patches) => {
	const walker = {
		index: 0
	}
	walkTree(node, walker, patches)
}