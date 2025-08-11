# API de Validación de Códigos de Evaluación

## Descripción
Esta API valida códigos de evaluación usando Prisma para verificar si un código es válido para presentar una prueba. Está basada en la misma lógica de validación que usa el módulo de estudiantes.

## Endpoint
```
GET /api/getWebPage?code={codigo_evaluacion}
```

## Parámetros
- `code` (string, requerido): Código único de la evaluación a validar

## Validaciones Realizadas

### 1. Validación de Formato
- El código no puede estar vacío
- Debe tener al menos 6 caracteres

### 2. Validación en Base de Datos
- Verifica que el código exista en la tabla `Attempt`
- Busca el intento asociado con su evaluación

### 3. Validación de Tiempo
- Verifica que la evaluación haya comenzado (`startTime`)
- Verifica que la evaluación no haya finalizado (`endTime`)

## Respuestas

### Código Válido (200)
```json
{
  "url": "http://localhost:3000/student",
  "valid": true,
  "evaluation": {
    "title": "Título de la evaluación",
    "description": "Descripción de la evaluación",
    "durationMinutes": 120,
    "startTime": "2024-01-15T10:00:00.000Z",
    "endTime": "2024-01-15T12:00:00.000Z"
  }
}
```

### Código Inválido (400)
```json
{
  "error": "Mensaje de error específico",
  "valid": false
}
```

### Error del Servidor (500)
```json
{
  "error": "Error interno del servidor",
  "valid": false
}
```

## Ejemplos de Uso

### Código válido y evaluación activa
```bash
curl "http://localhost:3000/api/getWebPage?code=ABC12345"
```

### Código vacío
```bash
curl "http://localhost:3000/api/getWebPage?code="
# Respuesta: {"error": "Código de evaluación requerido", "valid": false}
```

### Código muy corto
```bash
curl "http://localhost:3000/api/getWebPage?code=123"
# Respuesta: {"error": "El código de evaluación debe tener al menos 6 caracteres", "valid": false}
```

### Código no encontrado
```bash
curl "http://localhost:3000/api/getWebPage?code=NOEXISTE"
# Respuesta: {"error": "Código de evaluación no válido o no encontrado", "valid": false}
```

### Evaluación no iniciada
```bash
curl "http://localhost:3000/api/getWebPage?code=FUTURO01"
# Respuesta: {"error": "La evaluación aún no ha comenzado", "valid": false}
```

### Evaluación finalizada
```bash
curl "http://localhost:3000/api/getWebPage?code=PASADO01"
# Respuesta: {"error": "La evaluación ya ha finalizado", "valid": false}
```

## Configuración de Variables de Entorno

La API utiliza las siguientes variables de entorno para determinar la URL base:

- `NEXTAUTH_URL`: URL principal de la aplicación (prioridad alta)
- `AUTH_URL`: URL alternativa de autenticación (prioridad media)
- Fallback: `http://localhost:3000` (si no se encuentran las variables anteriores)

### Configuración en .env
```env
AUTH_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
```

## Estructura de la Base de Datos

La API consulta las siguientes tablas:
- `Attempt`: Para buscar el código único y verificar tiempos
- `Evaluation`: Para obtener información de la evaluación

## Archivos Relacionados
- `route.ts`: Endpoint principal de la API
- `actions.ts`: Server action con la lógica de validación
- `../student/evaluation/actions.ts`: Lógica original de validación (referencia)

## Notas Técnicas
- Usa `nowUTC()` para comparaciones de tiempo consistentes
- Maneja errores de base de datos de forma segura
- Retorna información mínima necesaria para evitar exposición de datos sensibles