import { tasks, addTask, projects, addProject, saveAll } from "./data.js";
import { renderProjects, updateProjectDropdown } from "./render.js";

const taskForm = document.querySelector('#task-info');
const projectForm = document.getElementById('projects-name');

window.editingTaskId = null;
window.editingProjectId = null;

function addTaskInfo() {
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const dueDate = document.getElementById('date').value;
  const priority = document.querySelector('input[name="priority"]:checked')?.id || "low";
  const projectId = document.getElementById('project-select')?.value;

  if (window.editingTaskId) {
    const task = tasks.find(t => t.id === editingTaskId);
    if (task) {
      task.title = title;
      task.description = description;
      task.dueDate = dueDate;
      task.priority = priority;
      task.projectId = projectId;
    }
    window.editingTaskId = null;
  } else {
    addTask(title, description, dueDate, priority, projectId);
  }
}

taskForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  
  addTaskInfo();
  taskForm.reset();
  document.getElementById('tasks')?.close();
  saveAll();
  renderProjects();
});

function addProjectInfo() {
  const name = document.getElementById('project-name').value;
  if (!name) return;

  if (window.editingProjectId) {
    const project = projects.find(p => p.id === editingProjectId);
    if (project) {
      project.name = name;
    }
    window.editingProjectId = null;
  } else {
    addProject(name);
  }
}

projectForm?.addEventListener('submit', (e) => {
  e.preventDefault();

  addProjectInfo();
  projectForm.reset();
  document.getElementById('projects')?.close();
  updateProjectDropdown();
  saveAll();
  renderProjects();
});


const showProjects = document.querySelector('#show-projects');
showProjects.addEventListener('click', renderProjects);