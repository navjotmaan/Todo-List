export let tasks = [];
export let projects = [];

const date = new Date();
const todayDate = date.toLocaleDateString();

export class Task {
  constructor(title, description, dueDate, priority, projectId) {
    this.id = crypto.randomUUID();
    this.title = title || "new task";
    this.description = description || "";
    this.dueDate = dueDate || todayDate;
    this.priority = priority || "low";
    this.projectId = projectId || null;
  }
}

export class Project {
  constructor(name) {
    this.id = crypto.randomUUID();
    this.name = name || "Unnamed";
    this.tasks = []; 
  }
}

export function saveAll() {
  localStorage.setItem('projects', JSON.stringify(projects));
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

export function loadProject() {
  const saved = JSON.parse(localStorage.getItem('projects')) || [];
  // recreate Project instances, but do NOT trust embedded tasks
  projects = saved.map(p => {
    const np = new Project(p.name);
    np.id = p.id || np.id;
    np.tasks = []; // clear tasks; we'll re-link from tasks storage
    return np;
  });
}

export function loadTask() {
  const saved = JSON.parse(localStorage.getItem('tasks')) || [];
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

// Ensure there's always at least a Default project 
export function ensureDefaultProject() {
  if (!projects.length) {
    const def = new Project('New Project');
    projects.push(def);
    saveAll();
  }
}

export function addProject(name) {
  const project = new Project(name);
  projects.push(project);
  saveAll();
  return project;
}

export function addTask(title, description, dueDate, priority, projectId) {
  // ensure project exists, otherwise use first project
  let project = projects.find(p => p.id === projectId);
  if (!project) project = projects[0];

  const task = new Task(title, description, dueDate, priority, project.id);
  tasks.push(task);
  project.tasks.push(task);

  saveAll();
  return task;
}

