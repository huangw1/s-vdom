/**
 * Created by huangw1 on 2018/4/16.
 */

import element from './src/element'
import diff from './src/diff'
import patch from './src/patch'

const tree = element('ul', { id: 'list' }, [
	element('li', { class: 'item'}, ['Item 1']),
	element('li', { class: 'item' }, ['Item 2']),
	element('li', { class: 'item' }, ['Item 3'])
])

const newTree = element('ul', { class: 'goods-list' }, [
	element('li', {id: 'first'}, ['Item 2']),
	element('li', ['Item 4']),
	element('li', ['Item 5']),
	element('li', ['Item 6']),
	element('li')
])

const patches = diff(tree, newTree)
console.log(patches)

const app = document.getElementById('app')
const dom = tree.render();
app.appendChild(dom);

setTimeout(() => {
	patch(dom, patches)
}, 1000)

