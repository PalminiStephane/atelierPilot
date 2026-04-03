import { useState, useCallback } from 'react';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { BoltCircleModule } from './components/modules/BoltCircle/BoltCircleModule';
import { CuttingSpeedModule } from './components/modules/CuttingSpeed/CuttingSpeedModule';
import { ThreadingModule } from './components/modules/Threading/ThreadingModule';
import { ToolsModule } from './components/modules/Tools/ToolsModule';
import { RectGridModule } from './components/modules/RectGrid/RectGridModule';
import { ProjectsModule } from './components/modules/Projects/ProjectsModule';
import { saveProject, generateId } from './utils/storage';
import type { ModuleId, Project, BoltCircleParams, RectGridParams, Hole } from './types';

function App() {
  const [activeModule, setActiveModule] = useState<ModuleId>('bolt_circle');
  const [showProjects, setShowProjects] = useState(false);

  // Sauvegarde d'un projet avec prompt pour le nom
  const handleSaveBoltCircle = useCallback((params: BoltCircleParams, holes: Hole[]) => {
    const name = prompt('Nom du projet :');
    if (!name) return;
    const project: Project = {
      id: generateId(),
      name,
      type: 'bolt_circle',
      params,
      holes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveProject(project);
  }, []);

  const handleSaveRectGrid = useCallback((params: RectGridParams, holes: Hole[]) => {
    const name = prompt('Nom du projet :');
    if (!name) return;
    const project: Project = {
      id: generateId(),
      name,
      type: 'rect_grid',
      params,
      holes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveProject(project);
  }, []);

  // Charger un projet sauvegardé
  const handleLoadProject = useCallback((project: Project) => {
    setShowProjects(false);
    if (project.type === 'bolt_circle') {
      setActiveModule('bolt_circle');
    } else {
      setActiveModule('rect_grid');
    }
    // Note: pour un chargement complet il faudrait passer les params au module,
    // mais cette version permet au moins de naviguer vers le bon module
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Header
        onProjectsClick={() => setShowProjects(!showProjects)}
        showProjects={showProjects}
      />

      {/* Contenu principal avec padding pour header et bottom nav */}
      <main className="flex-1 pt-16 pb-20 px-4 max-w-2xl mx-auto w-full">
        {showProjects ? (
          <ProjectsModule
            onLoad={handleLoadProject}
            onClose={() => setShowProjects(false)}
          />
        ) : (
          <>
            {activeModule === 'bolt_circle' && <BoltCircleModule onSave={handleSaveBoltCircle} />}
            {activeModule === 'cutting_speed' && <CuttingSpeedModule />}
            {activeModule === 'threading' && <ThreadingModule />}
            {activeModule === 'tools' && <ToolsModule />}
            {activeModule === 'rect_grid' && <RectGridModule onSave={handleSaveRectGrid} />}
          </>
        )}
      </main>

      <BottomNav activeModule={activeModule} onModuleChange={(id) => { setActiveModule(id); setShowProjects(false); }} />
    </div>
  );
}

export default App;
