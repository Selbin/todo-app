const addList = document.getElementById('add-list')
const mainContainer = document.getElementById('app-main-container')

let listIds = localStorage.getItem('listIds')
  ? JSON.parse(localStorage.getItem('listIds'))
  : []

function showAllList () {
  for (const listId of listIds) {
    renderList(JSON.parse(localStorage.getItem(listId)))
  }
}
function deleteList (event) {
  document.getElementById('lc' + event.target.id.slice(2)).remove()
  localStorage.removeItem(event.target.id.slice(2))
  listIds.splice(listIds.indexOf(parseInt(event.target.id.slice(2))), 1)
  localStorage.setItem('listIds', JSON.stringify(listIds))
}
function editList (event) {
  const listName = prompt(
    'Enter new name',
    document.getElementById(`hd${event.target.id.slice(2)}`).innerText
  )
  if (listName !== '') {
    document.getElementById(`hd${event.target.id.slice(2)}`).innerText = listName
    const newName = JSON.parse(localStorage.getItem(event.target.id.slice(2)))
    newName.name = listName
    localStorage.setItem(event.target.id.slice(2), JSON.stringify(newName))
  } else {
    alert("name can't be empty")
  }
}

showAllList()

function renderList (list) {
  mainContainer.appendChild(
    createElement(
      'div',
      {
        id: `lc${list.id}`,
        className: 'list-container'
      },
      createElement(
        'div',
        {
          id: `lh${list.id}`,
          className: 'list-header'
        },
        createElement('h3', { id: `hd${list.id}` }, list.name),
        createElement(
          'div',
          {
            className: 'list-operations'
          },
          createElement('i', {
            id: `ed${list.id}`,
            className: 'far fa-edit',
            onclick: editList
          }),
          createElement('i', {
            id: `dl${list.id}`,
            className: 'fas fa-trash-alt',
            onclick: deleteList
          })
        )
      ),
      createElement('div', { className: 'list-todos' })
    )
  )
}

// function to create elements
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
    const newList = {
      id: listIds.length === 0 ? 1 : listIds[listIds.length - 1] + 1,
      name: listName,
      todo: []
    }
    listIds.push(newList.id)
    localStorage.setItem('listIds', JSON.stringify(listIds))
    localStorage.setItem(newList.id, JSON.stringify(newList))
    renderList(newList)
  }
})
