import { useState, useCallback } from 'react';
import type { Project, ModuleId } from '../../../types';
import { loadProjects, deleteProject } from '../../../utils/storage';

interface ProjectsModuleProps {
  onLoad: (project: Project) => void;
  onClose: () => void;
}

/** Module de gestion des projets sauvegardés */
export function ProjectsModule({ onLoad, onClose }: ProjectsModuleProps) {
  const [projects, setProjects] = useState<Project[]>(loadProjects);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleDelete = useCallback((id: string) => {
    deleteProject(id);
    setProjects(loadProjects());
    setConfirmDelete(null);
  }, []);

  const handleCopyTable = useCallback((project: Project) => {
    const lines = project.holes.map((h, i) =>
      `${i + 1}\t${h.xAbs.toFixed(2)}\t${h.yAbs.toFixed(2)}\t${h.deltaX.toFixed(2)}\t${h.deltaY.toFixed(2)}\t${h.depth.toFixed(2)}`
    );
    const text = `N°\tX abs\tY abs\tΔX\tΔY\tZ\n${lines.join('\n')}`;
    navigator.clipboard.writeText(text);
  }, []);

  const typeLabel = (type: string) => type === 'bolt_circle' ? 'Cercle' : 'Grille';
  const typeColor = (type: string) => type === 'bolt_circle' ? 'var(--accent-orange)' : 'var(--accent-purple)';

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Mes Projets
        </h2>
        <button
          onClick={onClose}
          className="px-3 py-1.5 rounded-lg text-sm font-medium"
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
        >
          Fermer
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12" style={{ color: 'var(--text-dim)' }}>
          <div className="text-4xl mb-3">📁</div>
          <div>Aucun projet sauvegardé</div>
          <div className="text-sm mt-1">Utilisez le bouton Sauvegarder dans les modules Perçage ou Grille</div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="rounded-xl p-4 flex flex-col gap-3"
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-heading font-bold" style={{ color: 'var(--text-primary)' }}>
                    {project.name}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="px-2 py-0.5 rounded text-xs font-medium"
                      style={{ backgroundColor: `${typeColor(project.type)}22`, color: typeColor(project.type) }}
                    >
                      {typeLabel(project.type)}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--text-dim)' }}>
                      {project.holes.length} trous
                    </span>
                    <span className="text-xs" style={{ color: 'var(--text-dim)' }}>
                      {new Date(project.updatedAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onLoad(project)}
                  className="flex-1 h-10 rounded-lg text-sm font-medium"
                  style={{ backgroundColor: typeColor(project.type), color: '#fff' }}
                >
                  Charger
                </button>
                <button
                  onClick={() => handleCopyTable(project)}
                  className="h-10 px-3 rounded-lg text-sm font-medium"
                  style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
                >
                  Copier
                </button>
                {confirmDelete === project.id ? (
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="h-10 px-3 rounded-lg text-sm font-bold"
                    style={{ backgroundColor: 'var(--accent-red)', color: '#fff' }}
                  >
                    Confirmer
                  </button>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(project.id)}
                    className="h-10 px-3 rounded-lg text-sm font-medium"
                    style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--accent-red)44', color: 'var(--accent-red)' }}
                  >
                    Suppr.
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
