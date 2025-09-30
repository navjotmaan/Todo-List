import { tasks, projects, addProject, saveAll} from './data.js';

const todo = document.getElementById('todos');

export function updateProjectDropdown() {
  const select = document.getElementById('project-select');
  if (!select) return;
  select.innerHTML = "";
  projects.forEach(p => {
    const option = document.createElement('option');
    option.value = p.id;
    option.textContent = p.name;
    select.appendChild(option);
  });
}

export function renderProjects() {
  todo.innerHTML = "";

  projects.forEach(project => {
    project.tasks = tasks.filter(t => t.projectId === project.id);

    const projectCard = document.createElement('div');
    projectCard.classList.add('project-card');
    projectCard.setAttribute('data-id', project.id);

    const projectHeading = document.createElement('h1');
    projectHeading.textContent = project.name;

    const edit = document.createElement('img');
    edit.classList.add('icon');
    edit.src = "./resources/edit-pencil.png";
    edit.alt = "Edit task";

    const deleteBtn = document.createElement('img');
    deleteBtn.classList.add('icon');
    deleteBtn.src = "./resources/cross-mark.png";
    deleteBtn.alt = "Delete project";

    edit.addEventListener('click', () => {
      const id = projectCard.getAttribute('data-id');
      const project = projects.find(p => p.id === id);

      if (project) {
        document.getElementById('project-name').value = project.name;

        editingProjectId = project.id;
        document.getElementById('projects').showModal();
      }
    });

    deleteBtn.addEventListener('click', () => {
      if (!confirm(`Delete project "${project.name}" and all its tasks?`)) return;

      // Remove project tasks
      const remainingTasks = tasks.filter(t => t.projectId !== project.id);
      tasks.length = 0;
      tasks.push(...remainingTasks);

      // Remove the project
      const remainingProjects = projects.filter(p => p.id !== project.id);
      projects.length = 0;
      projects.push(...remainingProjects);

      // If no projects remain, recreate default
      if (!projects.length) {
        addProject('New Project');
      }

      saveAll();
      updateProjectDropdown();
      renderProjects();
    });

    const box = document.createElement('div');
    box.classList.add('box');

    const icon = document.createElement('div');
    icon.appendChild(edit);
    icon.appendChild(deleteBtn);

    box.appendChild(projectHeading);
    box.appendChild(icon);

    projectCard.appendChild(box);

    // Append tasks that belong to this project
    project.tasks.forEach(task => {
      if (task) {
        const taskCard = showTask(task);
        projectCard.appendChild(taskCard);
      }
    });

    todo.appendChild(projectCard);
  });
}

export function showTask(task) {
  const taskCard = document.createElement('div');

  const heading = document.createElement('h3');
  heading.textContent = task.title;

  const date = document.createElement('p');
  date.textContent = task.dueDate;

  taskCard.appendChild(heading);
  taskCard.appendChild(date);

  heading.addEventListener("click", () => {
    todo.textContent = "";
    const fullTask = createTaskCard(task);
    todo.appendChild(fullTask);
  });

  return taskCard;
}

export function createTaskCard(task) {
  const taskCard = document.createElement('div');
  taskCard.classList.add('task-card');
  taskCard.setAttribute('data-id', task.id);

  const heading = document.createElement('h2');
  heading.textContent = task.title;

  const des = document.createElement('p');
  des.textContent = task.description;

  const date = document.createElement('p');
  date.textContent = task.dueDate;

  const priority = document.createElement('p');
  priority.textContent = `Priority: ${task.priority}`;

  const edit = document.createElement('img');
  edit.classList.add('icon');
  edit.src = "./resources/edit-pencil.png";
  edit.alt = "Edit task";

  const deleteBtn = document.createElement('img');
  deleteBtn.classList.add('icon');
  deleteBtn.src = "./resources/cross-mark.png";
  deleteBtn.alt = "Delete task";

  edit.addEventListener('click', () => {
    const id = taskCard.getAttribute('data-id');
    const task = tasks.find(t => t.id === id);

    if (task) {
      document.getElementById('title').value = task.title;
      document.getElementById('description').value = task.description;
      document.getElementById('date').value = task.dueDate;
      document.getElementById(task.priority).checked = true;
      document.getElementById('project-select').value = task.projectId;

      editingTaskId = task.id;
      document.getElementById('tasks').showModal();
    }
  });

  deleteBtn.addEventListener('click', () => {
    const remainingTasks = tasks.filter(t => t.id !== task.id);
    tasks.length = 0;
    tasks.push(...remainingTasks);

    const project = projects.find(p => p.id === task.projectId);
    if (project) {
      project.tasks = project.tasks.filter(t => t.id !== task.id);
    }

    saveAll();
    renderProjects();
  });

  const box = document.createElement('div');
  box.classList.add('box');
  box.appendChild(heading);

  const icons = document.createElement('div');
  icons.appendChild(edit);
  icons.appendChild(deleteBtn);
  box.appendChild(icons);

  taskCard.appendChild(box);
  taskCard.appendChild(des);
  taskCard.appendChild(date);
  taskCard.appendChild(priority);

  return taskCard;
}