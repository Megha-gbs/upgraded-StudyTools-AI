'use client'

import { useState } from 'react'
import {
  FileText,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Target,
  Award,
  Briefcase,
  GraduationCap,
  FileSearch,
} from 'lucide-react'
import { ToolLayout } from '@/components/tool-layout'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'

interface SectionFeedback {
  score: number
  feedback: string
  missingKeywords?: string[]
}

interface ResumeFeedback {
  overallScore: number
  summary: string
  strengths: string[]
  improvements: string[]
  sections: {
    formatting: SectionFeedback
    content: SectionFeedback
    keywords: SectionFeedback
    experience: SectionFeedback
    education: SectionFeedback
  }
  actionItems: string[]
}

export default function ResumeCheckerPage() {
  const [resumeText, setResumeText] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [feedback, setFeedback] = useState<ResumeFeedback | null>(null)

  const analyzeResume = async () => {
    if (!resumeText.trim()) {
      toast.error('Please enter your resume text')
      return
    }

    if (resumeText.length < 100) {
      toast.error('Resume text seems too short. Please enter more content.')
      return
    }

    setAnalyzing(true)
    setFeedback(null)

    try {
      const response = await fetch('/api/resume-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          jobDescription: jobDescription.trim() || undefined,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to analyze resume')
      }

      // Parse the SSE stream
      const parsed: ResumeFeedback = await response.json()
setFeedback(parsed)
toast.success('Resume analysis complete!')
    } catch (error) {
      console.error('Analysis error:', error)
      toast.error('Failed to analyze resume. Please try again.')
    } finally {
      setAnalyzing(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500'
    if (score >= 60) return 'text-amber-500'
    return 'text-red-500'
  }

  const getSectionScoreColor = (score: number) => {
    if (score >= 8) return 'bg-emerald-500'
    if (score >= 6) return 'bg-amber-500'
    return 'bg-red-500'
  }

  return (
    <ToolLayout
      title="AI Resume Checker"
      description="Get instant AI-powered feedback on your resume. Improve your content, formatting, and keywords."
      category="ai"
      toolName="AI Resume Checker"
    >
      <div className="space-y-6">
        {!feedback ? (
          <>
            {/* Input Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="resume">
                  Paste Your Resume Text <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="resume"
                  placeholder="Paste your resume content here... Include all sections like contact info, summary, experience, education, and skills."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  className="min-h-[250px] font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  {resumeText.length} characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="job">
                  Target Job Description (Optional)
                </Label>
                <Textarea
                  id="job"
                  placeholder="Paste a job description to get tailored feedback and keyword suggestions..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </div>

            <Button
              onClick={analyzeResume}
              disabled={analyzing || resumeText.length < 100}
              className="w-full"
              size="lg"
            >
              {analyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Resume...
                </>
              ) : (
                <>
                  <FileSearch className="mr-2 h-4 w-4" />
                  Analyze Resume
                </>
              )}
            </Button>
          </>
        ) : (
          <>
            {/* Results */}
            <div className="space-y-6">
              {/* Overall Score */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div
                      className={`text-6xl font-bold ${getScoreColor(
                        feedback.overallScore
                      )}`}
                    >
                      {feedback.overallScore}
                    </div>
                    <p className="text-muted-foreground">/100</p>
                    <p className="mt-4 text-lg">{feedback.summary}</p>
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="overview">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="sections">Sections</TabsTrigger>
                  <TabsTrigger value="actions">Action Items</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  {/* Strengths */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-emerald-600">
                        <CheckCircle className="h-5 w-5" />
                        Strengths
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {feedback.strengths.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                            <span className="text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Improvements */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-amber-600">
                        <AlertTriangle className="h-5 w-5" />
                        Areas to Improve
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {feedback.improvements.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                            <span className="text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="sections" className="space-y-4">
                  {[
                    { key: 'formatting', label: 'Formatting', icon: FileText },
                    { key: 'content', label: 'Content Quality', icon: Award },
                    { key: 'keywords', label: 'Keywords & ATS', icon: Target },
                    { key: 'experience', label: 'Experience', icon: Briefcase },
                    { key: 'education', label: 'Education', icon: GraduationCap },
                  ].map(({ key, label, icon: Icon }) => {
                    const section = feedback.sections[key as keyof typeof feedback.sections]
                    return (
                      <Card key={key}>
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center justify-between">
                            <span className="flex items-center gap-2">
                              <Icon className="h-5 w-5" />
                              {label}
                            </span>
                            <Badge
                              className={getSectionScoreColor(section.score)}
                            >
                              {section.score}/10
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Progress
                            value={section.score * 10}
                            className="mb-3"
                          />
                          <p className="text-sm text-muted-foreground">
                            {section.feedback}
                          </p>
                          {key === 'keywords' &&
                            section.missingKeywords &&
                            section.missingKeywords.length > 0 && (
                              <div className="mt-3">
                                <p className="text-sm font-medium">
                                  Suggested keywords:
                                </p>
                                <div className="mt-2 flex flex-wrap gap-1">
                                  {section.missingKeywords.map((kw, i) => (
                                    <Badge key={i} variant="outline">
                                      {kw}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </TabsContent>

                <TabsContent value="actions" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Action Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ol className="space-y-3">
                        {feedback.actionItems.map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                              {i + 1}
                            </span>
                            <span className="text-sm">{item}</span>
                          </li>
                        ))}
                      </ol>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <Button
                variant="outline"
                onClick={() => setFeedback(null)}
                className="w-full"
              >
                Analyze Another Resume
              </Button>
            </div>
          </>
        )}

        {/* Instructions */}
        <div className="rounded-lg border bg-muted/30 p-4">
          <h3 className="font-semibold">How it works:</h3>
          <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-muted-foreground">
            <li>Paste your resume text in the field above</li>
            <li>Optionally add a target job description for tailored feedback</li>
            <li>Click analyze to get AI-powered feedback</li>
            <li>Review scores, strengths, and actionable improvements</li>
          </ol>
        </div>
      </div>
    </ToolLayout>
  )
}
