// select elements
const form = document.querySelector('form');
const clearAll = document.querySelector('.complete');
const input = document.getElementById('text');
const todolistContainer = document.querySelector('.todo-list');

let todoArr = JSON.parse(localStorage.getItem('TODO')) || [];
let editTodoId = -1;

// add to do
const addTodo = () => {
  const inputValue = input.value;

  // check if todo is empty
  const isempty = inputValue === '';
  if (isempty) {
    return;
  }
  if (editTodoId >= 0) {
    todoArr = todoArr.map((todo, index) => ({
      ...todo,
      description: index === editTodoId ? inputValue : todo.description
    }));
  } else {
    todoArr.push({
      description: inputValue,
      complete: false,
      index: todoArr.length + 1
    });
  }
  input.value = '';
};

// render todos function
const renderTodo = () => {
  // Clear render before a Re-render
  todolistContainer.innerHTML = '';

  // Render todos
  todoArr.forEach((todo, index) => {
    todolistContainer.innerHTML += `
  <div class="list" id=${index}>
  <input type="checkbox" data-action="checkbox">
    <p class="text" data-action="edit">${todo.description}</p>
    <i class="fa-regular fa-trash-can trash" data-action="delete" ></i>
</div>
  `;
  });
};

const indexUpdate = () => {
  for (let i = 0; i < todoArr.length; i += 1) {
    todoArr[i].index = i + 1;
  }
};

const pushToStorage = () => {
  localStorage.setItem('TODO', JSON.stringify(todoArr));
};

const editTodo = (todoId) => {
  input.value = todoArr[todoId].description;
  editTodoId = todoId;
};

const deleteTodo = (todoId) => {
  todoArr = todoArr.filter((todo, index) => index !== todoId);
  editTodoId = -1;
  renderTodo();
  indexUpdate();
  pushToStorage();
};

const checkValue = (box) => {
  if (box.checked) {
    return true;
  }
  return false;
};

function checkTodo(todoId, box) {
  box.nextElementSibling.classList.toggle('lineThrough');
  todoArr[todoId].complete = checkValue(box);
  if (todoArr[todoId].complete === true) {
    box.complete = true;
    box.nextElementSibling.classList.add('lineThrough');
  }
  pushToStorage();
}

const completeTodo = () => {
  todoArr = todoArr.filter((obj) => obj.complete !== true);
  renderTodo();
  indexUpdate();
  pushToStorage();
};

// form submit
form.addEventListener('submit', (Event) => {
  Event.preventDefault();
  addTodo();
  renderTodo();
  pushToStorage();
});

// Click event listener for all todos
todolistContainer.addEventListener('click', (event) => {
  const { target } = event;
  const parentElement = target.parentNode;

  if (parentElement.className !== 'list') return;

  // todo id
  const todo = parentElement;
  const todoId = Number(todo.id);

  // target action
  const { action } = target.dataset;

  if (action === 'edit') editTodo(todoId);
  if (action === 'delete') deleteTodo(todoId);
});

clearAll.addEventListener('click', () => {
  completeTodo();
});

todolistContainer.addEventListener('change', (event) => {
  const { target } = event;
  const parentElement = target.parentNode;
  if (!parentElement.classList.contains('list')) return;
  const todoId = Number(parentElement.id);
  // target the data action
  const { action } = target.dataset;

  if (action === 'checkbox') {
    checkTodo(todoId, target);
    checkValue(target);
  }
});

window.addEventListener('DOMContentLoaded', renderTodo);
