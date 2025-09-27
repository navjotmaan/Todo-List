let tasks = [];

class Task {
    constructor(title, description, dueDate, priority) {
        this.id = crypto.randomUUID();
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
        card.classList.add('card');
        card.setAttribute('data-id', task.id);

        const heading = document.createElement('h1');
        heading.textContent = `${task.title}`;

        const des = document.createElement('p');
        des.textContent = `${task.description}`;

        const date = document.createElement('p');
        date.textContent = `${task.dueDate}`;

        const deleteBtn = document.createElement('img');
        deleteBtn.setAttribute('id', 'delete');

        deleteBtn.src = "./cross-mark.png";

        deleteBtn.addEventListener('click', () => {
            const id = card.getAttribute('data-id');
            tasks = tasks.filter(task => task.id !== id);
            renderTasks();
        });

        const box = document.createElement('div');
        box.setAttribute('id', 'box');

        box.appendChild(heading);
        box.appendChild(deleteBtn);

        card.appendChild(box);
        card.appendChild(des);
        card.appendChild(date);

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
