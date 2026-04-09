// Generation completion webhook handler
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { generationId, status, outputUrl, metadata } = body

    // TODO: Validate webhook signature

    // Handle generation completion
    if (status === 'completed') {
      // Notify frontend via WebSocket or SSE
      // Update project status in database
      // Trigger post-processing if needed
    } else if (status === 'failed') {
      // Handle generation failure
      // Send notification to user
    }

    return NextResponse.json({ processed: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 400 }
    )
  }
}
