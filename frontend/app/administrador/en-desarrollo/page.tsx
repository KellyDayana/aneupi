'use client';

import { useState } from 'react';
import { Hammer, Plus, Edit, Trash2, Clock, CheckCircle2, AlertCircle, BarChart3, Settings, AppWindow } from 'lucide-react';

// --- INTERFACES ---
interface Project {
    id: number;
    title: string;
    description: string;
    status: 'Planificación' | 'En Desarrollo' | 'En Pruebas' | 'Pausado';
    progress: number;
    assignedTo: string;
    dueDate: string;
    moduleTarget: string; // NUEVO: El módulo al que afecta
}

export default function EnDesarrolloAdminPage() {
    // --- ESTADOS SIMULADOS ---
    const [projects, setProjects] = useState<Project[]>([
        {
            id: 1,
            title: 'Nuevo Módulo de Analítica',
            description: 'Panel de estadísticas avanzadas para ver el alcance de la TV en Vivo.',
            status: 'En Desarrollo',
            progress: 65,
            assignedTo: 'Equipo Backend',
            dueDate: '30 May 2026',
            moduleTarget: 'TvVivo' // Vinculado a TV
        },
        {
            id: 2,
            title: 'Integración Pasarela de Pagos',
            description: 'Conexión con Banco ANEUPI para permitir donaciones.',
            status: 'Planificación',
            progress: 15,
            assignedTo: 'Equipo Frontend',
            dueDate: '15 Jun 2026',
            moduleTarget: 'Global' // Afecta a toda la app
        },
        {
            id: 3,
            title: 'Mejoras en el Slider Principal',
            description: 'Transiciones 3D para las noticias principales de la portada.',
            status: 'En Pruebas',
            progress: 90,
            assignedTo: 'Equipo Frontend',
            dueDate: '10 May 2026',
            moduleTarget: 'Inicio' // Vinculado a Inicio
        }
    ]);

    // --- ESTADOS DEL MODAL ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    // --- FUNCIONES ---
    const deleteProject = (id: number) => {
        if (confirm('¿Estás seguro de eliminar este proyecto del tablero?')) {
            setProjects(projects.filter(p => p.id !== id));
        }
    };

    const openAddModal = () => {
        setSelectedProject(null);
        setIsModalOpen(true);
    };

    const openEditModal = (project: Project) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    const handleSaveProject = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const status = formData.get('status') as Project['status'];
        const progress = Number(formData.get('progress'));
        const assignedTo = formData.get('assignedTo') as string;
        const dueDate = formData.get('dueDate') as string;
        const moduleTarget = formData.get('moduleTarget') as string;

        if (selectedProject) {
            setProjects(projects.map(p =>
                p.id === selectedProject.id ? { ...p, title, description, status, progress, assignedTo, dueDate, moduleTarget } : p
            ));
        } else {
            const newProject: Project = {
                id: Date.now(),
                title, description, status, progress, assignedTo, dueDate, moduleTarget
            };
            setProjects([newProject, ...projects]);
        }
        setIsModalOpen(false);
    };

    // --- HELPERS VISUALES ---
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Planificación': return 'bg-gray-100 text-gray-700 border-gray-200';
            case 'En Desarrollo': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'En Pruebas': return 'bg-purple-50 text-purple-700 border-purple-200';
            case 'Pausado': return 'bg-red-50 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getProgressColor = (progress: number) => {
        if (progress < 30) return 'bg-gray-400';
        if (progress < 70) return 'bg-blue-500';
        if (progress < 100) return 'bg-purple-500';
        return 'bg-green-500';
    };

    return (
        <div className="space-y-8 relative">

            {/* 1. CABECERA */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 pb-4">
                <div>
                    <h1 className="!text-[25px] !text-[#003952] font-bold flex items-center gap-3">
                        <Hammer className="text-[#003952]" size={28} />
                        Módulos en Desarrollo
                    </h1>
                    <p className="text-[14px] text-gray-500 mt-1">Supervisa y actualiza el estado de las nuevas funcionalidades de la plataforma.</p>
                </div>

                <button
                    onClick={openAddModal}
                    className="bg-[#003952] text-white px-4 py-2 rounded-lg hover:bg-[#002233] transition-colors flex items-center gap-2 text-[14px] font-medium whitespace-nowrap"
                >
                    <Plus size={18} /> Nuevo Proyecto
                </button>
            </div>

            {/* 2. TARJETAS DE RESUMEN (MÉTRICAS) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg text-blue-600"><Settings size={24} /></div>
                    <div>
                        <p className="text-[13px] text-gray-500 font-medium">En Desarrollo Activo</p>
                        <p className="text-2xl font-bold text-[#003952]">{projects.filter(p => p.status === 'En Desarrollo').length}</p>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-purple-50 rounded-lg text-purple-600"><AlertCircle size={24} /></div>
                    <div>
                        <p className="text-[13px] text-gray-500 font-medium">Fase de Pruebas</p>
                        <p className="text-2xl font-bold text-[#003952]">{projects.filter(p => p.status === 'En Pruebas').length}</p>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-green-50 rounded-lg text-green-600"><CheckCircle2 size={24} /></div>
                    <div>
                        <p className="text-[13px] text-gray-500 font-medium">Progreso Promedio</p>
                        <p className="text-2xl font-bold text-[#003952]">
                            {Math.round(projects.reduce((acc, curr) => acc + curr.progress, 0) / (projects.length || 1))}%
                        </p>
                    </div>
                </div>
            </div>

            {/* 3. GRILLA DE PROYECTOS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {projects.map(project => (
                    <div key={project.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col group relative">

                        <div className="flex justify-between items-start mb-3">
                            <div className="flex gap-2">
                                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${getStatusColor(project.status)}`}>
                                    {project.status}
                                </span>
                                {/* ETIQUETA DEL MÓDULO ASIGNADO */}
                                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-gray-800 text-white flex items-center gap-1">
                                    <AppWindow size={10} /> {project.moduleTarget}
                                </span>
                            </div>

                            {/* Controles de Admin */}
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => openEditModal(project)} className="p-1.5 text-gray-400 hover:text-[#003952] hover:bg-blue-50 rounded" title="Editar">
                                    <Edit size={14} />
                                </button>
                                <button onClick={() => deleteProject(project.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded" title="Eliminar">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>

                        <h3 className="font-bold text-[16px] text-[#003952] mb-2">{project.title}</h3>
                        <p className="text-[13px] text-gray-500 mb-6 flex-1">{project.description}</p>

                        {/* Barra de Progreso */}
                        <div className="mb-4">
                            <div className="flex justify-between text-[12px] mb-1 font-medium">
                                <span className="text-gray-600">Progreso</span>
                                <span className="text-[#003952]">{project.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                <div
                                    className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(project.progress)}`}
                                    style={{ width: `${project.progress}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Footer de la Tarjeta */}
                        <div className="flex justify-between items-center pt-4 border-t border-gray-100 text-[12px] text-gray-500">
                            <span className="flex items-center gap-1">
                                <BarChart3 size={14} /> {project.assignedTo}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock size={14} /> Fecha límite: {project.dueDate}
                            </span>
                        </div>

                    </div>
                ))}
            </div>

            {/* 4. MODAL PARA CREAR/EDITAR PROYECTO */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden animate-in fade-in duration-200">

                        <div className="p-6 border-b border-gray-100 bg-gray-50">
                            <h2 className="!text-[22px] !text-[#003952] font-bold">
                                {selectedProject ? 'Actualizar Estado del Proyecto' : 'Registrar Nuevo Proyecto'}
                            </h2>
                        </div>

                        <form onSubmit={handleSaveProject} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <div className="md:col-span-2">
                                    <label className="block text-gray-700 font-medium mb-1 text-[13px]">Nombre del Proyecto</label>
                                    <input type="text" name="title" defaultValue={selectedProject?.title || ''} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003952] outline-none text-[14px]" placeholder="Ej: Pasarela de Pagos" required />
                                </div>

                                {/* NUEVO CAMPO: SELECCIÓN DEL MÓDULO */}
                                <div className="md:col-span-2">
                                    <label className="block text-gray-700 font-medium mb-1 text-[13px]">Módulo Afectado (Vinculación)</label>
                                    <select name="moduleTarget" defaultValue={selectedProject?.moduleTarget || 'Global'} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003952] outline-none text-[14px] bg-white">
                                        <option value="Global">Global (Toda la Plataforma)</option>
                                        <option value="Inicio">Inicio / Portada</option>
                                        <option value="Articulos">Artículos</option>
                                        <option value="TvVivo">TV en Vivo</option>
                                        <option value="Configuracion">Configuración</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-1 text-[13px]">Estado Actual</label>
                                    <select name="status" defaultValue={selectedProject?.status || 'Planificación'} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003952] outline-none text-[14px] bg-white">
                                        <option value="Planificación">Planificación</option>
                                        <option value="En Desarrollo">En Desarrollo</option>
                                        <option value="En Pruebas">En Pruebas</option>
                                        <option value="Pausado">Pausado</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-1 text-[13px]">Porcentaje de Avance (%)</label>
                                    <input type="number" name="progress" min="0" max="100" defaultValue={selectedProject?.progress || 0} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003952] outline-none text-[14px]" required />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-1 text-[13px]">Equipo Responsable</label>
                                    <input type="text" name="assignedTo" defaultValue={selectedProject?.assignedTo || ''} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003952] outline-none text-[14px]" placeholder="Ej: Frontend Team" required />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-1 text-[13px]">Fecha Estimada</label>
                                    <input type="text" name="dueDate" defaultValue={selectedProject?.dueDate || ''} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003952] outline-none text-[14px]" placeholder="Ej: 15 Jun 2026" required />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-gray-700 font-medium mb-1 text-[13px]">Descripción de la Tarea</label>
                                    <textarea name="description" rows={3} defaultValue={selectedProject?.description || ''} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003952] outline-none text-[14px] resize-none" placeholder="Detalla de qué trata este desarrollo..." required></textarea>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-[14px]">
                                    Cancelar
                                </button>
                                <button type="submit" className="flex-1 px-4 py-2 bg-[#003952] text-white rounded-lg hover:bg-[#002233] transition-colors text-[14px] font-bold">
                                    {selectedProject ? 'Guardar Cambios' : 'Agregar Proyecto'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}