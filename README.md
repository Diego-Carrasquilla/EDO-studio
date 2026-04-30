# EDO Studio

Aplicación web interactiva para visualizar y simular ecuaciones diferenciales ordinarias (EDO) y modelos SIR de epidemiología.

## 📋 Requisitos previos

- **Node.js** versión 16 o superior
- **npm** (incluido con Node.js)
- **Git** (opcional, para clonar el repositorio)

## 🚀 Descarga e instalación

### Opción 1: Usando Git (recomendado)

```bash
# Clonar el repositorio
git clone <URL-DEL-REPOSITORIO>

# Navegar al directorio del proyecto
cd EDO

# Instalar las dependencias
npm install
```

### Opción 2: Descargar como ZIP

1. Ve a la página del repositorio
2. Haz clic en el botón "Code" (verde)
3. Selecciona "Download ZIP"
4. Extrae el archivo ZIP en tu equipo
5. Abre una terminal en la carpeta del proyecto
6. Ejecuta:
   ```bash
   npm install
   ```

## 💻 Ejecutar la aplicación

### Modo de desarrollo (con auto-recarga)

```bash
npm run dev
```

Esto abrirá la aplicación en `http://localhost:5173` (o el puerto que indique en la terminal). Los cambios se reflejarán automáticamente.

### Compilar para producción

```bash
npm run build
```

Esto genera los archivos optimizados en la carpeta `dist/`.

### Ver la compilación en local

```bash
npm run preview
```

Esto permite previsualizar cómo se verá la aplicación compilada.

## 📦 Dependencias principales

- **React** - Librería de UI
- **Vite** - Herramienta de build ultrarrápida
- **Recharts** - Gráficos e visualizaciones
- **Framer Motion** - Animaciones
- **Lucide React** - Iconos
- **React Syntax Highlighter** - Resaltado de código

## 📁 Estructura del proyecto

```
EDO/
├── public/              # Archivos estáticos
├── src/
│   ├── components/      # Componentes React reutilizables
│   ├── data/            # Datos de modelos
│   ├── utils/           # Funciones utilitarias (solvers de ecuaciones)
│   ├── App.jsx          # Componente principal
│   ├── main.jsx         # Punto de entrada
│   └── styles.css       # Estilos globales
├── index.html           # HTML principal
├── vite.config.js       # Configuración de Vite
└── package.json         # Dependencias y scripts
```

## 🛠️ Comandos disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Compila la aplicación para producción |
| `npm run preview` | Visualiza la compilación en local |

## 🐛 Solución de problemas

### Error: "npm: command not found"
- Instala [Node.js](https://nodejs.org/) desde el sitio oficial

### Error: "Cannot find module"
- Ejecuta `npm install` para instalar las dependencias

### Puerto 5173 ya está en uso
- Vite usará automáticamente el siguiente puerto disponible, o puedes especificar uno:
  ```bash
  npm run dev -- --port 3000
  ```

## 📝 Licencia

Acceso publico

---

¿Preguntas o problemas? Abre un issue en el repositorio o contáctame directamente.
