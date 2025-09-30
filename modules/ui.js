import {
    tasks, projects, loadProject, loadTask, ensureDefaultProject,
    saveAll, addProject, addTask
} from "./data.js";

document.addEventListener('DOMContentLoaded', init);

function init() {
  loadProject();        
  ensureDefaultProject();
  loadTask();           
  updateProjectDropdown();
  renderProjects();
}

const todo = document.getElementById('todos');

function renderProjects() {
  todo.innerHTML = "";

  projects.forEach(project => {
    const projectCard = document.createElement('div');
    projectCard.classList.add('project-card');
    projectCard.setAttribute('data-id', project.id);

    const projectHeading = document.createElement('h1');
    projectHeading.textContent = project.name;

    const deleteBtn = document.createElement('img');
    deleteBtn.classList.add('icon');
    deleteBtn.src = "./resources/cross-mark.png";
    deleteBtn.alt = "Delete project";

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
    box.appendChild(projectHeading);
    box.appendChild(deleteBtn);

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

function showTask(task) {
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

function createTaskCard(task) {
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

  edit.addEventListener('click', () => {});

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

const taskForm = document.querySelector('#task-info');
const projectForm = document.getElementById('projects-name');

taskForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const dueDate = document.getElementById('date').value;
  const priority = document.querySelector('input[name="priority"]:checked')?.id || "low";
  const projectId = document.getElementById('project-select')?.value;

  addTask(title, description, dueDate, priority, projectId);
  taskForm.reset();
  document.getElementById('tasks')?.close();
  renderProjects();
});

projectForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const projectName = document.getElementById('project-name').value;
  if (!projectName) return;
  addProject(projectName);
  projectForm.reset();
  document.getElementById('projects')?.close();
  updateProjectDropdown();
  renderProjects();
});

/* update project dropdown whenever projects change */
function updateProjectDropdown() {
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
