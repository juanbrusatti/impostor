# Juego del Impostor - Versión Online

## 🚀 Cómo ejecutar el proyecto

### Opción 1: Ejecutar todo junto (Recomendado)
```bash
npm run dev:full
```

Esto iniciará tanto el frontend (puerto 3000) como el backend (puerto 3001) simultáneamente.

### Opción 2: Ejecutar por separado

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## 🌐 Cómo jugar online

1. **Abrir el juego** en `http://localhost:3000`
2. **Seleccionar "Multijugador en Línea"**
3. **Crear una sala** o **unirse a una existente**
4. **Compartir el código** de la sala con otros jugadores
5. **Esperar** a que todos se unan
6. **Iniciar el juego** (solo el anfitrión puede hacerlo)

## 📱 Jugar desde otros dispositivos

Para jugar desde otros dispositivos en la misma red:

1. **Encontrar la IP de tu computadora** (ej: `192.168.1.100`)
2. **Acceder desde otros dispositivos** a `http://192.168.1.100:3000`
3. **Usar el mismo código de sala** para unirse

## 🔧 Configuración del servidor

El backend corre en el puerto 3001 por defecto. Si necesitas cambiar el puerto:

1. Editar `backend/server.js`
2. Cambiar la línea: `const PORT = process.env.PORT || 3001;`
3. Reiniciar el servidor

## 🐛 Solución de problemas

### "Sala no encontrada"
- Asegúrate de que el backend esté corriendo (`npm run dev:backend`)
- Verifica que estés usando el código correcto
- Confirma que la sala no haya sido eliminada

### "Error de conexión"
- Verifica que ambos servidores estén corriendo
- Revisa que no haya firewall bloqueando el puerto 3001
- Intenta reiniciar ambos servidores

### Problemas de red
- Asegúrate de que todos los dispositivos estén en la misma red WiFi
- Verifica que la IP sea accesible desde otros dispositivos

## 📁 Estructura del proyecto

```
juego-impostor/
├── src/
│   ├── app/           # Frontend principal
│   ├── components/    # Componentes React
│   └── utils/         # Utilidades (roomService)
├── backend/
│   └── server.js      # Servidor Socket.IO
└── package.json
```

## 🛠️ Tecnologías utilizadas

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Node.js, Express, Socket.IO
- **Comunicación**: WebSockets en tiempo real
