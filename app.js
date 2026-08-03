        let tasks = JSON.parse(localStorage.getItem('tasks')) || [
            { id: 1, text: 'Design new UI components 🎨', completed: true },
            { id: 2, text: 'Record Todo App screen demo 🎬', completed: false },
            { id: 3, text: 'Post project video on LinkedIn 🚀', completed: false }
        ];
        let currentFilter = 'all';
        let editingTaskId = null;

        document.addEventListener('DOMContentLoaded', () => {
            updateDate();
            renderTasks();
        });

        function updateDate() {
            const options = { weekday: 'short', month: 'short', day: 'numeric' };
            const today = new Date();
            document.getElementById('currentDate').textContent = today.toLocaleDateString('en-US', options);
        }

        function renderTasks() {
            const taskList = document.getElementById('taskList');
            taskList.innerHTML = '';

            const filteredTasks = tasks.filter(task => {
                if (currentFilter === 'active') return !task.completed;
                if (currentFilter === 'completed') return task.completed;
                return true;
            });

            if (filteredTasks.length === 0) {
                taskList.innerHTML = `
                    <div class="empty-state">
                        <i class="fa-regular fa-folder-open"></i>
                        <p>No tasks found in this view.</p>
                    </div>
                `;
            } else {
                filteredTasks.forEach(task => {
                    const li = document.createElement('li');
                    li.className = `task-item ${task.completed ? 'completed' : ''}`;
                    li.innerHTML = `
                        <div class="task-left">
                            <div class="checkbox" onclick="toggleTask(${task.id})">
                                <i class="fa-solid fa-check"></i>
                            </div>
                            <span class="task-text">${escapeHtml(task.text)}</span>
                        </div>
                        <div class="action-btns">
                            <button class="icon-btn" onclick="openEditModal(${task.id})">
                                <i class="fa-regular fa-pen-to-square"></i>
                            </button>
                            <button class="icon-btn delete" onclick="deleteTask(${task.id})">
                                <i class="fa-regular fa-trash-can"></i>
                            </button>
                        </div>
                    `;
                    taskList.appendChild(li);
                });
            }

            updateStats();
            saveToLocalStorage();
        }

        function addTask() {
            const input = document.getElementById('taskInput');
            const text = input.value.trim();

            if (text === '') return;

            const newTask = {
                id: Date.now(),
                text: text,
                completed: false
            };

            tasks.unshift(newTask);
            input.value = '';
            renderTasks();
        }

        function handleKeyPress(e) {
            if (e.key === 'Enter') addTask();
        }

        function toggleTask(id) {
            tasks = tasks.map(task => 
                task.id === id ? { ...task, completed: !task.completed } : task
            );
            renderTasks();
        }

        function deleteTask(id) {
            tasks = tasks.filter(task => task.id !== id);
            renderTasks();
        }

        function openEditModal(id) {
            const task = tasks.find(t => t.id === id);
            if (!task) return;

            editingTaskId = id;
            document.getElementById('editInput').value = task.text;
            document.getElementById('editModal').classList.add('active');
        }

        function closeEditModal() {
            editingTaskId = null;
            document.getElementById('editModal').classList.remove('active');
        }

        function saveEditedTask() {
            const newText = document.getElementById('editInput').value.trim();
            if (newText === '') return;

            tasks = tasks.map(task => 
                task.id === editingTaskId ? { ...task, text: newText } : task
            );

            closeEditModal();
            renderTasks();
        }

        function setFilter(filter, btn) {
            currentFilter = filter;
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderTasks();
        }

        function updateStats() {
            const total = tasks.length;
            const completed = tasks.filter(t => t.completed).length;
            const pending = total - completed;

            document.getElementById('totalTasks').textContent = total;
            document.getElementById('completedTasks').textContent = completed;
            document.getElementById('pendingTasks').textContent = pending;
        }

        function saveToLocalStorage() {
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }

        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }