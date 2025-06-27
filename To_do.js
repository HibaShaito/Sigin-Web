document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    
    const allTasksBtn = document.getElementById('allTasks');
    const completedTasksBtn = document.getElementById('completedTasks');
    const incompleteTasksBtn = document.getElementById('incompleteTasks');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    
    let tasks = [];
    let currentFilter = 'all';
    let currentPage = 1;
    const tasksPerPage = 5;

    const loadTasks = () => {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            tasks = JSON.parse(storedTasks);
            renderTasks();
        }
    };

    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const addTaskToDOM = (task) => {
        const li = document.createElement('li');
        li.className = task.completed ? 'completed' : '';
        
        li.innerHTML = `
            <span>${task.text}</span>
            <div>
                <button class="complete">${task.completed ? 'Undo' : 'Complete'}</button>
                <button class="edit">Edit</button>
                <button class="delete">Delete</button>
            </div>
        `;
        
        li.querySelector('.complete').addEventListener('click', () => {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
        });

        li.querySelector('.edit').addEventListener('click', () => {
            const newText = prompt('Edit task', task.text);
            if (newText) {
                task.text = newText;
                saveTasks();
                renderTasks();
            }
        });

        li.querySelector('.delete').addEventListener('click', () => {
            tasks = tasks.filter(t => t !== task);
            saveTasks();
            renderTasks();
        });

        taskList.appendChild(li);
    };

    const renderTasks = () => {
        taskList.innerHTML = '';
        let filteredTasks = tasks;
        if (currentFilter === 'completed') {
            filteredTasks = tasks.filter(task => task.completed);
        } else if (currentFilter === 'incomplete') {
            filteredTasks = tasks.filter(task => !task.completed);
        }

        const start = (currentPage - 1) * tasksPerPage;
        const end = start + tasksPerPage;
        const paginatedTasks = filteredTasks.slice(start, end);

        paginatedTasks.forEach(task => addTaskToDOM(task));

        // Update pagination buttons
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = end >= filteredTasks.length;
    };

    addTaskBtn.addEventListener('click', () => {
        const text = taskInput.value.trim();
        if (text) {
            const newTask = { text, completed: false };
            tasks.push(newTask);
            saveTasks();
            renderTasks();
            taskInput.value = '';
        }
    });

    const handleFilterClick = (filter) => {
        currentFilter = filter;
        currentPage = 1; // Reset to first page
        renderTasks();
        document.querySelectorAll('.filterBtn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(filter + 'Tasks').classList.add('active');
    };

    allTasksBtn.addEventListener('click', () => handleFilterClick('all'));
    completedTasksBtn.addEventListener('click', () => handleFilterClick('completed'));
    incompleteTasksBtn.addEventListener('click', () => handleFilterClick('incomplete'));

    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderTasks();
        }
    });

    nextPageBtn.addEventListener('click', () => {
        currentPage++;
        renderTasks();
    });

    loadTasks();
    handleFilterClick('all');
});
