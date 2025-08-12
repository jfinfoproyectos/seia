import dynamic from 'next/dynamic';
import { useMonacoConfig } from '@/app/a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0/evaluation/hooks/useMonacoConfig';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { editor } from 'monaco-editor';

// Carga diferida del editor Monaco
const MonacoEditor = dynamic(
  () => import('@monaco-editor/react').then((mod) => mod.default),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full w-full bg-black rounded-lg">
        Cargando editor...
      </div>
    )
  }
);

interface CodeEditorProps {
  value: string;
  onChange: (value: string, element?: HTMLElement) => void;
  language: string;
  height?: string;
}

export const CodeEditor = ({ value, onChange, language, height = '100%' }: CodeEditorProps) => {
  const { getEditorOptions, currentTheme, defineCustomThemes } = useMonacoConfig();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [editorError, setEditorError] = useState<string | null>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);

  // Función para manejar cambios
  const handleChange = (newValue: string) => {
    try {
      // Obtener el elemento DOM del editor Monaco
      const editorElement = editorRef.current?.getDomNode();
      onChange(newValue, editorElement || undefined);
    } catch (error) {
      console.error('[CodeEditor] Error en handleChange:', error);
      setEditorError('Error al procesar el cambio en el editor');
    }
  };

  // Función para prevenir copiar y pegar
  const preventCopyPaste = useCallback((e: KeyboardEvent) => {
    // Prevenir Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+A
    if (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'x' || e.key === 'a')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    // Prevenir F12, Ctrl+Shift+I, Ctrl+U
    if (e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && e.key === 'I') || 
        (e.ctrlKey && e.key === 'u')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }, []);

  // Función para prevenir eventos del menú contextual
  const preventContextMenu = useCallback((e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }, []);

  // Manejo de errores del editor
  const handleEditorError = (error: unknown) => {
    console.error('[CodeEditor] Error del editor Monaco:', error);
    setEditorError('Error al cargar el editor de código');
  };

  // Limpiar error cuando el editor se monta correctamente
  useEffect(() => {
    if (isEditorReady && editorError) {
      setEditorError(null);
    }
  }, [isEditorReady, editorError]);

  if (editorError) {
    return (
      <div className="w-full h-full rounded-lg overflow-hidden">
        <div className="flex items-center justify-center h-full w-full bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <div className="text-center p-4">
            <p className="text-red-600 dark:text-red-400 mb-2">Error al cargar el editor</p>
            <p className="text-sm text-red-500 dark:text-red-300">{editorError}</p>
            <button 
              onClick={() => {
                setEditorError(null);
                setIsEditorReady(false);
              }}
              className="mt-2 px-3 py-1 text-xs bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 rounded hover:bg-red-200 dark:hover:bg-red-700"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 mx-3 sm:mx-4">
      <div className="w-full h-full border border-input rounded-md bg-transparent shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-1 focus-within:ring-ring overflow-hidden" style={{ padding: '1rem' }}>
        <MonacoEditor
          height={height}
          language={language}
          value={value}
          onChange={(value) => handleChange(value || '')}
          options={{
            ...getEditorOptions(window.innerWidth < 640),
            padding: { top: 0, bottom: 0 },
          }}
          theme={currentTheme}
          defaultValue=""
          loading={
            <div className="flex items-center justify-center h-full w-full bg-background rounded-lg">
              Cargando editor...
            </div>
          }
          onMount={(editor, monaco) => {
            try {
              // Definir temas personalizados primero
              defineCustomThemes(monaco);
              
              editorRef.current = editor;
              setIsEditorReady(true);

              const updateEditorOptions = () => {
                try {
                  const isMobile = window.innerWidth < 640;
                  editor.updateOptions({
                    ...getEditorOptions(isMobile),
                    padding: { top: 8, bottom: 8 },
                  });
                } catch (error) {
                  console.error('[CodeEditor] Error al actualizar opciones:', error);
                }
              };

              // Configurar opciones del editor para deshabilitar copiar/pegar
              editor.updateOptions({ 
                padding: { top: 8, bottom: 8 },
                // Deshabilitar acciones de copiar/pegar
                contextmenu: false,
                // Deshabilitar selección múltiple
                multiCursorModifier: 'alt',
                // Deshabilitar drag and drop
                dragAndDrop: false,
              });

              // Deshabilitar acciones específicas del editor
              editor.addAction({
                id: 'disable-copy',
                label: 'Disable Copy',
                keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyC],
                run: () => {
                  // No hacer nada - deshabilitar copiar
                  return;
                }
              });

              editor.addAction({
                id: 'disable-paste',
                label: 'Disable Paste',
                keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyV],
                run: () => {
                  // No hacer nada - deshabilitar pegar
                  return;
                }
              });

              editor.addAction({
                id: 'disable-cut',
                label: 'Disable Cut',
                keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyX],
                run: () => {
                  // No hacer nada - deshabilitar cortar
                  return;
                }
              });

              editor.addAction({
                id: 'disable-select-all',
                label: 'Disable Select All',
                keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyA],
                run: () => {
                  // No hacer nada - deshabilitar seleccionar todo
                  return;
                }
              });

              // Obtener el elemento DOM del editor
              const editorDomNode = editor.getDomNode();
              if (editorDomNode) {
                // Agregar event listeners para prevenir copiar/pegar
                editorDomNode.addEventListener('keydown', preventCopyPaste, true);
                editorDomNode.addEventListener('contextmenu', preventContextMenu, true);
                
                // Prevenir eventos de clipboard
                editorDomNode.addEventListener('copy', (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }, true);
                
                editorDomNode.addEventListener('paste', (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }, true);
                
                editorDomNode.addEventListener('cut', (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }, true);
              }

              editor.layout();

              window.addEventListener('resize', updateEditorOptions);
              return () => {
                window.removeEventListener('resize', updateEditorOptions);
                // Limpiar event listeners
                if (editorDomNode) {
                  editorDomNode.removeEventListener('keydown', preventCopyPaste, true);
                  editorDomNode.removeEventListener('contextmenu', preventContextMenu, true);
                }
              };
            } catch (error) {
              console.error('[CodeEditor] Error en onMount:', error);
              handleEditorError(error);
            }
          }}
          onValidate={(markers) => {
            // Manejar errores de validación del editor
            if (markers && markers.length > 0) {
              const errors = markers.filter(marker => marker.severity === 8); // Error severity
              if (errors.length > 0) {
                console.warn('[CodeEditor] Errores de validación:', errors);
              }
            }
          }}
        />
      </div>
    </div>
  );
};