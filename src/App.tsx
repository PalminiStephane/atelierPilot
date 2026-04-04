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
  const [loadedProject, setLoadedProject] = useState<Project | null>(null);

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
    setLoadedProject(project);
    setActiveModule(project.type === 'bolt_circle' ? 'bolt_circle' : 'rect_grid');
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Header
        onProjectsClick={() => setShowProjects(!showProjects)}
        showProjects={showProjects}
      />

      {/* Contenu principal avec padding pour header et bottom nav */}
      <main className="flex-1 max-w-2xl mx-auto w-full" style={{ paddingTop: '5.5rem', paddingBottom: '6rem', paddingLeft: '1.25rem', paddingRight: '1.25rem' }}>
        {showProjects ? (
          <ProjectsModule
            onLoad={handleLoadProject}
            onClose={() => setShowProjects(false)}
          />
        ) : (
          <>
            {activeModule === 'bolt_circle' && (
              <BoltCircleModule
                key={loadedProject?.id ?? 'default'}
                onSave={handleSaveBoltCircle}
                initialParams={loadedProject?.type === 'bolt_circle' ? loadedProject.params as BoltCircleParams : undefined}
              />
            )}
            {activeModule === 'cutting_speed' && <CuttingSpeedModule />}
            {activeModule === 'threading' && <ThreadingModule />}
            {activeModule === 'tools' && <ToolsModule />}
            {activeModule === 'rect_grid' && (
              <RectGridModule
                key={loadedProject?.id ?? 'default'}
                onSave={handleSaveRectGrid}
                initialParams={loadedProject?.type === 'rect_grid' ? loadedProject.params as RectGridParams : undefined}
              />
            )}
          </>
        )}
      </main>

      <BottomNav activeModule={activeModule} onModuleChange={(id) => { setActiveModule(id); setShowProjects(false); }} />
    </div>
  );
}

export default App;
