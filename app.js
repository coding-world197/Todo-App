// DOM Element References
const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');

// Load existing todos from LocalStorage
let todos = JSON.parse(localStorage.getItem('todos')) || [];

// Initial render
renderTodos();

// Event Listeners
addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTodo();
});

// Render todos on the screen
function renderTodos() {
  todoList.innerHTML = '';

  todos.forEach((todo, index) => {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;

    // Task Text
    const span = document.createElement('span');
    span.className = 'todo-text';
    span.textContent = todo.text;
    span.onclick = () => toggleComplete(index);

    // Action Buttons Container
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'actions';

    // Edit Button
    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.textContent = 'Edit';
    editBtn.onclick = () => editTodo(index);

    // Delete Button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => deleteTodo(index);

    // Assemble DOM
    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(deleteBtn);
    li.appendChild(span);
    li.appendChild(actionsDiv);
    todoList.appendChild(li);
  });
}

// Add task
function addTodo() {
  const text = todoInput.value.trim();
  if (text === '') return;

  todos.push({ text: text, completed: false });
  saveAndRender();
  todoInput.value = '';
}

// Edit task
function editTodo(index) {
  const currentText = todos[index].text;
  const newText = prompt('Edit your task:', currentText);

  // Update only if user enters non-empty text and doesn't click "Cancel"
  if (newText !== null && newText.trim() !== '') {
    todos[index].text = newText.trim();
    saveAndRender();
  }
}

// Toggle completion state
function toggleComplete(index) {
  todos[index].completed = !todos[index].completed;
  saveAndRender();
}

// Delete task
function deleteTodo(index) {
  todos.splice(index, 1);
  saveAndRender();
}

// Helper function to update LocalStorage and refresh DOM
function saveAndRender() {
  localStorage.setItem('todos', JSON.stringify(todos));
  renderTodos();
}