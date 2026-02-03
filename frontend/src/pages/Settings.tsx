import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Trash, Settings as SettingsIcon, Users, Calendar, Mail } from 'lucide-react';

/* --- Sub-Components --- */

const TabButton = ({ id, icon: Icon, label, active, set }: any) => (
    <button
        onClick={() => set(id)}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
            ${active ? 'bg-white text-primary shadow-sm border border-gray-200' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
        `}
    >
        <Icon className={`w-5 h-5 ${active ? 'text-secondary' : 'text-gray-400'}`} />
        <span>{label}</span>
    </button>
);



const TemplatesSettings = () => {
    const { register, handleSubmit, setValue } = useForm();

    useEffect(() => {
        api.get('/settings').then(({ data }) => {
            if (data.email_templates) {
                setValue('appointment_confirmation', data.email_templates.appointment_confirmation);
            }
        });
    }, [setValue]);

    const onSubmit = async (data: any) => {
        const current = (await api.get('/settings')).data;
        await api.put('/settings', {
            ...current,
            email_templates: { ...current.email_templates, ...data }
        });
        alert('Plantilla guardada');
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Plantillas de Correo</h2>
            <div>
                <label className="label">Confirmación de Cita</label>
                <p className="text-xs text-gray-500 mb-2">Variables disponibles: {'{tutor_name}, {patient_name}, {date}, {reason}, {notes}'}</p>
                <textarea
                    {...register('appointment_confirmation')}
                    rows={10}
                    className="input font-mono text-sm"
                />
            </div>
            <div className="flex justify-end">
                <button type="submit" className="btn-primary">Guardar Plantilla</button>
            </div>
        </form>
    );
};

const ScheduleSettings = () => {
    const { register, handleSubmit, setValue } = useForm();
    const days = [
        { key: 'monday', label: 'Lunes' },
        { key: 'tuesday', label: 'Martes' },
        { key: 'wednesday', label: 'Miércoles' },
        { key: 'thursday', label: 'Jueves' },
        { key: 'friday', label: 'Viernes' },
        { key: 'saturday', label: 'Sábado' },
        { key: 'sunday', label: 'Domingo' },
    ];

    useEffect(() => {
        api.get('/settings').then(({ data }) => {
            if (data.schedule) {
                days.forEach(d => setValue(d.key, data.schedule[d.key] || '09:00-19:00'));
            }
        });
    }, [setValue]);

    const onSubmit = async (data: any) => {
        const current = (await api.get('/settings')).data;
        await api.put('/settings', { ...current, schedule: data });
        alert('Horario guardado');
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Horarios de Atención</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {days.map(day => (
                    <div key={day.key}>
                        <label className="label">{day.label}</label>
                        <input {...register(day.key)} className="input" placeholder="Ej. 09:00-19:00 o Cerrado" />
                    </div>
                ))}
            </div>
            <div className="flex justify-end pt-4">
                <button type="submit" className="btn-primary">Guardar Horario</button>
            </div>
        </form>
    );
};

const UsersSettings = ({ currentUser }: any) => {
    const [users, setUsers] = useState<any[]>([]);
    const { register, handleSubmit, reset } = useForm();

    const fetchUsers = () => api.get('/auth/users').then(({ data }) => setUsers(data));
    useEffect(() => { fetchUsers(); }, []);

    const onSubmit = async (data: any) => {
        try {
            await api.post('/auth/register', data);
            reset();
            fetchUsers();
            alert('Usuario creado');
        } catch (e: any) {
            alert(e.response?.data?.detail || 'Error');
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('¿Eliminar usuario?')) {
            try {
                await api.delete(`/auth/users/${id}`);
                fetchUsers();
            } catch (e: any) {
                alert(e.response?.data?.detail);
            }
        }
    };

    return (
        <div className="space-y-8">
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Gestión de Usuarios</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="bg-blue-50 p-6 rounded-xl border border-blue-100 space-y-4">
                <h3 className="font-semibold text-blue-900">Crear nuevo usuario</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input {...register('name')} className="input" placeholder="Nombre completo" required />
                    <input {...register('email')} type="email" className="input" placeholder="Email" required />
                    <input {...register('password')} type="password" className="input" placeholder="Contraseña" required />
                    <select {...register('role')} className="input">
                        <option value="assistant">Asistente</option>
                        <option value="admin">Administrador</option>
                    </select>
                </div>
                <div className="flex justify-end">
                    <button type="submit" className="btn-primary bg-blue-600 hover:bg-blue-700">Crear Usuario</button>
                </div>
            </form>

            <div className="space-y-3">
                <h3 className="font-medium text-gray-700">Usuarios Existentes</h3>
                {users.map(u => (
                    <div key={u.id} className="flex justify-between items-center p-4 bg-white border rounded-lg shadow-sm">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold">
                                {u.name[0]}
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">{u.name} {u.id === currentUser?.id && '(Tú)'}</p>
                                <p className="text-sm text-gray-500">{u.email} • <span className="capitalize">{u.role}</span></p>
                            </div>
                        </div>
                        {u.id !== currentUser?.id && (
                            <button onClick={() => handleDelete(u.id)} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors">
                                <Trash className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};



/* --- Main Component --- */

const Settings = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('schedule');

    return (
        <div className="max-w-4xl mx-auto pb-10">
            <div className="mb-6 flex items-center">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                    <SettingsIcon className="mr-3 text-secondary" />
                    Ajustes de Veterinaria
                </h1>
            </div>

            <div className="bg-white rounded-xl shadow-lg border overflow-hidden flex flex-col md:flex-row min-h-[600px]">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-64 bg-gray-50 border-r border-gray-100 flex-shrink-0">
                    <nav className="p-4 space-y-1">
                        <TabButton id="schedule" icon={Calendar} label="Horarios" active={activeTab} set={setActiveTab} />
                        <TabButton id="templates" icon={Mail} label="Plantillas de Correo" active={activeTab} set={setActiveTab} />
                        <TabButton id="users" icon={Users} label="Usuarios y Acceso" active={activeTab} set={setActiveTab} />
                    </nav>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-8 overflow-y-auto">
                    {activeTab === 'templates' && <TemplatesSettings />}
                    {activeTab === 'schedule' && <ScheduleSettings />}
                    {activeTab === 'users' && <UsersSettings currentUser={user} />}
                </div>
            </div>

            <style>{`
                .label { display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.25rem; }
                .input { width: 100%; padding: 0.5rem 1rem; border: 1px solid #E5E7EB; border-radius: 0.5rem; outline: none; transition: all; }
                .input:focus { box-shadow: 0 0 0 2px #4FA3A1; border-color: #4FA3A1; }
                .btn-primary { padding: 0.5rem 1.5rem; background-color: #4FA3A1; color: white; font-weight: 500; border-radius: 0.5rem; transition: background-color 0.2s; }
                .btn-primary:hover { opacity: 0.9; }
            `}</style>
        </div>
    );
};

export default Settings;
