import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import { DogBreeds } from '../../data/dogBreeds';

// ... (keep intervening code) ...

if (isEdit) {
    await api.put(`/patients/${id}`, payload);
} else {
    await api.post('/patients', payload);
}
navigate('/pacientes');
        } catch (error) {
    console.error(error);
    alert('Error al guardar');
}
    };

return (
    <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">{isEdit ? 'Editar Paciente' : 'Nuevo Paciente'}</h1>
        <div className="bg-white rounded-xl shadow-sm border p-6">
            <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">

                {/* Basic Info */}
                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Datos del Paciente</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="label">Nombre *</label>
                            <input {...register('name')} className="input" />
                            {errors.name && <span className="error">{errors.name.message}</span>}
                        </div>

                        <div>
                            <label className="label">Especie *</label>
                            <select {...register('species')} className="input" onChange={(e) => {
                                setValue('species', e.target.value as any);
                                setValue('breed', ''); // Reset breed
                                setValue('color', '');
                                setValue('custom_species', ''); // Reset custom
                                setIsCustomColor(false);
                            }}>
                                <option value="Perro">Perro</option>
                                <option value="Gato">Gato</option>
                                <option value="Otro">Otro</option>
                            </select>
                        </div>

                        {/* Conditional Inputs based on Species */}
                        {selectedSpecies === 'Otro' ? (
                            <>
                                <div>
                                    <label className="label">Especifique Especie *</label>
                                    <input {...register('custom_species')} className="input" placeholder="Ej. Conejo, Hamster..." />
                                    {errors.custom_species && <span className="error">{errors.custom_species.message}</span>}
                                </div>
                                <div>
                                    <label className="label">Raza (Opcional)</label>
                                    <input {...register('breed')} className="input" placeholder="Raza o tipo" />
                                </div>
                            </>
                        ) : (
                            <div>
                                <label className="label">Raza *</label>
                                {selectedSpecies === 'Perro' ? (
                                    <select {...register('breed')} className="input" onChange={(e) => {
                                        setValue('breed', e.target.value);
                                        setValue('color', '');
                                        setIsCustomColor(false);
                                    }}>
                                        <option value="">Seleccionar Raza...</option>
                                        {breedList.map(breed => (
                                            <option key={breed} value={breed}>{breed}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input {...register('breed')} className="input" placeholder="Ej. Siames / Común" />
                                )}
                                {errors.breed && <span className="error">{errors.breed.message}</span>}
                            </div>
                        )}

                        <div>
                            <label className="label">Sexo *</label>
                            <select {...register('sex')} className="input">
                                <option value="Macho">Macho</option>
                                <option value="Hembra">Hembra</option>
                            </select>
                        </div>

                        <div>
                            <label className="label">Color *</label>
                            {!isCustomColor && colorList.length > 0 ? (
                                <select
                                    {...register('color')}
                                    className="input"
                                    onChange={(e) => {
                                        if (e.target.value === 'CUSTOM_COLOR') {
                                            setIsCustomColor(true);
                                            setValue('color', '');
                                        } else {
                                            setValue('color', e.target.value);
                                        }
                                    }}
                                >
                                    <option value="">Seleccionar Color...</option>
                                    {colorList.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                    <option value="CUSTOM_COLOR" className="font-bold text-blue-600">+ Otro (Escribir manual)</option>
                                </select>
                            ) : (
                                <div className="flex space-x-2">
                                    <input {...register('color')} className="input" placeholder="Especifique color" autoFocus={isCustomColor} />
                                    {colorList.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => setIsCustomColor(false)}
                                            className="text-sm text-blue-600 hover:underline whitespace-nowrap"
                                        >
                                            Ver lista
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="label">Fecha Nacimiento</label>
                            <input
                                type="date"
                                max={new Date().toISOString().split('T')[0]}
                                min="1990-01-01"
                                {...register('birth_date')}
                                className="input"
                            />
                        </div>

                        <div>
                            <label className="label">Peso (kg)</label>
                            <input type="number" step="0.1" {...register('weight')} className="input" />
                        </div>
                    </div>
                </div>

                {/* Tutors */}
                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Tutores</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="label">Tutor Principal *</label>
                            <select {...register('tutor_id')} className="input">
                                <option value="">Seleccionar Tutor...</option>
                                {tutors.map(t => (
                                    <option key={t._id} value={t._id}>{t.full_name} - {t.phone}</option>
                                ))}
                            </select>
                            {errors.tutor_id && <span className="error">{errors.tutor_id.message}</span>}
                            <div className="text-xs text-right mt-1">
                                <a href="/tutores/crear" target="_blank" className="text-primary hover:underline">Crear nuevo tutor</a>
                            </div>
                        </div>
                        <div>
                            <label className="label">Tutor Secundario</label>
                            <select {...register('tutor2_id')} className="input">
                                <option value="">Ninguno</option>
                                {tutors.map(t => (
                                    <option key={t._id} value={t._id}>{t.full_name} - {t.phone}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Medical Info */}
                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Información Médica</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="label">Alergias</label>
                            <input {...register('allergies')} className="input" placeholder="Ninguna conocida" />
                        </div>
                        <div>
                            <label className="label">Notas Generales</label>
                            <textarea {...register('notes')} className="input" rows={3} />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button type="button" onClick={() => navigate('/pacientes')} className="btn-secondary">Cancelar</button>
                    <button type="submit" className="btn-primary">Guardar Paciente</button>
                </div>

            </form>
        </div>

        <style>{`
                .label { display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.25rem; }
                .input { width: 100%; padding: 0.5rem 1rem; border: 1px solid #E5E7EB; border-radius: 0.5rem; outline: none; transition: all; }
                .input:focus { ring: 2px; ring-color: #4FA3A1; border-color: #4FA3A1; }
                .error { color: #D98FA6; font-size: 0.75rem; margin-top: 0.25rem; display: block; }
                .btn-primary { padding: 0.5rem 1.5rem; background-color: #4FA3A1; color: white; font-weight: 500; border-radius: 0.5rem; transition: background-color 0.2s; }
                .btn-primary:hover { opacity: 0.9; }
                .btn-secondary { padding: 0.5rem 1.5rem; color: #374151; font-weight: 500; border-radius: 0.5rem; transition: background-color 0.2s; }
                .btn-secondary:hover { background-color: #E6F2F3; }
            `}</style>
    </div>
);
};

export default PatientForm;
