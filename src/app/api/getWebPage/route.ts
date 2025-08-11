import { NextResponse } from 'next/server';
import { validateEvaluationCode } from './actions';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    // Validar que se proporcione un código
    if (!code) {
      return NextResponse.json({ 
        error: 'Código de evaluación requerido',
        valid: false 
      }, { status: 400 });
    }

    // Validar el código usando la server action
    const validationResult = await validateEvaluationCode(code);

    if (!validationResult.success) {
      return NextResponse.json({ 
        error: validationResult.error,
        valid: false 
      }, { status: 400 });
    }

    // Si el código es válido, devolver la URL de la evaluación
    const WEB_PAGE_URL = `${process.env.NEXTAUTH_URL || process.env.AUTH_URL || 'http://localhost:3000'}/a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0`;
    
    // Calcular la duración en minutos a partir de startTime y endTime
    const durationMinutes = validationResult.attempt?.startTime && validationResult.attempt?.endTime
      ? Math.round((new Date(validationResult.attempt.endTime).getTime() - new Date(validationResult.attempt.startTime).getTime()) / (1000 * 60))
      : null;

    return NextResponse.json({ 
      url: WEB_PAGE_URL,
      valid: true,
      evaluation: {
        title: validationResult.evaluation?.title,
        description: validationResult.evaluation?.description,
        durationMinutes: durationMinutes,
        startTime: validationResult.attempt?.startTime,
        endTime: validationResult.attempt?.endTime
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Error en la API getWebPage:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor',
      valid: false 
    }, { status: 500 });
  }
}