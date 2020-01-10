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

function deleteTask (event) {
  const list = JSON.parse(
    localStorage.getItem(
      event.target.parentNode.parentNode.parentNode.id.slice(4)
    )
  )
  const tasks = list.todo
  for (const task of tasks) {
    if (task.id === Number(event.target.id.slice(2))) {
      tasks.splice(tasks.indexOf(task), 1)
    }
  }
  list.todo = tasks
  console.log(list)
  localStorage.setItem(
    event.target.parentNode.parentNode.parentNode.id.slice(4),
    JSON.stringify(list)
  )
  event.target.parentNode.parentNode.remove()
}

function textinput (event) {
  const list = JSON.parse(
    localStorage.getItem(
      event.target.parentNode.parentNode.parentNode.id.slice(4)
    )
  )
  const tasks = list.todo
  for (const task of tasks) {
    console.log(task.id, event.target.id.slice(2))
    if (task.id === Number(event.target.id.slice(2))) {
      task.note = event.target.value
      console.log(task)
    }
  }
  list.todo = tasks
  console.log(list)
  localStorage.setItem(
    event.target.parentNode.parentNode.parentNode.id.slice(4),
    JSON.stringify(list)
  )
  event.target.style.display = 'none'
}

function editTask (event) {
  console.log(event.target.parentNode.parentNode)
  let taskName = prompt(
    'Edit task',
    event.target.parentNode.parentNode.querySelector('span').innerText
  )
  if (taskName === null) {
    event.stopPropagation()
    return
  }
  if (taskName !== '') {
    event.target.parentNode.parentNode.querySelector(
      'span'
    ).innerText = taskName
    const list = JSON.parse(
      localStorage.getItem(
        event.target.parentNode.parentNode.parentNode.id.slice(4)
      )
    )
    const tasks = list.todo
    for (const task of tasks) {
      console.log(task.id, event.target.id.slice(2))
      if (task.id === Number(event.target.id.slice(2))) {
        task.name = taskName
      }
    }
    list.todo = tasks
    console.log(list)
    localStorage.setItem(
      event.target.parentNode.parentNode.parentNode.id.slice(4),
      JSON.stringify(list)
    )
  }
}

function showNote (event) {
  //show note id issue
  if (
    event.target.parentNode.querySelector('textarea').style.display === 'none'
  ) {
    const tasks = JSON.parse(
      localStorage.getItem(
        event.target.parentNode.parentNode.parentNode.id.slice(4)
      )
    ).todo
    for (const task of tasks) {
      if (task.id === Number(event.target.id.slice(2))) {
        event.target.parentNode.querySelector('textarea').value = task.note
      }
    }
    event.target.parentNode.querySelector('textarea').style.display = 'block'
  } else {
    event.target.parentNode.querySelector('textarea').style.display = 'none'
  }
}

function setPriority (event) {
  if (event.target.value === 'low') {
    event.target.parentNode.parentNode.style.color = 'whitesmoke'
  }
  if (event.target.value === 'medium') {
    event.target.parentNode.parentNode.style.color = '#c7822f'
  }
  if (event.target.value === 'high') {
    event.target.parentNode.parentNode.style.color = 'red'
  }
  const list = JSON.parse(
    localStorage.getItem(
      event.target.parentNode.parentNode.parentNode.id.slice(4)
    )
  )
  const tasks = list.todo
  for (const task of tasks) {
    if (task.id === Number(event.target.id.slice(2))) {
      task.priority = event.target.value
    }
  }
  list.todo = tasks
  console.log(list)
  localStorage.setItem(
    event.target.parentNode.parentNode.parentNode.id.slice(4),
    JSON.stringify(list)
  )
}

function rendertodo (id, todo, lastId) {
  document.getElementById('todo' + id).appendChild(
    createElement(
      'div',
      { id: `toct${lastId}`, className: `todo-container ${todo.priority}` },
      createElement(
        'div',
        {},
        createElement('input', { type: 'checkbox', name: 'todo-complete' })
      ),
      createElement('div', {}, createElement('span', {}, todo.name)),
      createElement(
        'div',
        { className: 'todo-operations' },
        createElement('i', {
          id: `cl${lastId}`,
          className: 'far fa-calendar'
        }),
        createElement('input', {
          id: `in${lastId}`,
          type: 'date',
          className: 'calendar'
        }),
        createElement('i', {
          id: `nt${lastId}`,
          className: 'far fa-clipboard',
          onclick: showNote
        }),
        createElement('textarea', {
          id: `no${lastId}`,
          onchange: textinput
        }),
        createElement('i', {
          id: `ed${lastId}`,
          className: 'far fa-edit',
          onclick: editTask
        }),
        createElement('i', {
          id: `ed${lastId}`,
          className: 'far fa-flag'
        }),
        createElement(
          'select',
          {
            id: `ed${lastId}`,
            className: 'dropdown',
            onclick: setPriority
          },
          createElement('option', {}, 'low'),
          createElement('option', {}, 'medium'),
          createElement('option', {}, 'high')
        ),
        createElement('i', {
          id: `ed${lastId}`,
          className: 'fas fa-trash-alt',
          onclick: deleteTask
        })
      )
    )
  )
}

function addtodo (event) {
  if (event.keyCode === 13) {
    if (event.target.value === '') return
    let todo = JSON.parse(localStorage.getItem(event.target.id.slice(4))).todo
    let lastId
    if (todo.length === 0) {
      lastId = 1
    } else {
      lastId = todo[todo.length - 1].id + 1
      console.log(lastId)
    }
    const newTodo = {
      id: lastId,
      name: event.target.value,
      scheduled: false,
      priority: 0,
      note: ''
    }
    rendertodo(event.target.id.slice(4), newTodo, lastId)
    event.target.value = ''
    const currentList = JSON.parse(
      localStorage.getItem(event.target.id.slice(4))
    )
    currentList.todo.push(newTodo)
    console.log(currentList)
    localStorage.setItem(event.target.id.slice(4), JSON.stringify(currentList))
  }
}

function showTask (event) {
  const id = event.target.id.slice(2)
  const todoContainer = document.getElementById('to' + id)
  if (document.getElementById(`todo${id}`) !== null) {
    document.getElementById(`todo${id}`).remove()
  } else {
    todoContainer.appendChild(
      createElement(
        'div',
        {
          id: `todo${id}`,
          className: 'todo'
        },
        createElement(
          'div',
          {},
          createElement('input', {
            id: `inpt${id}`,
            className: 'todo-input',
            type: 'text',
            placeholder: 'Add new todo',
            onkeydown: addtodo
          })
        )
      )
    )
    const todos = JSON.parse(localStorage.getItem(id)).todo
    for (const todo of todos) {
      rendertodo(id, todo, todo.id)
    }
  }
}

function deleteList (event) {
  document.getElementById('lc' + event.target.id.slice(2)).remove()
  localStorage.removeItem(event.target.id.slice(2))
  listIds.splice(listIds.indexOf(parseInt(event.target.id.slice(2))), 1)
  localStorage.setItem('listIds', JSON.stringify(listIds))
  event.stopPropagation()
}

function editList (event) {
  const listName = prompt(
    'Enter new name',
    document.getElementById(`hd${event.target.id.slice(2)}`).innerText
  )
  if (listName === null) {
    event.stopPropagation()
    return
  }
  if (listName !== '') {
    document.getElementById(
      `hd${event.target.id.slice(2)}`
    ).innerText = listName
    const newName = JSON.parse(localStorage.getItem(event.target.id.slice(2)))
    newName.name = listName
    localStorage.setItem(event.target.id.slice(2), JSON.stringify(newName))
  } else {
    alert("name can't be empty")
  }
  event.stopPropagation()
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
          className: 'list-header',
          onclick: showTask
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
      createElement('div', { id: `to${list.id}`, className: 'list-todos' })
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
  if (listName === null) return
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
