'use client';

import { useState, useEffect } from 'react';
import { User, Lock, Save, CheckCircle, Shield, Users, UserPlus, UserCog, KeyRound, Trash2, Edit } from 'lucide-react';

// --- INTERFACES ---
interface TeamMember {
  id: string;
  nombre: string;
  email: string;
  rol: 'Super Admin' | 'Editor' | 'Moderador';
}

export default function ConfiguracionPage() {
  // --- ESTADO DE NAVEGACIÓN (TABS) ---
  const [activeTab, setActiveTab] = useState<'perfil' | 'roles'>('perfil');

  // ==========================================
  // TAB 1: ESTADOS Y LÓGICA DEL PERFIL
  // ==========================================
  const [nombre, setNombre] = useState('tvaneupi'); 
  const [email, setEmail] = useState('admin@aneupi.com');
  const [passwordActual, setPasswordActual] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  const handleGuardarPerfil = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensajeExito('Perfil actualizado correctamente.');
    setTimeout(() => setMensajeExito(''), 3000);
  };

  const handleCambiarPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nuevaPassword !== confirmarPassword) {
      alert('Las contraseñas nuevas no coinciden.');
      return;
    }
    setMensajeExito('Contraseña actualizada de forma segura.');
    setPasswordActual('');
    setNuevaPassword('');
    setConfirmarPassword('');
    setTimeout(() => setMensajeExito(''), 3000);
  };

  // ==========================================
  // TAB 2: ESTADOS Y LÓGICA DE ROLES Y USUARIOS
  // ==========================================
  const [team, setTeam] = useState<TeamMember[]>([
    { id: '1', nombre: 'Admin Principal', email: 'admin@aneupi.com', rol: 'Super Admin' },
    { id: '2', nombre: 'Juan Pérez', email: 'juan.perez@aneupi.com', rol: 'Editor' },
    { id: '3', nombre: 'María López', email: 'maria.moderadora@aneupi.com', rol: 'Moderador' },
  ]);

  // Estados Unificados para el Modal (Crear y Editar)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<TeamMember | null>(null);
  
  // Abrir modal para CREAR
  const openCreateModal = () => {
    setSelectedUser(null); // Limpiamos la selección
    setIsUserModalOpen(true);
  };

  // Abrir modal para EDITAR
  const openEditModal = (user: TeamMember) => {
    setSelectedUser(user); // Cargamos los datos del usuario
    setIsUserModalOpen(true);
  };

  // Función unificada para GUARDAR (Crear o Actualizar)
  const handleGuardarUsuario = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const formNombre = formData.get('nombre') as string;
    const formEmail = formData.get('email') as string;
    const formPassword = formData.get('password') as string;
    const formRol = formData.get('rol') as TeamMember['rol'];
    
    if (selectedUser) {
      // --- LÓGICA DE EDICIÓN ---
      // [Backend - Actualizar] PATCH /api/admin/usuarios/${selectedUser.id}
      setTeam(team.map(u => 
        u.id === selectedUser.id ? { ...u, nombre: formNombre, email: formEmail, rol: formRol } : u
      ));
      setMensajeExito(`Los datos de ${formNombre} han sido actualizados.`);
      
    } else {
      // --- LÓGICA DE CREACIÓN ---
      // [Backend - Crear] POST /api/admin/usuarios
      const nuevoUsuario: TeamMember = {
        id: Date.now().toString(),
        nombre: formNombre,
        email: formEmail,
        rol: formRol
      };
      setTeam([...team, nuevoUsuario]);
      setMensajeExito(`El usuario ${formNombre} ha sido creado.`);
    }

    setIsUserModalOpen(false); 
    setTimeout(() => setMensajeExito(''), 4000);
  };

  // Cambio de rol rápido desde la tabla (Inline)
  const handleCambiarRolInline = (userId: string, nuevoRol: TeamMember['rol']) => {
    if (confirm(`¿Estás seguro de cambiar el rol a ${nuevoRol}?`)) {
      setTeam(team.map(miembro => miembro.id === userId ? { ...miembro, rol: nuevoRol } : miembro));
      setMensajeExito('Permisos actualizados correctamente.');
      setTimeout(() => setMensajeExito(''), 3000);
    }
  };

  const handleEliminarUsuario = (userId: string, nombre: string) => {
    if (confirm(`¿Estás seguro de ELIMINAR permanentemente a ${nombre}?`)) {
      setTeam(team.filter(miembro => miembro.id !== userId));
      setMensajeExito(`El usuario ${nombre} ha sido eliminado del sistema.`);
      setTimeout(() => setMensajeExito(''), 3000);
    }
  };

  return (
    <div className="max-w-5xl space-y-8 relative">
      
      {/* CABECERA */}
      <div className="border-b border-gray-200 pb-5">
        <div className="flex items-center gap-3">
          <Shield className="text-[#003952]" size={32} strokeWidth={2.5} />
          <h1 className="text-[32px] md:text-[40px] font-black text-[#003952] tracking-tighter leading-none">
            Configuración del Sistema
          </h1>
        </div>
        <p className="text-[15px] text-gray-500 mt-2">
          Gestiona tu información personal, seguridad y los accesos de tu equipo.
        </p>
      </div>

      {/* ALERTA FLOTANTE DE ÉXITO */}
      {mensajeExito && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-3 animate-pulse">
          <CheckCircle size={20} />
          <p className="font-medium text-[14px]">{mensajeExito}</p>
        </div>
      )}

      {/* NAVEGACIÓN DE PESTAÑAS (TABS) */}
      <div className="flex border-b border-gray-200 gap-6">
        <button 
          onClick={() => setActiveTab('perfil')}
          className={`pb-3 font-bold text-[15px] transition-colors border-b-2 ${activeTab === 'perfil' ? 'border-[#003952] text-[#003952]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
        >
          <span className="flex items-center gap-2"><UserCog size={18}/> Mi Perfil y Seguridad</span>
        </button>
        <button 
          onClick={() => setActiveTab('roles')}
          className={`pb-3 font-bold text-[15px] transition-colors border-b-2 ${activeTab === 'roles' ? 'border-[#003952] text-[#003952]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
        >
          <span className="flex items-center gap-2"><Users size={18}/> Equipo y Roles</span>
        </button>
      </div>

      {/* CONTENIDO DE LAS PESTAÑAS */}
      <div className="pt-2">
        
        {/* =========================================
            VISTA 1: PERFIL Y SEGURIDAD 
            ========================================= */}
        {activeTab === 'perfil' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Información Personal */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-50 text-[#003952] rounded-lg">
                  <User size={24} />
                </div>
                <h2 className="!text-xl font-bold text-[#003952]">Datos del Perfil</h2>
              </div>
              <form onSubmit={handleGuardarPerfil} className="space-y-5">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium text-[14px]">Nombre de Usuario</label>
                  <input 
                    type="text" 
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003952] transition-all text-[14px]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-medium text-[14px]">Correo Electrónico (No modificable)</label>
                  <input 
                    type="email" 
                    value={email}
                    disabled
                    className="w-full px-4 py-2 border border-gray-200 bg-gray-50 text-gray-500 rounded-lg cursor-not-allowed text-[14px]"
                  />
                </div>
                <button type="submit" className="w-full flex justify-center items-center gap-2 bg-[#003952] hover:bg-[#002233] text-white py-2.5 rounded-lg transition-colors font-bold text-[14px]">
                  <Save size={18} /> Guardar Cambios
                </button>
              </form>
            </div>

            {/* Seguridad y Contraseña */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                  <Lock size={24} />
                </div>
                <h2 className="!text-xl font-bold text-[#003952]">Seguridad</h2>
              </div>
              <form onSubmit={handleCambiarPassword} className="space-y-5">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium text-[14px]">Contraseña Actual</label>
                  <input type="password" value={passwordActual} onChange={(e) => setPasswordActual(e.target.value)} placeholder="Ingresa tu contraseña actual" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all text-[14px]" required />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-medium text-[14px]">Nueva Contraseña</label>
                  <input type="password" value={nuevaPassword} onChange={(e) => setNuevaPassword(e.target.value)} placeholder="Mínimo 8 caracteres" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all text-[14px]" required minLength={8} />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-medium text-[14px]">Confirmar Nueva Contraseña</label>
                  <input type="password" value={confirmarPassword} onChange={(e) => setConfirmarPassword(e.target.value)} placeholder="Repite la nueva contraseña" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all text-[14px]" required />
                </div>
                <button type="submit" className="w-full flex justify-center items-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 py-2.5 rounded-lg transition-colors font-bold text-[14px]">
                  <Lock size={18} /> Actualizar Contraseña
                </button>
              </form>
            </div>
          </div>
        )}

        {/* =========================================
            VISTA 2: GESTIÓN DE ROLES DEL EQUIPO 
            ========================================= */}
        {activeTab === 'roles' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="p-6 border-b border-gray-100 bg-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-[20px] font-bold text-[#003952]">Usuarios del Sistema</h2>
                <p className="text-[13px] text-gray-500 mt-1">Crea, edita y asigna roles a los miembros de tu equipo.</p>
              </div>
              
              <button 
                onClick={openCreateModal}
                className="bg-[#003952] text-white px-4 py-2 rounded-lg hover:bg-[#002233] transition-colors flex items-center gap-2 text-[14px] font-bold shadow-sm whitespace-nowrap"
              >
                <UserPlus size={18} /> Agregar Usuario
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b border-gray-200 text-[13px] text-gray-400 uppercase tracking-wider">
                    <th className="p-4 font-medium">Nombre de Usuario</th>
                    <th className="p-4 font-medium">Correo Electrónico</th>
                    <th className="p-4 font-medium">Rol / Permisos</th>
                    <th className="p-4 font-medium text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {team.map((miembro) => (
                    <tr key={miembro.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[#003952] font-bold text-[12px] uppercase">
                            {miembro.nombre.charAt(0)}
                          </div>
                          <span className="font-bold text-[#003952] text-[14px]">{miembro.nombre}</span>
                        </div>
                      </td>
                      <td className="p-4 text-[14px] text-gray-600">
                        {miembro.email}
                      </td>
                      <td className="p-4">
                        {miembro.id === '1' ? (
                          <span className="bg-red-50 text-red-700 px-3 py-1 rounded text-[12px] font-bold border border-red-100">
                            {miembro.rol}
                          </span>
                        ) : (
                          <select
                            value={miembro.rol}
                            onChange={(e) => handleCambiarRolInline(miembro.id, e.target.value as TeamMember['rol'])}
                            className="bg-white border border-gray-300 text-gray-700 text-[13px] rounded-lg focus:ring-[#003952] block px-3 py-1.5 outline-none shadow-sm cursor-pointer"
                          >
                            <option value="Super Admin">Super Admin</option>
                            <option value="Editor">Editor</option>
                            <option value="Moderador">Moderador</option>
                          </select>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        {/* Se ocultan los botones para el ID 1 para que el Super Admin no se borre o desconfigure a sí mismo */}
                        {miembro.id !== '1' && (
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => openEditModal(miembro)}
                              className="p-1.5 text-gray-400 hover:text-[#003952] hover:bg-blue-50 rounded transition-colors shadow-sm"
                              title="Editar datos del usuario"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleEliminarUsuario(miembro.id, miembro.nombre)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors shadow-sm"
                              title="Eliminar usuario"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* =========================================
          MODAL UNIFICADO (CREAR / EDITAR USUARIO)
          ========================================= */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in fade-in duration-200">
            
            <div className="p-6 border-b border-gray-100 bg-gray-50">
              <h2 className="!text-[22px] !text-[#003952] font-bold flex items-center gap-2">
                {selectedUser ? <UserCog size={24} className="text-[#003952]" /> : <UserPlus size={24} className="text-[#003952]" />}
                {selectedUser ? 'Editar Integrante' : 'Registrar Nuevo Integrante'}
              </h2>
              <p className="text-[13px] text-gray-500 mt-2">
                {selectedUser 
                  ? 'Modifica los datos personales o la contraseña de este usuario.' 
                  : 'Crea una cuenta para un empleado y entrégale estas credenciales corporativas.'}
              </p>
            </div>

            <form onSubmit={handleGuardarUsuario} className="p-6 space-y-5">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-1 text-[14px]">Nombre Completo</label>
                  <input
                    type="text"
                    name="nombre"
                    defaultValue={selectedUser?.nombre || ''}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003952] outline-none text-[14px]"
                    placeholder="Ej: Carlos Mendoza"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-1 text-[14px]">Correo Corporativo</label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={selectedUser?.email || ''}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003952] outline-none text-[14px]"
                    placeholder="carlos.mendoza@aneupi.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1 text-[14px]">
                    {selectedUser ? 'Nueva Contraseña' : 'Contraseña Asignada'}
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      name="password"
                      className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003952] outline-none text-[14px]"
                      placeholder={selectedUser ? 'Dejar en blanco para no cambiar' : 'Ej: Aneupi2026*'}
                      required={!selectedUser} // Solo es requerida si estamos creando uno nuevo
                      minLength={8}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1 text-[14px]">Rol Asignado</label>
                  <select
                    name="rol"
                    defaultValue={selectedUser?.rol || 'Editor'}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003952] outline-none text-[14px] bg-white cursor-pointer"
                  >
                    <option value="Editor">Editor (Contenido)</option>
                    <option value="Moderador">Moderador (TV / Chat)</option>
                    <option value="Super Admin">Super Admin (Total)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-[14px] font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#003952] text-white rounded-lg hover:bg-[#002233] transition-colors text-[14px] font-bold"
                >
                  {selectedUser ? 'Guardar Cambios' : 'Crear Usuario'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}