const addList = document.getElementById('add-list')
const mainContainer = document.getElementById('app-main-container')

const listIds = window.localStorage.getItem('listIds')
  ? JSON.parse(window.localStorage.getItem('listIds'))
  : []

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

// for displaying all list after loading
function showAllList () {
  for (const listId of listIds) {
    renderList(JSON.parse(window.localStorage.getItem(listId)))
  }
}

// to delete list
function deleteList (event) {
  document.getElementById('lc' + event.target.id.slice(2)).remove()
  window.localStorage.removeItem(event.target.id.slice(2))
  listIds.splice(listIds.indexOf(parseInt(event.target.id.slice(2))), 1)
  window.localStorage.setItem('listIds', JSON.stringify(listIds))
  event.stopPropagation()
}

// to edit list
function editList (event) {
  event.target.parentNode.parentNode.querySelector('input').className = 'list-input-edit-active'
  event.target.parentNode.parentNode.querySelector('input').onclick = (event) => event.stopPropagation()
  event.target.parentNode.parentNode.querySelector('input').disabled = false
  event.stopPropagation()
}

function updateList (event) {
  if (event.keyCode === 13) {
    if (event.target.value === '') return
    event.target.disabled = true
    event.target.className = 'list-input-edit'
    const list = JSON.parse(
      window.localStorage.getItem(
        event.target.id.slice(2)
      )
    )
    list.name = event.target.value
    window.localStorage.setItem(
      event.target.id.slice(2),
      JSON.stringify(list)
    )
  }
}
// to render list
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
        createElement('input', { id: `hd${list.id}`, className: 'list-input-edit', type: 'text', disabled: 'disabled', value: list.name, onkeydown: updateList }),
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

// to render todos
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
      createElement('div', {}, createElement('input', { id: `tx${lastId}`, type: 'text', value: todo.name, className: 'task-input', disabled: 'disabled', onkeydown: updateTask })),
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

// for adding tasks
function addtodo (event) {
  if (event.keyCode === 13) {
    if (event.target.value === '') return
    const todo = JSON.parse(window.localStorage.getItem(event.target.id.slice(4))).todo
    let lastId
    if (todo.length === 0) {
      lastId = 1
    } else {
      lastId = todo[todo.length - 1].id + 1
    }
    // creating new todo object
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
      window.localStorage.getItem(event.target.id.slice(4))
    )
    currentList.todo.push(newTodo)
    window.localStorage.setItem(event.target.id.slice(4), JSON.stringify(currentList))
  }
}

// for editing task
function editTask (event) {
  event.target.parentNode.parentNode.querySelectorAll('input')[1].disabled = false
  event.target.parentNode.parentNode.querySelectorAll('input')[1].className = 'task-input-edit'
}

function deleteTask (event) {
  const list = JSON.parse(
    window.localStorage.getItem(
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
  window.localStorage.setItem(
    event.target.parentNode.parentNode.parentNode.id.slice(4),
    JSON.stringify(list)
  )
  event.target.parentNode.parentNode.remove()
}

function textinput (event) {
  const list = JSON.parse(
    window.localStorage.getItem(
      event.target.parentNode.parentNode.parentNode.id.slice(4)
    )
  )
  const tasks = list.todo
  for (const task of tasks) {
    if (task.id === Number(event.target.id.slice(2))) {
      task.note = event.target.value
    }
  }
  list.todo = tasks
  window.localStorage.setItem(
    event.target.parentNode.parentNode.parentNode.id.slice(4),
    JSON.stringify(list)
  )
  event.target.style.display = 'none'
}

function updateTask (event) {
  if (event.keyCode === 13) {
    if (event.target.value === '') return
    event.target.disabled = true
    event.target.className = 'task-input'
    const list = JSON.parse(
      window.localStorage.getItem(
        event.target.parentNode.parentNode.parentNode.id.slice(4)
      )
    )
    const tasks = list.todo
    for (const task of tasks) {
      if (task.id === Number(event.target.id.slice(2))) {
        task.name = event.target.value
      }
    }
    list.todo = tasks
    window.localStorage.setItem(
      event.target.parentNode.parentNode.parentNode.id.slice(4),
      JSON.stringify(list)
    )
  }
}

function showNote (event) {
  if (
    event.target.parentNode.querySelector('textarea').style.display === 'none'
  ) {
    const tasks = JSON.parse(
      window.localStorage.getItem(
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
    event.target.parentNode.parentNode.style.color = 'rgb(189,60,60)'
  }
  const list = JSON.parse(
    window.localStorage.getItem(
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
  window.localStorage.setItem(
    event.target.parentNode.parentNode.parentNode.id.slice(4),
    JSON.stringify(list)
  )
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
    const todos = JSON.parse(window.localStorage.getItem(id)).todo
    for (const todo of todos) {
      rendertodo(id, todo, todo.id)
    }
  }
}

showAllList()

addList.addEventListener('click', event => {
  event.target.parentNode.parentNode.querySelector('input').addEventListener('keydown', (event) => {
    if (event.keyCode === 13) {
      if (event.target.value === '') {
        event.target.parentNode.parentNode.querySelector('input').style.display = 'none'
        return
      }
      const newList = {
        id: !listIds.length ? 1 : listIds[listIds.length - 1] + 1,
        name: event.target.value,
        todo: []
      }
      event.target.value = ''
      listIds.push(newList.id)
      window.localStorage.setItem('listIds', JSON.stringify(listIds))
      window.localStorage.setItem(newList.id, JSON.stringify(newList))
      renderList(newList)
      event.target.parentNode.parentNode.querySelector('input').style.display = 'none'
    }
  })
  event.target.parentNode.parentNode.querySelector('input').style.display = 'block'
})
