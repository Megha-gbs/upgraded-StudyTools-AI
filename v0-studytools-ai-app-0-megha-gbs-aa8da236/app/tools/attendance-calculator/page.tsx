'use client'

import { useState, useMemo } from 'react'
import { Calculator, AlertCircle, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react'
import { ToolLayout } from '@/components/tool-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function AttendanceCalculatorPage() {
  const [attended, setAttended] = useState('')
  const [total, setTotal] = useState('')
  const [requiredPercentage, setRequiredPercentage] = useState([75])
  const [futureClasses, setFutureClasses] = useState('')

  const result = useMemo(() => {
    const attendedNum = parseInt(attended, 10)
    const totalNum = parseInt(total, 10)
    const futureNum = parseInt(futureClasses, 10) || 0
    const required = requiredPercentage[0]

    if (isNaN(attendedNum) || isNaN(totalNum) || totalNum === 0) {
      return null
    }

    const currentPercentage = (attendedNum / totalNum) * 100
    const isAboveRequired = currentPercentage >= required

    // Calculate how many classes can be missed/need to attend
    let canMiss = 0
    let needToAttend = 0

    if (isAboveRequired) {
      // Calculate how many more classes can be missed
      // (attended) / (total + x) >= required/100
      // attended * 100 >= required * (total + x)
      // x <= (attended * 100 - required * total) / required
      canMiss = Math.floor(
        (attendedNum * 100 - required * totalNum) / required
      )
    } else {
      // Calculate how many consecutive classes need to attend
      // (attended + x) / (total + x) >= required/100
      // (attended + x) * 100 >= required * (total + x)
      // 100x - required*x >= required*total - 100*attended
      // x * (100 - required) >= required*total - 100*attended
      // x >= (required*total - 100*attended) / (100 - required)
      needToAttend = Math.ceil(
        (required * totalNum - 100 * attendedNum) / (100 - required)
      )
    }

    // Future projection
    let futurePercentage = currentPercentage
    if (futureNum > 0) {
      futurePercentage =
        ((attendedNum + futureNum) / (totalNum + futureNum)) * 100
    }

    return {
      currentPercentage: currentPercentage.toFixed(2),
      isAboveRequired,
      canMiss: Math.max(0, canMiss),
      needToAttend: Math.max(0, needToAttend),
      attended: attendedNum,
      total: totalNum,
      futurePercentage: futurePercentage.toFixed(2),
      required,
    }
  }, [attended, total, requiredPercentage, futureClasses])

  const getStatusColor = (percentage: number, required: number) => {
    if (percentage >= required + 10) return 'text-emerald-500'
    if (percentage >= required) return 'text-green-500'
    if (percentage >= required - 10) return 'text-amber-500'
    return 'text-red-500'
  }

  const reset = () => {
    setAttended('')
    setTotal('')
    setFutureClasses('')
  }

  return (
    <ToolLayout
      title="Attendance Calculator"
      description="Calculate your attendance percentage and plan your classes strategically."
      category="student"
      toolName="Attendance Calculator"
    >
      <div className="space-y-6">
        <Tabs defaultValue="calculate">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calculate">Calculate</TabsTrigger>
            <TabsTrigger value="plan">Plan Ahead</TabsTrigger>
          </TabsList>

          <TabsContent value="calculate" className="space-y-6">
            {/* Input Form */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="attended">Classes Attended</Label>
                <Input
                  id="attended"
                  type="number"
                  placeholder="e.g., 45"
                  value={attended}
                  onChange={(e) => setAttended(e.target.value)}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="total">Total Classes Held</Label>
                <Input
                  id="total"
                  type="number"
                  placeholder="e.g., 60"
                  value={total}
                  onChange={(e) => setTotal(e.target.value)}
                  min="0"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Required Attendance: {requiredPercentage[0]}%</Label>
              <Slider
                value={requiredPercentage}
                onValueChange={setRequiredPercentage}
                min={50}
                max={100}
                step={5}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>50%</span>
                <span>75% (Most common)</span>
                <span>100%</span>
              </div>
            </div>

            {/* Results */}
            {result && (
              <div className="space-y-4">
                {/* Current Percentage Card */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Your Attendance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline gap-2">
                      <span
                        className={`text-4xl font-bold ${getStatusColor(
                          parseFloat(result.currentPercentage),
                          result.required
                        )}`}
                      >
                        {result.currentPercentage}%
                      </span>
                      <span className="text-muted-foreground">
                        ({result.attended} / {result.total} classes)
                      </span>
                    </div>
                    <Progress
                      value={Math.min(parseFloat(result.currentPercentage), 100)}
                      className="mt-3"
                    />
                    <div className="mt-2 flex items-center gap-2 text-sm">
                      {result.isAboveRequired ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-green-600">
                            Above required ({result.required}%)
                          </span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-4 w-4 text-amber-500" />
                          <span className="text-amber-600">
                            Below required ({result.required}%)
                          </span>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Action Cards */}
                <div className="grid gap-4 sm:grid-cols-2">
                  {result.isAboveRequired ? (
                    <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                            <TrendingDown className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              You can miss up to
                            </p>
                            <p className="text-2xl font-bold text-green-600">
                              {result.canMiss} more classes
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900">
                            <TrendingUp className="h-5 w-5 text-amber-600" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              You need to attend
                            </p>
                            <p className="text-2xl font-bold text-amber-600">
                              {result.needToAttend} classes consecutively
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}

            <Button variant="outline" onClick={reset} className="w-full">
              Reset
            </Button>
          </TabsContent>

          <TabsContent value="plan" className="space-y-6">
            {result ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="future">
                    How many upcoming classes will you attend?
                  </Label>
                  <Input
                    id="future"
                    type="number"
                    placeholder="e.g., 10"
                    value={futureClasses}
                    onChange={(e) => setFutureClasses(e.target.value)}
                    min="0"
                  />
                </div>

                {futureClasses && parseInt(futureClasses, 10) > 0 && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Projected Attendance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-baseline gap-2">
                        <span
                          className={`text-4xl font-bold ${getStatusColor(
                            parseFloat(result.futurePercentage),
                            result.required
                          )}`}
                        >
                          {result.futurePercentage}%
                        </span>
                        <span className="text-muted-foreground">
                          (after attending {futureClasses} more)
                        </span>
                      </div>
                      <Progress
                        value={Math.min(
                          parseFloat(result.futurePercentage),
                          100
                        )}
                        className="mt-3"
                      />
                      <p className="mt-2 text-sm text-muted-foreground">
                        From {result.currentPercentage}% to{' '}
                        {result.futurePercentage}%
                        {parseFloat(result.futurePercentage) >
                        parseFloat(result.currentPercentage) ? (
                          <span className="text-green-600">
                            {' '}
                            (+
                            {(
                              parseFloat(result.futurePercentage) -
                              parseFloat(result.currentPercentage)
                            ).toFixed(2)}
                            %)
                          </span>
                        ) : null}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <Calculator className="mx-auto h-12 w-12 opacity-50" />
                <p className="mt-4">
                  Enter your attendance in the Calculate tab first
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Instructions */}
        <div className="rounded-lg border bg-muted/30 p-4">
          <h3 className="font-semibold">How it works:</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
            <li>Enter the number of classes you&apos;ve attended</li>
            <li>Enter the total number of classes held so far</li>
            <li>Adjust the required attendance percentage for your college</li>
            <li>See how many classes you can miss or need to attend</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  )
}
