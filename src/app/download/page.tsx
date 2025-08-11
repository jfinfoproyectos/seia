"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  Monitor, 
  ArrowLeft, 
  Shield, 
  CheckCircle, 
  Clock,
  PenTool,
  FileText,
  Zap,
  Code
} from "lucide-react";
import ThemeToggle from "@/components/theme/ThemeToggle";
import Link from "next/link";

export default function DownloadPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const downloadOptions = [
    {
      id: "windows",
      name: "Windows",
      icon: Monitor,
      version: "v1.0.0",
      size: "45.2 MB",
      requirements: "Windows 10 o superior",
      downloadUrl: "https://drive.google.com/file/d/1h8Pmxs4RA5ajaO1zgRmhEWgmNKJ7pxG4/view?usp=sharing",
      color: "bg-blue-500",
      description: "Aplicación de escritorio para Windows 10, 11 (64-bit)"
    },
    {
      id: "vscode",
      name: "VS Code Extension",
      icon: Code,
      version: "v1.0.0",
      size: "2.5 MB",
      requirements: "Visual Studio Code 1.60+",
      downloadUrl: "https://marketplace.visualstudio.com/items?itemName=seia.student-evaluation",
      color: "bg-purple-500",
      description: "Extensión para Visual Studio Code con todas las funciones"
    }
  ];

  const features = [
    {
      icon: Shield,
      title: "Entorno Seguro",
      description: "Aplicación aislada que previene el acceso a otras aplicaciones durante la evaluación"
    },
    {
      icon: Clock,
      title: "Control de Tiempo",
      description: "Cronómetro integrado que respeta los límites de tiempo establecidos por el profesor"
    },
    {
      icon: FileText,
      title: "Múltiples Formatos",
      description: "Soporte para preguntas de texto, código, audio y archivos multimedia"
    },
    {
      icon: Zap,
      title: "Sincronización Automática",
      description: "Guarda automáticamente las respuestas y sincroniza con el servidor"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/90 dark:from-background dark:to-black/50">
      <header className="flex justify-between items-center p-4 md:p-6 h-16 border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver al inicio
            </Link>
          </Button>
          <div className="flex items-center gap-2 glow-effect">
            <PenTool className="h-6 w-6 text-primary blur-effect" />
            <span className="font-bold text-lg">SEIA</span>
          </div>
        </div>
        <ThemeToggle />
      </header>

      <main className="container mx-auto px-4 py-12 md:py-24 space-y-16">
        {/* Hero Section */}
        <section className="text-center space-y-6 fade-in">
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2 animate-pulse">
            Aplicación para Estudiantes
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Descarga <span className="text-primary glow-effect">SEIA Student</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Aplicación dedicada para presentar evaluaciones de forma segura. 
            Disponible como aplicación de escritorio para Windows y como extensión de Visual Studio Code 
            con todas las funciones necesarias para una experiencia de evaluación óptima.
          </p>
        </section>

        {/* Download Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {downloadOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <Card key={option.id} className="group relative overflow-hidden border border-border/50 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardHeader className="relative z-10 text-center">
                  <div className={`flex items-center justify-center w-16 h-16 ${option.color} rounded-xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold">{option.name}</CardTitle>
                  <CardDescription>{option.description}</CardDescription>
                </CardHeader>
                <CardContent className="relative z-10 space-y-4">
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>Versión: {option.version}</span>
                    <Badge variant="secondary">{option.size}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{option.requirements}</p>
                  <Button 
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300" 
                    size="lg"
                    onClick={() => window.open(option.downloadUrl, '_blank')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Descargar para {option.name}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gradient-to-br from-muted/30 via-background/50 to-muted/30 rounded-3xl backdrop-blur-sm">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 glow-effect">¿Por qué usar la aplicación SEIA Student?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              La aplicación dedicada ofrece un entorno controlado y seguro para presentar evaluaciones
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="group relative p-6 bg-background/80 backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Instructions Section */}
        <section className="py-16 fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">¿Cómo usar SEIA Student?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-5xl mx-auto">
            {/* Paso 1 */}
            <div className="relative p-6 bg-background/50 backdrop-blur-sm rounded-xl border border-border/50 card-hover glow-effect">
              <div className="absolute -top-4 -left-4 bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold">
                01
              </div>
              <div className="pt-6">
                <Download className="h-10 w-10 text-primary" />
                <h3 className="text-xl font-bold mt-4 mb-2">Descarga e Instala</h3>
                <p className="text-muted-foreground">Descarga la aplicación para tu sistema operativo e instálala siguiendo las instrucciones.</p>
              </div>
            </div>
            {/* Paso 2 */}
            <div className="relative p-6 bg-background/50 backdrop-blur-sm rounded-xl border border-border/50 card-hover glow-effect">
              <div className="absolute -top-4 -left-4 bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold">
                02
              </div>
              <div className="pt-6">
                <FileText className="h-10 w-10 text-blue-500" />
                <h3 className="text-xl font-bold mt-4 mb-2">Ingresa tu Código</h3>
                <p className="text-muted-foreground">Abre la aplicación e introduce el código único proporcionado por tu profesor.</p>
              </div>
            </div>
            {/* Paso 3 */}
            <div className="relative p-6 bg-background/50 backdrop-blur-sm rounded-xl border border-border/50 card-hover glow-effect">
              <div className="absolute -top-4 -left-4 bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold">
                03
              </div>
              <div className="pt-6">
                <CheckCircle className="h-10 w-10 text-green-500" />
                <h3 className="text-xl font-bold mt-4 mb-2">Presenta tu Evaluación</h3>
                <p className="text-muted-foreground">Responde las preguntas en el entorno seguro y recibe retroalimentación inmediata.</p>
              </div>
            </div>
          </div>
        </section>

        {/* System Requirements */}
        <section className="py-16 px-8 bg-primary/10 rounded-3xl">
          <h2 className="text-3xl font-bold text-center mb-8">Requisitos del Sistema</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5 text-blue-500" />
                  Aplicación Windows
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>• Windows 10 o superior (64-bit)</p>
                <p>• 4 GB RAM mínimo</p>
                <p>• 100 MB espacio libre</p>
                <p>• Conexión a internet</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-purple-500" />
                  Extensión VS Code
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>• Visual Studio Code 1.60 o superior</p>
                <p>• 2 GB RAM mínimo</p>
                <p>• 10 MB espacio libre</p>
                <p>• Conexión a internet</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Support Section */}
        <section className="text-center space-y-6 fade-in">
          <h2 className="text-3xl font-bold">¿Necesitas ayuda?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Si tienes problemas con la descarga o instalación, contacta a tu profesor o administrador del sistema.
          </p>
          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <Button variant="outline" size="lg" className="rounded-full px-8">
              Guía de Instalación
            </Button>
            <Button variant="outline" size="lg" className="rounded-full px-8">
              Preguntas Frecuentes
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/40 py-8 mt-12 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 glow-effect mb-4">
            <PenTool className="h-6 w-6 text-primary blur-effect" />
            <span className="font-bold text-xl">SEIA</span>
          </div>
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Sistema de Evaluación con Inteligencia Artificial. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}