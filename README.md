# Documentación Detallada del Proyecto WEB Paty

## 1. Descripción General
**WEB Paty** es un sistema integral de gestión veterinaria diseñado específicamente para optimizar el flujo de trabajo clínico de la Dra. Patty Pizarro Espina. La plataforma centraliza la administración de pacientes, tutores, agenda médica, historias clínicas y emisión de recetas, proporcionando una interfaz moderna, eficiente y profesional.

El sistema permite llevar un control riguroso de cada atención, generando un historial médico digital accesible y organizado, además de automatizar tareas como la generación de recetas en formato PDF con la identidad visual de la clínica.

---

## 2. Tecnologías Utilizadas

### Frontend (Interfaz de Usuario)
*   **React + Vite**: Framework principal para una experiencia de usuario rápida y fluida.
*   **TypeScript**: Aporta robustez y seguridad de tipos al código.
*   **Tailwind CSS**: Framework de estilos para un diseño moderno y responsive.
*   **Lucide React**: Biblioteca de iconos coherentes y visualmente agradables.
*   **Axios**: Gestión de peticiones HTTP al servidor.
*   **React Router**: Manejo de la navegación entre páginas.

### Backend (Servidor y Datos)
*   **Python + FastAPI**: Servidor de alto rendimiento para la lógica de negocio y API REST.
*   **Beanie (MongoDB ODM)**: Mapeo de objetos para interactuar con la base de datos MongoDB.
*   **ReportLab**: Librería para la generación dinámica de documentos PDF (Recetas).
*   **Pydantic**: Validación de datos y esquemas.

---

## 3. Módulos y Funcionalidades Detalladas

A continuación, se describe exhaustivamente cada sección del sistema y sus capacidades.

### A. Autenticación y Seguridad
El sistema está protegido mediante un mecanismo de autenticación seguro.
*   **Login**: Pantalla de acceso para usuarios autorizados (Veterinarios/Admin).
*   **Protección de Rutas**: Sistema de "Guardias" que impide el acceso a URL internas sin una sesión activa.
*   **Gestión de Sesión**: Control de estado de autenticación a través de `AuthContext`.

### B. Dashboard (Panel de Control)
El punto de entrada principal que ofrece una visión global del estado de la clínica.
*   **KPIs (Indicadores Clave)**: Tarjetas estadísticas que muestran:
    *   Total de Pacientes registrados.
    *   Consultas y atenciones agendadas para el día de hoy.
    *   Total de Tutores en el sistema.
*   **Modal de Bienvenida**: Al ingresar, se muestra un resumen con los pacientes citados para el día.
*   **Atenciones de Hoy**: Lista detallada de las consultas del día corriente, mostrando hora, paciente, especie y motivo.
*   **Próximas Atenciones**: Previsualización de citas futuras.

### C. Agenda Médica
Un módulo completo para la gestión del tiempo y citas.
*   **Vista de Calendario Mensual**:
    *   Visualización clara de todo el mes.
    *   Indicadores visuales en los días con citas programadas.
    *   Navegación intuitiva entre meses.
*   **Detalle Diario (Sidebar)**:
    *   Al seleccionar un día en el calendario, el panel lateral muestra todas las citas de esa fecha ordenadas por hora.
*   **Agendamiento Rápido**:
    *   Permite crear una nueva cita seleccionando Paciente (búsqueda predictiva), Fecha, Hora, Motivo Varios y Notas Adicionales.
*   **Gestión de Citas (Modales)**:
    *   **Ver Detalle**: Muestra información completa de la cita.
    *   **Ir a Ficha**: Acceso directo a la historia clínica del paciente desde la cita.
    *   **Reagendar**: Opción para cambiar fecha/hora, con notificación automática al tutor (vía email/sistema).
    *   **Eliminar**: Cancelación de citas con confirmación de seguridad.

### D. Gestión de Tutores (`/tutores`)
Administración de los propietarios de las mascotas.
*   **Listado General**: Tabla con todos los tutores, permitiendo búsqueda y filtrado.
*   **Perfil del Tutor**:
    *   Información de contacto (Nombre, Dirección, Teléfono, Email).
    *   **Mascotas Asociadas**: Visualización directa de todos los pacientes pertenecientes a ese tutor.
*   **CRUD Completo**: Funciones para Crear, Ver, Editar y Eliminar registros de tutores.

### E. Gestión de Pacientes (`/pacientes`)
El núcleo clínico del sistema. Se almacena toda la información relevante de las mascotas.
*   **Ficha de Identificación**:
    *   Datos: Nombre, Especie (Perro/Gato/Otro), Raza, Sexo, Color, Fecha de Nacimiento (con cálculo automático de edad), Peso, Alergias y Notas Generales.
    *   Vinculación con Tutor principal (y opcionalmente un segundo tutor).
*   **Historial Clínico (Pestañas)**:
    *   **Consultas**: Historial cronológico de todas las visitas médicas del paciente.
    *   **Recetas**: Archivo de todas las recetas emitidas para el paciente.
*   **Navegación Cruzada**: Enlaces rápidos para ver los datos del tutor desde la ficha del paciente.

### F. Consulta Médica
Módulo para el registro detallado de la atención veterinaria.
*   **Registro de Datos Clínicos**:
    *   **Anamnesis**: Historia y motivo de consulta.
    *   **Examen Físico**: Hallazgos observados por el profesional.
    *   **Diagnóstico**: Conclusión médica.
    *   **Tratamiento**: Procedimientos realizados en la consulta.
    *   **Exámenes Solicitados**: Laboratorio o imágenes requeridas.
*   **Archivos Adjuntos**: Capacidad de vincular documentos o resultados de exámenes a la consulta.
*   **Estado de la Consulta**: Control de estados como "Agendada", "Atendida" o "No Presentó".

### G. Recetas y Prescripciones (Generador PDF)
Sistema avanzado de emisión de recetas médicas digitalizadas.
*   **Creación de Receta**:
    *   Selección de Paciente.
    *   **Ítems Farmacológicos**: Agregar múltiples medicamentos especificando:
        *   Nombre del medicamento.
        *   Dosis.
        *   Frecuencia (cada cuántas horas).
        *   Duración (días).
        *   Instrucciones especiales (ej. "dar con comida").
    *   **Indicaciones Generales**: Texto libre para cuidados en casa o recomendaciones adicionales.
*   **Generación de PDF (`reportlab`)**:
    *   El sistema genera un archivo PDF profesional automáticamente.
    *   **Plantilla Gráfica**: Utiliza un fondo personalizado (`recetario.png`) con la imagen corporativa.
    *   **Datos Dinámicos**: Inserta automáticamente:
        *   Fecha actual.
        *   Datos del Responsable (Nombre y Dirección).
        *   Datos del Paciente (Nombre, Especie, Raza, Sexo).
        *   Cuerpo de la receta (Rp.) con formato de lista ordenado.
        *   Pie de página con datos de contacto de la Dra. Patty Pizarro.
*   **Descarga e Historial**: Las recetas quedan guardadas y pueden volver a descargarse o visualizarse en cualquier momento.

### H. Ajustes (`/ajustes`)
Configuración del sistema.
*   Gestión de datos del profesional.
*   Configuración de firma digital (para automatizar su aparición en documentos).
*   Parámetros generales de la clínica (VetSettings).

---

## 4. Flujo de Trabajo Típico (Ejemplo)

1.  **Recepción**: El veterinario ingresa al **Dashboard** y ve que tiene una cita con "Luna" a las 10:00 AM.
2.  **Atención**: Hace clic en la cita del Dashboard o Agenda y selecciona **"Ver Ficha Clínica"**.
3.  **Consulta**: En la ficha de "Luna", inicia una nueva **Consulta**. Registra que Luna viene por "Vómitos", escribe el examen físico y el diagnóstico.
4.  **Prescripción**: Decide recetar un antiemético. Va a la pestaña **Recetas**, crea una nueva, agrega el medicamento con su dosis y genera el PDF.
5.  **Finalización**: Guarda la consulta como "Atendida" y entrega (imprime o envía) el PDF de la receta al tutor.

---

Este documento cubre la totalidad de las funciones operativas del proyecto WEB Paty v1.0, asegurando que cualquier usuario o desarrollador comprenda el alcance y profundidad de la herramienta.
