// src/components/Sonner.tsx
import React from 'react';

import { toast as _toast, Toaster as _Toaster } from 'sonner';

// Exporta el hook toast para usar en cualquier parte
export const toast = _toast;

// Componente Toaster, que usarás una sola vez en tu App
export function Toaster() {
  return (
    <_Toaster
      position="top-right"    // posición
      richColors             // colores ricos
      toastOptions={{        // configuración por defecto
        duration: 4000,
        style: { fontSize: '0.95rem' }
      }}
    />
  );
}
