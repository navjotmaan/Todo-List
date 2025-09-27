let tasks = [];

class Task {
    constructor(title, description, dueDate, priority) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
    }
}

function addTask(title, description, dueDate, priority) {
    const task = new Task(title, description, dueDate, priority);
    tasks.push(task);
    return task;
}

function renderTasks() {
    const todo = document.getElementById('todos');
    todo.innerHTML = "";

    tasks.forEach(task => {
        const card = document.createElement('div');
        card.textContent = `${task.title}, ${task.description}, ${task.dueDate}, ${task.priority}`;

        todo.appendChild(card);
    });
}

const form = document.querySelector('#task-info');

form.addEventListener('submit',(e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const dueDate = document.getElementById('date').value;
    const priority = document.getElementById('priority').value;

    addTask(title, description, dueDate, priority);

    renderTasks();

    form.reset();
    document.getElementById('tasks').close();
});
