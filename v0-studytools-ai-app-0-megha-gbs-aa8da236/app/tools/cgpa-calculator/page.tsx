'use client'

import { useState, useMemo } from 'react'
import { Plus, Trash2, Calculator, RotateCcw } from 'lucide-react'
import { ToolLayout } from '@/components/tool-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Subject {
  id: string
  name: string
  credits: string
  grade: string
}

interface Semester {
  id: string
  name: string
  sgpa: string
  credits: string
}

const gradePoints: Record<string, number> = {
  'O': 10,
  'A+': 10,
  'A': 9,
  'B+': 8,
  'B': 7,
  'C+': 6,
  'C': 5,
  'D': 4,
  'F': 0,
  'P': 0, // Pass - not counted in GPA
}

const grades = Object.keys(gradePoints)

export default function CGPACalculatorPage() {
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: '1', name: '', credits: '', grade: '' },
  ])
  const [semesters, setSemesters] = useState<Semester[]>([
    { id: '1', name: 'Semester 1', sgpa: '', credits: '' },
  ])

  // SGPA Calculation
  const sgpaResult = useMemo(() => {
    const validSubjects = subjects.filter(
      (s) => s.credits && s.grade && s.grade !== 'P'
    )

    if (validSubjects.length === 0) return null

    let totalCredits = 0
    let totalPoints = 0

    validSubjects.forEach((subject) => {
      const credits = parseFloat(subject.credits)
      const points = gradePoints[subject.grade] || 0

      if (!isNaN(credits)) {
        totalCredits += credits
        totalPoints += credits * points
      }
    })

    if (totalCredits === 0) return null

    return {
      sgpa: (totalPoints / totalCredits).toFixed(2),
      totalCredits,
      totalSubjects: validSubjects.length,
    }
  }, [subjects])

  // CGPA Calculation
  const cgpaResult = useMemo(() => {
    const validSemesters = semesters.filter((s) => s.sgpa && s.credits)

    if (validSemesters.length === 0) return null

    let totalCredits = 0
    let totalPoints = 0

    validSemesters.forEach((semester) => {
      const credits = parseFloat(semester.credits)
      const sgpa = parseFloat(semester.sgpa)

      if (!isNaN(credits) && !isNaN(sgpa)) {
        totalCredits += credits
        totalPoints += credits * sgpa
      }
    })

    if (totalCredits === 0) return null

    return {
      cgpa: (totalPoints / totalCredits).toFixed(2),
      totalCredits,
      totalSemesters: validSemesters.length,
    }
  }, [semesters])

  const addSubject = () => {
    setSubjects((prev) => [
      ...prev,
      { id: Date.now().toString(), name: '', credits: '', grade: '' },
    ])
  }

  const removeSubject = (id: string) => {
    if (subjects.length > 1) {
      setSubjects((prev) => prev.filter((s) => s.id !== id))
    }
  }

  const updateSubject = (id: string, field: keyof Subject, value: string) => {
    setSubjects((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    )
  }

  const addSemester = () => {
    const nextNum = semesters.length + 1
    setSemesters((prev) => [
      ...prev,
      { id: Date.now().toString(), name: `Semester ${nextNum}`, sgpa: '', credits: '' },
    ])
  }

  const removeSemester = (id: string) => {
    if (semesters.length > 1) {
      setSemesters((prev) => prev.filter((s) => s.id !== id))
    }
  }

  const updateSemester = (id: string, field: keyof Semester, value: string) => {
    setSemesters((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    )
  }

  const resetSubjects = () => {
    setSubjects([{ id: '1', name: '', credits: '', grade: '' }])
  }

  const resetSemesters = () => {
    setSemesters([{ id: '1', name: 'Semester 1', sgpa: '', credits: '' }])
  }

  const getGradeColor = (gpa: number) => {
    if (gpa >= 9) return 'text-emerald-500'
    if (gpa >= 8) return 'text-green-500'
    if (gpa >= 7) return 'text-blue-500'
    if (gpa >= 6) return 'text-amber-500'
    return 'text-red-500'
  }

  return (
    <ToolLayout
      title="CGPA Calculator"
      description="Calculate your SGPA and CGPA with support for different grading systems."
      category="student"
      toolName="CGPA Calculator"
    >
      <div className="space-y-6">
        <Tabs defaultValue="sgpa">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sgpa">Calculate SGPA</TabsTrigger>
            <TabsTrigger value="cgpa">Calculate CGPA</TabsTrigger>
          </TabsList>

          {/* SGPA Calculator */}
          <TabsContent value="sgpa" className="space-y-6">
            <div className="space-y-4">
              {subjects.map((subject, index) => (
                <div
                  key={subject.id}
                  className="flex items-end gap-2 rounded-lg border bg-muted/30 p-3"
                >
                  <div className="flex-1 space-y-2">
                    <Label className="text-xs">Subject {index + 1}</Label>
                    <Input
                      placeholder="Subject Name"
                      value={subject.name}
                      onChange={(e) =>
                        updateSubject(subject.id, 'name', e.target.value)
                      }
                    />
                  </div>
                  <div className="w-20 space-y-2">
                    <Label className="text-xs">Credits</Label>
                    <Input
                      type="number"
                      placeholder="3"
                      value={subject.credits}
                      onChange={(e) =>
                        updateSubject(subject.id, 'credits', e.target.value)
                      }
                      min="0"
                      max="10"
                    />
                  </div>
                  <div className="w-24 space-y-2">
                    <Label className="text-xs">Grade</Label>
                    <Select
                      value={subject.grade}
                      onValueChange={(value) =>
                        updateSubject(subject.id, 'grade', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {grades.map((grade) => (
                          <SelectItem key={grade} value={grade}>
                            {grade} ({gradePoints[grade]})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSubject(subject.id)}
                    disabled={subjects.length === 1}
                    className="shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={addSubject} className="flex-1">
                <Plus className="mr-2 h-4 w-4" />
                Add Subject
              </Button>
              <Button variant="ghost" onClick={resetSubjects}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>

            {sgpaResult && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Your SGPA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span
                      className={`text-5xl font-bold ${getGradeColor(
                        parseFloat(sgpaResult.sgpa)
                      )}`}
                    >
                      {sgpaResult.sgpa}
                    </span>
                    <span className="text-muted-foreground">/10</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Based on {sgpaResult.totalSubjects} subject(s) with{' '}
                    {sgpaResult.totalCredits} total credits
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* CGPA Calculator */}
          <TabsContent value="cgpa" className="space-y-6">
            <div className="space-y-4">
              {semesters.map((semester, index) => (
                <div
                  key={semester.id}
                  className="flex items-end gap-2 rounded-lg border bg-muted/30 p-3"
                >
                  <div className="flex-1 space-y-2">
                    <Label className="text-xs">Semester {index + 1}</Label>
                    <Input
                      placeholder="Semester Name"
                      value={semester.name}
                      onChange={(e) =>
                        updateSemester(semester.id, 'name', e.target.value)
                      }
                    />
                  </div>
                  <div className="w-24 space-y-2">
                    <Label className="text-xs">SGPA</Label>
                    <Input
                      type="number"
                      placeholder="8.5"
                      value={semester.sgpa}
                      onChange={(e) =>
                        updateSemester(semester.id, 'sgpa', e.target.value)
                      }
                      min="0"
                      max="10"
                      step="0.01"
                    />
                  </div>
                  <div className="w-24 space-y-2">
                    <Label className="text-xs">Credits</Label>
                    <Input
                      type="number"
                      placeholder="24"
                      value={semester.credits}
                      onChange={(e) =>
                        updateSemester(semester.id, 'credits', e.target.value)
                      }
                      min="0"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSemester(semester.id)}
                    disabled={semesters.length === 1}
                    className="shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={addSemester} className="flex-1">
                <Plus className="mr-2 h-4 w-4" />
                Add Semester
              </Button>
              <Button variant="ghost" onClick={resetSemesters}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>

            {cgpaResult && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Your CGPA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span
                      className={`text-5xl font-bold ${getGradeColor(
                        parseFloat(cgpaResult.cgpa)
                      )}`}
                    >
                      {cgpaResult.cgpa}
                    </span>
                    <span className="text-muted-foreground">/10</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Based on {cgpaResult.totalSemesters} semester(s) with{' '}
                    {cgpaResult.totalCredits} total credits
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Grade Reference */}
        <div className="rounded-lg border bg-muted/30 p-4">
          <h3 className="font-semibold">Grade Reference:</h3>
          <div className="mt-3 grid grid-cols-5 gap-2 text-center text-sm sm:grid-cols-10">
            {Object.entries(gradePoints).map(([grade, points]) => (
              <div key={grade} className="rounded-md border bg-background p-2">
                <div className="font-medium">{grade}</div>
                <div className="text-xs text-muted-foreground">{points}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
