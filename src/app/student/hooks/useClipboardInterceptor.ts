import { useEffect, useRef, useCallback, useState } from 'react';

interface ClipboardInterceptorOptions {
  enabled?: boolean;
  warningMessage?: string;
  updateInterval?: number; // en milisegundos
}

interface ClipboardInterceptorReturn {
  isEnabled: boolean;
  enable: () => void;
  disable: () => void;
  toggle: () => void;
  warningMessage: string;
}

/**
 * Hook personalizado para modificar periódicamente el contenido del portapapeles.
 * Actualiza automáticamente el portapapeles con una frase de advertencia de fraude.
 */
export const useClipboardInterceptor = ({
  enabled = false,
  warningMessage = "No es posible pegar en esta aplicación. ¡Inténtalo por ti mismo!",
  updateInterval = 1000 // 7 segundos
}: ClipboardInterceptorOptions = {}): ClipboardInterceptorReturn => {
  const [isEnabled, setIsEnabled] = useState(enabled);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isInterceptingRef = useRef(false);

  // Función para escribir en el portapapeles
  const writeToClipboard = useCallback(async (text: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback para navegadores más antiguos
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
    } catch (error) {
      console.warn('[ClipboardInterceptor] Error al escribir en portapapeles:', error);
    }
  }, []);

  // Funciones de eventos removidas - solo actualización periódica automática

  // Actualización periódica del portapapeles
  const startPeriodicUpdate = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      if (isEnabled) {
        isInterceptingRef.current = true;
        writeToClipboard(warningMessage).finally(() => {
          isInterceptingRef.current = false;
        });
      }
    }, updateInterval);
  }, [isEnabled, warningMessage, updateInterval, writeToClipboard]);

  // Detener actualización periódica
  const stopPeriodicUpdate = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Funciones de control
  const enable = useCallback(() => {
    setIsEnabled(true);
    // Escribir inmediatamente la advertencia al habilitar
    writeToClipboard(warningMessage);
  }, [writeToClipboard, warningMessage]);

  const disable = useCallback(() => {
    setIsEnabled(false);
  }, []);

  const toggle = useCallback(() => {
    setIsEnabled(prev => !prev);
  }, []);

  // Efecto para manejar solo la actualización periódica
  useEffect(() => {
    if (isEnabled) {
      // Iniciar actualización periódica
      startPeriodicUpdate();
      
      console.log('[ClipboardInterceptor] Actualización periódica habilitada');
    } else {
      // Detener actualización periódica
      stopPeriodicUpdate();
      
      console.log('[ClipboardInterceptor] Actualización periódica deshabilitada');
    }

    return () => {
      stopPeriodicUpdate();
    };
  }, [isEnabled, startPeriodicUpdate, stopPeriodicUpdate]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      stopPeriodicUpdate();
    };
  }, [stopPeriodicUpdate]);

  return {
    isEnabled,
    enable,
    disable,
    toggle,
    warningMessage
  };
};