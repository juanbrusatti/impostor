// Script de prueba para verificar la conectividad del servidor
const testServerConnection = () => {
  const testUrl = 'http://localhost:3001';
  
  fetch(testUrl)
    .then(response => response.json())
    .then(data => {
      console.log('✅ Servidor backend funcionando:', data);
    })
    .catch(error => {
      console.error('❌ Error conectando al servidor:', error);
    });
};

// Ejecutar prueba cuando se carga la página
if (typeof window !== 'undefined') {
  window.addEventListener('load', testServerConnection);
}

export { testServerConnection };
