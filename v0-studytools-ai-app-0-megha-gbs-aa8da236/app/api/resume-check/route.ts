import { generateObject } from 'ai'
import { google } from '@ai-sdk/google'
import { z } from 'zod'

export const maxDuration = 60

const resumeFeedbackSchema = z.object({
  overallScore: z.number(),
  summary: z.string(),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  sections: z.object({
    formatting: z.object({
      score: z.number(),
      feedback: z.string(),
    }),
    content: z.object({
      score: z.number(),
      feedback: z.string(),
    }),
    keywords: z.object({
      score: z.number(),
      feedback: z.string(),
      missingKeywords: z.array(z.string()),
    }),
    experience: z.object({
      score: z.number(),
      feedback: z.string(),
    }),
    education: z.object({
      score: z.number(),
      feedback: z.string(),
    }),
  }),
  actionItems: z.array(z.string()),
})

export async function POST(request: Request) {
  try {
    const { resumeText, jobDescription } = await request.json()

    if (!resumeText || typeof resumeText !== 'string') {
      return Response.json({ error: 'Resume text is required' }, { status: 400 })
    }

    const systemPrompt = `You are an expert resume reviewer and career coach with years of experience helping candidates land interviews at top companies.

Analyze the provided resume and provide detailed, actionable feedback. Be constructive but honest about areas that need improvement.

Consider:
1. Formatting and visual appeal (even from text, assess structure)
2. Content quality and impact statements
3. Relevant keywords for ATS systems
4. Experience descriptions using STAR method
5. Education and certifications presentation
6. Overall professionalism

${jobDescription ? `The candidate is targeting roles matching this job description:\n${jobDescription}` : 'Provide general feedback suitable for most professional roles.'}`

    const { object } = await generateObject({
     model: google('gemini-2.5-flash'),
      schema: resumeFeedbackSchema,
      system: systemPrompt,
      prompt: `Please analyze this resume and provide detailed feedback. overallScore must be 0-100. Section scores must be 0-10:\n\n${resumeText}`,
    })

    // Normalize overallScore to 0-100 range
    if (object.overallScore <= 10) {
      object.overallScore = Math.round(object.overallScore * 10)
    }

    return Response.json(object)
  }  catch (error: any) {
    console.error('Resume analysis error FULL:', JSON.stringify(error, null, 2))
    console.error('Resume analysis error MESSAGE:', error?.message)
    console.error('Resume analysis error CAUSE:', error?.cause)
    return Response.json({ error: 'Failed to analyze resume. Please try again.' }, { status: 500 })
  }
}