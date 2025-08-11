'use server';

import { prisma } from '@/lib/prisma';
import { nowUTC, isBeforeUTC, isAfterUTC } from '@/lib/date-utils';

/**
 * Valida si un código de evaluación es válido para presentar la prueba
 * Basado en la lógica de getAttemptByUniqueCode del módulo de estudiantes
 */
export async function validateEvaluationCode(uniqueCode: string) {
  try {
    // Validar que el código no esté vacío
    if (!uniqueCode || uniqueCode.trim() === '') {
      return { 
        success: false, 
        error: 'El código de evaluación no puede estar vacío' 
      };
    }

    // Validar el formato del código (debe tener al menos 6 caracteres)
    if (uniqueCode.trim().length < 6) {
      return { 
        success: false, 
        error: 'El código de evaluación debe tener al menos 6 caracteres' 
      };
    }

    // Buscar el intento por su código único
    const attempt = await prisma.attempt.findUnique({
      where: { uniqueCode: uniqueCode.trim() },
      include: {
        evaluation: true
      }
    });

    if (!attempt) {
      return { 
        success: false, 
        error: 'Código de evaluación no válido o no encontrado' 
      };
    }

    // Verificar si el intento está dentro del tiempo permitido
    const now = nowUTC();
    
    if (isBeforeUTC(now, attempt.startTime)) {
      return { 
        success: false, 
        error: 'La evaluación aún no ha comenzado' 
      };
    }

    if (isAfterUTC(now, attempt.endTime)) {
      return { 
        success: false, 
        error: 'La evaluación ya ha finalizado' 
      };
    }

    // Si llegamos aquí, el código es válido y la evaluación está activa
    return { 
      success: true, 
      attempt: {
        id: attempt.id,
        uniqueCode: attempt.uniqueCode,
        startTime: attempt.startTime,
        endTime: attempt.endTime
      },
      evaluation: attempt.evaluation
    };

  } catch (error) {
    console.error('Error al validar el código de evaluación:', error);
    return { 
      success: false, 
      error: 'Error al validar el código de evaluación. Por favor, intenta nuevamente.' 
    };
  }
}