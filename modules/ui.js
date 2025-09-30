import { loadProject, loadTask, ensureDefaultProject } from "./data.js";
import { updateProjectDropdown, renderProjects } from "./render.js";
import "./handlers.js";

document.addEventListener('DOMContentLoaded', init);

function init() {
  loadProject();        
  ensureDefaultProject();
  loadTask();           
  updateProjectDropdown();
  renderProjects();
}

