let tasks = [];
let projects = [];

document.addEventListener('DOMContentLoaded', init);

function init() {
  loadProject();        
  ensureDefaultProject();
  loadTask();           
  updateProjectDropdown();
  renderProjects();
}

class Task {
  constructor(title, description, dueDate, priority, projectId) {
    this.id = crypto.randomUUID();
    this.title = title || "";
    this.description = description || "";
    this.dueDate = dueDate || "";
    this.priority = priority || "low";
    this.projectId = projectId || null;
  }
}

class Project {
  constructor(name) {
    this.id = crypto.randomUUID();
    this.name = name || "Unnamed";
    this.tasks = []; 
  }
}

function saveAll() {
  localStorage.setItem('projects', JSON.stringify(projects));
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function saveProject() { saveAll(); }

function loadProject() {
  const saved = JSON.parse(localStorage.getItem('projects')) || [];
  // recreate Project instances, but do NOT trust embedded tasks
  projects = saved.map(p => {
    const np = new Project(p.name);
    np.id = p.id || np.id;
    np.tasks = []; // clear tasks; we'll re-link from tasks storage
    return np;
  });
}

// Ensure there's always at least a Default project 
function ensureDefaultProject() {
  if (!projects.length) {
    const def = new Project('New Project');
    projects.push(def);
    saveAll();
  }
}

function saveTask() { saveAll(); }

function loadTask() {
  const saved = JSON.parse(localStorage.getItem('tasks')) || [];
  // recreate Task instances (so methods/shape are consistent)
  tasks = saved.map(t => {
    const nt = new Task(t.title, t.description, t.dueDate, t.priority, t.projectId);
    nt.id = t.id || nt.id;
    return nt;
  });

  // Clear project.task arrays then re-link
  projects.forEach(p => p.tasks = []);
  tasks.forEach(t => {
    const project = projects.find(p => p.id === t.projectId);
    if (project) {
      project.tasks.push(t);
    } else {
      // If the referenced project doesn't exist, attach to Default (first project)
      projects[0].tasks.push(t);
      t.projectId = projects[0].id;
    }
  });

  // Persist any normalization (e.g. tasks moved to default)
  saveAll();
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
    deleteBtn.classList.add('delete');
    deleteBtn.src = "./cross-mark.png";
    deleteBtn.alt = "Delete project";

    deleteBtn.addEventListener('click', () => {
      if (!confirm(`Delete project "${project.name}" and all its tasks?`)) return;

      // Remove project tasks from global tasks array
      tasks = tasks.filter(t => t.projectId !== project.id);

      // Remove the project
      projects = projects.filter(p => p.id !== project.id);

      // If no projects remain, recreate default
      if (!projects.length) {
        projects.push(new Project('New Project'));
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
        const taskCard = createTaskCard(task);
        projectCard.appendChild(taskCard);
      }
    });

    todo.appendChild(projectCard);
  });
}

/* Create one task DOM card (reusable) */
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

  const deleteBtn = document.createElement('img');
  deleteBtn.classList.add('delete');
  deleteBtn.src = "./cross-mark.png";
  deleteBtn.alt = "Delete task";

  deleteBtn.addEventListener('click', () => {
    // 1) Remove from global tasks
    tasks = tasks.filter(t => t.id !== task.id);

    // 2) Remove from the project's tasks array
    const project = projects.find(p => p.id === task.projectId);
    if (project) {
      project.tasks = project.tasks.filter(t => t.id !== task.id);
    }

    // 3) Save both and re-render
    saveAll();
    renderProjects();
  });

  const box = document.createElement('div');
  box.classList.add('box');
  box.appendChild(heading);
  box.appendChild(deleteBtn);

  taskCard.appendChild(box);
  taskCard.appendChild(des);
  taskCard.appendChild(date);
  taskCard.appendChild(priority);

  return taskCard;
}

/* --- Add/Remove helpers --- */
function addProject(name) {
  const project = new Project(name);
  projects.push(project);
  saveAll();
  updateProjectDropdown();
  renderProjects();
  return project;
}

function addTask(title, description, dueDate, priority, projectId) {
  // ensure project exists, otherwise use first project
  let project = projects.find(p => p.id === projectId);
  if (!project) project = projects[0];

  const task = new Task(title, description, dueDate, priority, project.id);
  tasks.push(task);
  project.tasks.push(task);

  saveAll();
  renderProjects();
  return task;
}

/* --- Forms / UI wiring --- */
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
});

projectForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const projectName = document.getElementById('project-name').value;
  if (!projectName) return;
  addProject(projectName);
  projectForm.reset();
  document.getElementById('projects')?.close();
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
