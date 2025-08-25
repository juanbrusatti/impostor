
# Juego del Impostor ⚽

Este proyecto es una aplicación web interactiva para jugar al "Juego del Impostor" con futbolistas. Permite seleccionar una categoría de jugadores, personalizar la lista, asignar roles y mostrar cartas para cada participante.

## Características
- Selección de categorías de futbolistas (presets precargados y opción personalizada)
- Personalización de la lista de jugadores
- Asignación de roles: inocentes e impostores
- Visualización de cartas interactivas para cada jugador
- Diseño responsivo y optimizado para dispositivos móviles
- Scroll automático en la vista de cartas para grupos grandes
- Interfaz moderna con React, Next.js y Tailwind CSS

## Instalación
1. Clona el repositorio:
	```bash
	git clone https://github.com/tu-usuario/juego-impostor.git
	```
2. Instala las dependencias:
	```bash
	cd juego-impostor
	npm install
	```
3. Inicia el servidor de desarrollo:
	```bash
	npm run dev
	```
4. Abre la app en tu navegador en `http://localhost:3000`

## Estructura del proyecto
```
├── src/
│   ├── app/
│   │   ├── layout.js
│   │   ├── page.js
│   │   └── globals.css
│   ├── components/
│   │   ├── GameModeSelector.js
│   │   ├── PresetSelector.js
│   │   ├── RoleSelector.js
│   └── data/
│       └── playerPresets.js
├── public/
│   └── ... (assets)
├── package.json
├── tailwind.config.js
├── next.config.mjs
└── README.md
```

## Tecnologías utilizadas
- React
- Next.js
- Tailwind CSS
- PostCSS

## Uso
1. Selecciona el modo de juego y la categoría de futbolistas.
2. Personaliza la lista si lo deseas.
3. Configura la cantidad de inocentes e impostores.
4. Visualiza las cartas y juega con tu grupo.

## Contribuciones
¡Las contribuciones son bienvenidas! Puedes abrir issues o enviar pull requests para mejorar el juego.

## Licencia
Este proyecto está bajo la licencia MIT.

---
Hecho con ❤️ por Delay 🐢 y colaboradores.
