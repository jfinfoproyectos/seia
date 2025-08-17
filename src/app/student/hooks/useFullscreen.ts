'use client'

import { useState, useEffect, useCallback } from 'react'

/**
 * Hook personalizado para manejar el modo de pantalla completa
 * Proporciona funciones para entrar, salir y alternar el modo de pantalla completa
 */
export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isSupported, setIsSupported] = useState(false)

  // Verificar si el navegador soporta la API de pantalla completa
  useEffect(() => {
    const checkSupport = () => {
      return !!(document.documentElement.requestFullscreen ||
        (document.documentElement as any).webkitRequestFullscreen ||
        (document.documentElement as any).mozRequestFullScreen ||
        (document.documentElement as any).msRequestFullscreen)
    }
    
    setIsSupported(checkSupport())
  }, [])

  // Función para entrar en modo de pantalla completa
  const enterFullscreen = useCallback(async () => {
    if (!isSupported) return false

    try {
      const element = document.documentElement
      
      if (element.requestFullscreen) {
        await element.requestFullscreen()
      } else if ((element as any).webkitRequestFullscreen) {
        await (element as any).webkitRequestFullscreen()
      } else if ((element as any).mozRequestFullScreen) {
        await (element as any).mozRequestFullScreen()
      } else if ((element as any).msRequestFullscreen) {
        await (element as any).msRequestFullscreen()
      }
      
      return true
    } catch (error) {
      console.error('Error al entrar en pantalla completa:', error)
      return false
    }
  }, [isSupported])

  // Función para salir del modo de pantalla completa
  const exitFullscreen = useCallback(async () => {
    if (!isSupported) return false

    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen()
      } else if ((document as any).webkitExitFullscreen) {
        await (document as any).webkitExitFullscreen()
      } else if ((document as any).mozCancelFullScreen) {
        await (document as any).mozCancelFullScreen()
      } else if ((document as any).msExitFullscreen) {
        await (document as any).msExitFullscreen()
      }
      
      return true
    } catch (error) {
      console.error('Error al salir de pantalla completa:', error)
      return false
    }
  }, [isSupported])

  // Función para alternar entre modo de pantalla completa y ventana
  const toggleFullscreen = useCallback(async () => {
    if (isFullscreen) {
      return await exitFullscreen()
    } else {
      return await enterFullscreen()
    }
  }, [isFullscreen, enterFullscreen, exitFullscreen])

  // Escuchar cambios en el estado de pantalla completa
  useEffect(() => {
    const handleFullscreenChange = () => {
      const fullscreenElement = document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      
      setIsFullscreen(!!fullscreenElement)
    }

    // Agregar event listeners para diferentes navegadores
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('mozfullscreenchange', handleFullscreenChange)
    document.addEventListener('MSFullscreenChange', handleFullscreenChange)

    // Cleanup
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
    }
  }, [])

  return {
    isFullscreen,
    isSupported,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen
  }
}