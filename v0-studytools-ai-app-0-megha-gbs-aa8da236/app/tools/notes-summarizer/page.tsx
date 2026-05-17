'use client'

import { useState } from 'react'
import { Loader2, FileText, Sparkles, BookOpen, ListChecks, Brain } from 'lucide-react'
import { ToolLayout } from '@/components/tool-layout'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { summarizeNotes, type NotesSummary } from '@/app/actions/ai-actions'

export default function NotesSummarizerPage() {
  const [notes, setNotes] = useState('')
  const [focusArea, setFocusArea] = useState('')
  const [generateFlashcards, setGenerateFlashcards] = useState(true)
  const [generateQuestions, setGenerateQuestions] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState<NotesSummary | null>(null)
  const [revealedCards, setRevealedCards] = useState<Set<number>>(new Set())

  const handleSummarize = async () => {
    if (!notes.trim()) {
      toast.error('Please enter your notes first')
      return
    }

    if (notes.trim().length < 100) {
      toast.error('Please enter more content for better results')
      return
    }

    setProcessing(true)
    setResult(null)
    setRevealedCards(new Set())

    try {
      const summary = await summarizeNotes(notes, {
        generateFlashcards,
        generateQuestions,
        focusArea: focusArea || undefined,
      })
      setResult(summary)
      toast.success('Notes summarized successfully!')
    } catch (error) {
      console.error('Error summarizing notes:', error)
      toast.error('Failed to summarize notes. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  const toggleCard = (index: number) => {
    setRevealedCards((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  return (
    <ToolLayout
      title="AI Notes Summarizer"
      description="Transform your study notes into clear summaries, key points, and flashcards using AI."
      category="ai"
      toolName="Notes Summarizer"
    >
      <div className="space-y-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notes">Your Notes</Label>
            <Textarea
              id="notes"
              placeholder="Paste your study notes, lecture content, or textbook excerpts here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[200px] resize-y"
            />
            <p className="text-xs text-muted-foreground">
              {notes.length} characters
              {notes.length < 100 && notes.length > 0 && ' (minimum 100 recommended)'}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="focus">Focus Area (Optional)</Label>
            <Input
              id="focus"
              placeholder="e.g., key dates, formulas, definitions..."
              value={focusArea}
              onChange={(e) => setFocusArea(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <Switch
                id="flashcards"
                checked={generateFlashcards}
                onCheckedChange={setGenerateFlashcards}
              />
              <Label htmlFor="flashcards" className="cursor-pointer">
                Generate Flashcards
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="questions"
                checked={generateQuestions}
                onCheckedChange={setGenerateQuestions}
              />
              <Label htmlFor="questions" className="cursor-pointer">
                Generate Study Questions
              </Label>
            </div>
          </div>

          <Button
            onClick={handleSummarize}
            disabled={processing || !notes.trim()}
            className="w-full"
            size="lg"
          >
            {processing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Notes...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Summarize Notes
              </>
            )}
          </Button>
        </div>

        {/* Results Section */}
        {result && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {result.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {result.summary}
                </p>
              </CardContent>
            </Card>

            <Tabs defaultValue="keypoints" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="keypoints">Key Points</TabsTrigger>
                <TabsTrigger value="concepts">Concepts</TabsTrigger>
                <TabsTrigger value="questions">Questions</TabsTrigger>
                <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
              </TabsList>

              <TabsContent value="keypoints" className="space-y-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <ListChecks className="h-5 w-5" />
                      Key Points
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.keyPoints.map((point, index) => (
                        <li key={index} className="flex gap-2">
                          <Badge variant="outline" className="mt-0.5 shrink-0">
                            {index + 1}
                          </Badge>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="concepts" className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  {result.concepts.map((concept, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">
                          {concept.term}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {concept.definition}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="questions" className="space-y-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <BookOpen className="h-5 w-5" />
                      Study Questions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="list-inside list-decimal space-y-3">
                      {result.questions.map((question, index) => (
                        <li key={index} className="leading-relaxed">
                          {question}
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="flashcards" className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  {result.flashcards.map((card, index) => (
                    <button
                      key={index}
                      onClick={() => toggleCard(index)}
                      className="text-left"
                    >
                      <Card className="h-full cursor-pointer transition-all hover:shadow-md">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary">Card {index + 1}</Badge>
                            <Brain className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <p className="font-medium">{card.question}</p>
                          {revealedCards.has(index) ? (
                            <p className="rounded-md bg-primary/10 p-2 text-sm text-primary">
                              {card.answer}
                            </p>
                          ) : (
                            <p className="text-sm text-muted-foreground italic">
                              Click to reveal answer
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </button>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Instructions */}
        <div className="rounded-lg border bg-muted/30 p-4">
          <h3 className="font-semibold">How to use:</h3>
          <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-muted-foreground">
            <li>Paste your study notes, lecture content, or textbook excerpts</li>
            <li>Optionally specify a focus area for more targeted summaries</li>
            <li>Choose whether to generate flashcards and questions</li>
            <li>Click summarize to get AI-powered study materials</li>
          </ol>
        </div>
      </div>
    </ToolLayout>
  )
}
