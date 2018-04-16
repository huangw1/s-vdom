/**
 * Created by huangw1 on 2018/4/16.
 */

import { isString } from './util'
import { types } from './patch'

const diffProps = (oldNode, newNode) => {
	let index = 0
	const oldProps = oldNode.props
	const newProps = newNode.props
	const propsPatches = {}

	Object.keys(oldProps).forEach((key) => {
		if(newProps[key] != oldNode[key]) {
			propsPatches[key] = newProps[key];
			index++
		}
	})

	Object.keys(newProps).forEach((key) => {
		if(!oldNode.hasOwnProperty(key)) {
			propsPatches[key] = newProps[key];
			index++
		}
	})

	if(!index) {
		return null
	}
	return propsPatches
}

const diffChildren = (oldChildren, newChildren, index, patches, currentPatch) => {
	let prevNode = null
	let currentIndex = index
	oldChildren.forEach((child, index) => {
		const newChild = newChildren[index]
		if(newChild) {
			currentIndex = (prevNode && prevNode.count)? (currentIndex + prevNode.count + 1): (currentIndex + 1)
			walkNode(child, newChild, currentIndex, patches)
			prevNode = child
		} else {
			currentPatch.push({
				type: types.REMOVE,
				index
			})
		}
	})

	if(oldChildren.length < newChildren.length) {
		let index = oldChildren.length
		while(index < newChildren.length) {
			const child = newChildren[index]
			currentPatch.push({
				type: types.INSERT,
				node: child
			})
			index++
		}
	}
}

const walkNode = (oldNode, newNode, index, patches) => {
	const currentPatch = []
	if(newNode == null) {
		// nothing
	} else if (isString(oldNode) && isString(newNode)) {
		if(oldNode != newNode) {
			currentPatch.push({
				type: types.TEXT,
				content: newNode
			})
		}
	} else if(oldNode.tagName == newNode.tagName) {
		const propsPatches = diffProps(oldNode, newNode)
		if(propsPatches) {
			currentPatch.push({
				type: types.PROPS,
				props: propsPatches
			})
		}
		// 深度优先
		diffChildren(oldNode.children, newNode.children, index, patches, currentPatch)
	} else {
		currentPatch.push({
			type: types.REPLACE,
			node: newNode
		})
	}

	if (currentPatch.length) {
		patches[index] = currentPatch
	}
}

export default (oldNode, newNode) => {
	let index = 0
	const patches = {}
	walkNode(oldNode, newNode, index, patches)
	return patches
}