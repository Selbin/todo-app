const addList = document.getElementById('add-list')
const btngrp = document.getElementById('btn-grp')
const allList = document.getElementsByClassName('card-items')

function createElement (type, props, ...children) {
  const dom = document.createElement(type)
  if (props) Object.assign(dom, props)
  for (const child of children) {
    if (typeof child !== 'string') dom.appendChild(child)
    else dom.appendChild(document.createTextNode(child))
  }
  return dom
}
addList.addEventListener('click', event => {
  const listName = prompt('Enter List name')
  if (listName !== '') {
    const container = document.getElementsByClassName('list-container')
    container[0].appendChild(
      createElement(
        'div',
        { className: 'card-items' },
        listName,
        createElement('i', {
          id: 1,
          className: 'fas fa-trash-alt right',
          onclick: event => {
            event.target.parentNode.parentNode.removeChild(
              event.target.parentNode
            )
          }
        })
      )
    )
    return
  }
  alert("List name shoudn't be empty!!")
})

/* allList.addEventListener('dblclick',event => {
  alert("hi")
}) */

btngrp.addEventListener('click', event => {
  console.log(event.target)
  event.target.className = 'btn-grp'
})
