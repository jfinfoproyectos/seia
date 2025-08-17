import dynamic from 'next/dynamic';
import { useMonacoConfig } from '../hooks/useMonacoConfig';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { editor } from 'monaco-editor';

// Declaración de tipo para window.monaco
declare global {
  interface Window {
    monaco: {
      editor: {
        setTheme: (theme: string) => void;
      };
    };
  }
}

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

  // Funciones de prevención removidas - editor sin restricciones

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

  // Actualizar tema del editor cuando cambie el tema de la aplicación
  useEffect(() => {
    if (isEditorReady && editorRef.current && window.monaco) {
      try {
        window.monaco.editor.setTheme(currentTheme);
      } catch (error) {
        console.error('[CodeEditor] Error al actualizar tema:', error);
      }
    }
  }, [currentTheme, isEditorReady]);

  // Función para formatear el código
  const formatCode = useCallback(() => {
    if (editorRef.current && isEditorReady) {
      try {
        editorRef.current.getAction('editor.action.formatDocument')?.run();
      } catch (error) {
        console.error('[CodeEditor] Error al formatear código:', error);
      }
    }
  }, [isEditorReady]);

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
      <div className="w-full h-full border border-input rounded-md bg-transparent shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-1 focus-within:ring-ring overflow-hidden relative">
        <MonacoEditor
          height={height}
          language={language}
          value={value}
          onChange={(value) => handleChange(value || '')}
          options={{
            ...getEditorOptions(window.innerWidth < 640),
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
              
              // Aplicar el tema después de definir los temas personalizados
              monaco.editor.setTheme(currentTheme);
              
              editorRef.current = editor;
              setIsEditorReady(true);

              const updateEditorOptions = () => {
                try {
                  const isMobile = window.innerWidth < 640;
                  editor.updateOptions({
                    ...getEditorOptions(isMobile),
                  });
                } catch (error) {
                  console.error('[CodeEditor] Error al actualizar opciones:', error);
                }
              };

              // Configurar opciones del editor sin restricciones
              editor.updateOptions({ 
                // Habilitar menú contextual
                contextmenu: true,
                // Habilitar selección múltiple
                multiCursorModifier: 'ctrlCmd',
                // Habilitar drag and drop
                dragAndDrop: true,
              });

              // Deshabilitar acciones específicas del editor
              // Acciones restrictivas removidas - funcionalidad completa habilitada

              // Event listeners restrictivos removidos - funcionalidad completa del editor

              editor.layout();

              window.addEventListener('resize', updateEditorOptions);
              return () => {
                window.removeEventListener('resize', updateEditorOptions);
                // Event listeners restrictivos removidos
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
        
        {/* Texto de formato en la esquina inferior derecha */}
        {isEditorReady && (
          <div 
            className="absolute bottom-2 right-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer select-none transition-colors duration-200 bg-background/80 backdrop-blur-sm px-2 py-1 rounded border border-border/50 hover:border-border"
            onClick={formatCode}
            title="Formatear código"
          >
            Formatear
          </div>
        )}
      </div>
    </div>
  );
};