import { NextRequest, NextResponse } from 'next/server';
import { askMedLensRAG } from '@/lib/ai/rag';

export async function POST(req: NextRequest) {
  try {
    let patientId = '';
    let question = '';

    try {
      const body = await req.json();
      patientId = body.patientId;
      question = body.question;
    } catch {
      const rawText = await req.text();
      const matchP = rawText.match(/"patientId"\s*:\s*"([^"]+)"/);
      const matchQ = rawText.match(/"question"\s*:\s*"([^"]+)"/);
      patientId = matchP ? matchP[1] : 'pat-101';
      question = matchQ ? matchQ[1] : '';
    }

    if (!patientId || !question) {
      return NextResponse.json({ success: false, error: 'patientId and question are required' }, { status: 400 });
    }

    const ragAnswer = await askMedLensRAG(patientId, question);

    return NextResponse.json({
      success: true,
      data: ragAnswer
    });
  } catch (error) {
    console.error('Ask MedLens API error:', error);
    return NextResponse.json({ success: false, error: 'Failed to answer query' }, { status: 500 });
  }
}
