// Buscar la sección donde se manejan los comandos y agregar el nuevo caso para 'asado'
// Este es un fragmento ejemplar - adaptá según tu estructura actual

// En la función que procesa comandos (típicamente handleCommand o executeCommand):

const handleAsado = () => {
  return {
    type: 'output',
    content: ' Preparando la tira de asado y el matambre... fuego a punto.',
    isError: false
  };
};

// En el switch/if que evalúa el comando:
case 'asado':
  return handleAsado();

// O si usas un objeto de mapeo de comandos:
const COMMAND_HANDLERS = {
  // ... otros comandos
  asado: {
    execute: () => ({
      type: 'output',
      content: ' Preparando la tira de asado y el matambre... fuego a punto.',
      isError: false
    }),
    description: '🔥 Fire up the grill'
  },
  // ... resto de comandos
};