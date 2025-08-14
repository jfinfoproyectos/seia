import dynamic from 'next/dynamic';
// El hook useMarkdownConfig debe ser adaptado o eliminado si no existe en el contexto del profesor.
// Si no existe, puedes usar estilos básicos o crear hooks equivalentes en la carpeta del profesor.
import { useRef } from 'react';

// Carga diferida del visor de Markdown
const MDPreview = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default.Markdown),
  { ssr: false }
);

interface MarkdownViewerProps {
  content: string;
}

export const MarkdownViewer = ({ content }: MarkdownViewerProps) => {
  const viewerRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={viewerRef}
      className="absolute inset-0 mx-3 sm:mx-4"
    >
      <div className="h-full w-full border border-input rounded-md bg-transparent shadow-xs overflow-hidden">
        <MDPreview
          source={content}
          style={{
            overflowY: 'auto',
            height: '100%',
            padding: '1rem',
            border: 'none',
            borderRadius: '0',
            backgroundColor: 'transparent'
          }}
          className="prose prose-sm max-w-none dark:prose-invert"
        />
      </div>
    </div>
  );
};
