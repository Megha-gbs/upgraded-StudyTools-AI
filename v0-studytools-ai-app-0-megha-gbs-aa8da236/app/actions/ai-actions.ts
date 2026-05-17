"use server"

import { generateObject } from "ai"
import { google } from "@ai-sdk/google"
import { z } from "zod"

// ─── Schemas ──────────────────────────────────────────────────────────────────

const ResumeAnalysisSchema = z.object({
  overallScore: z.number().min(0).max(100),
  sections: z.array(
    z.object({
      name: z.string(),
      score: z.number().min(0).max(100),
      feedback: z.string(),
      suggestions: z.array(z.string()),
    })
  ),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  keywords: z.object({
    present: z.array(z.string()),
    missing: z.array(z.string()),
  }),
  atsScore: z.number().min(0).max(100),
  summary: z.string(),
})

export type ResumeAnalysis = z.infer<typeof ResumeAnalysisSchema>

const NotesSummarySchema = z.object({
  title: z.string(),
  summary: z.string(),
  keyPoints: z.array(z.string()),
  concepts: z.array(
    z.object({
      term: z.string(),
      definition: z.string(),
    })
  ),
  questions: z.array(z.string()),
  flashcards: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
    })
  ),
})

export type NotesSummary = z.infer<typeof NotesSummarySchema>

// ─── Resume Analyzer ─────────────────────────────────────────────────────────

export async function analyzeResume(
  resumeText: string,
  jobDescription?: string
): Promise<ResumeAnalysis> {
  const jobContext = jobDescription
    ? `\n\nTarget Job Description:\n${jobDescription}`
    : ""

  try {
    const { object } = await generateObject({
      model: google("gemini-2.5-flash"),
      schema: ResumeAnalysisSchema,
      prompt: `You are an expert resume reviewer and career coach. Analyze the following resume and provide detailed, actionable feedback.${jobContext}

Resume Content:
${resumeText}

Analyze the resume for:
1. Overall quality and effectiveness (0-100 score)
2. Individual sections (contact info, summary/objective, experience, education, skills, etc.)
3. ATS (Applicant Tracking System) compatibility
4. Key strengths
5. Areas for improvement
6. Relevant keywords present and missing${
        jobDescription ? " based on the job description" : ""
      }

Be specific and constructive in your feedback. Focus on actionable improvements.`,
    })

    return object
  } catch (error: any) {
    console.error("Resume analysis failed:", error?.message ?? error)
    throw new Error("Failed to analyze resume. Please try again.")
  }
}

// ─── Notes Summarizer ────────────────────────────────────────────────────────

export async function summarizeNotes(
  notesText: string,
  options?: {
    generateFlashcards?: boolean
    generateQuestions?: boolean
    focusArea?: string
  }
): Promise<NotesSummary> {
  const focusContext = options?.focusArea
    ? `\n\nFocus particularly on: ${options.focusArea}`
    : ""

  try {
    const { object } = await generateObject({
      model: google("gemini-2.5-flash"),
      schema: NotesSummarySchema,
      prompt: `You are an expert study assistant and educator. Analyze and summarize the following study notes to help a student learn effectively.${focusContext}

Notes Content:
${notesText}

Please provide:
1. A clear, descriptive title for these notes
2. A comprehensive summary (2-3 paragraphs)
3. 5-10 key points that capture the most important information
4. Important concepts with clear definitions
5. ${
        options?.generateQuestions !== false
          ? "5-8 study questions to test understanding"
          : "A few basic review questions"
      }
6. ${
        options?.generateFlashcards !== false
          ? "8-12 flashcards for memorization"
          : "3-5 basic flashcards"
      }

Make the content clear, accurate, and optimized for learning and retention.`,
    })

    return object
  } catch (error: any) {
    console.error("Notes summarization failed:", error?.message ?? error)
    throw new Error("Failed to summarize notes. Please try again.")
  }
}