import type { Project } from '../types';

const STORAGE_KEY = 'atelierpilot_projects';

/** Charge tous les projets depuis le localStorage */
export function loadProjects(): Project[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/** Sauvegarde un projet (ajout ou mise à jour) */
export function saveProject(project: Project): void {
  const projects = loadProjects();
  const existingIndex = projects.findIndex(p => p.id === project.id);

  if (existingIndex >= 0) {
    projects[existingIndex] = { ...project, updatedAt: new Date().toISOString() };
  } else {
    projects.push(project);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

/** Supprime un projet par son ID */
export function deleteProject(id: string): void {
  const projects = loadProjects().filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

/** Génère un identifiant unique */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
