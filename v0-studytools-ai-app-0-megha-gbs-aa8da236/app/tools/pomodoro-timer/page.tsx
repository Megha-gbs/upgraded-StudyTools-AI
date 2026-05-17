'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Settings,
  Coffee,
  Brain,
  Target,
} from 'lucide-react'
import { ToolLayout } from '@/components/tool-layout'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

type TimerMode = 'work' | 'shortBreak' | 'longBreak'

interface TimerSettings {
  workDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  sessionsBeforeLongBreak: number
}

const defaultSettings: TimerSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsBeforeLongBreak: 4,
}

const modeConfig: Record<
  TimerMode,
  { label: string; color: string; icon: React.ElementType; bgColor: string }
> = {
  work: {
    label: 'Focus Time',
    color: 'text-primary',
    icon: Brain,
    bgColor: 'bg-primary/10',
  },
  shortBreak: {
    label: 'Short Break',
    color: 'text-emerald-500',
    icon: Coffee,
    bgColor: 'bg-emerald-500/10',
  },
  longBreak: {
    label: 'Long Break',
    color: 'text-blue-500',
    icon: Target,
    bgColor: 'bg-blue-500/10',
  },
}

export default function PomodoroTimerPage() {
  const [settings, setSettings] = useState<TimerSettings>(defaultSettings)
  const [mode, setMode] = useState<TimerMode>('work')
  const [timeLeft, setTimeLeft] = useState(defaultSettings.workDuration * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [completedSessions, setCompletedSessions] = useState(0)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const getDurationForMode = useCallback(
    (m: TimerMode) => {
      switch (m) {
        case 'work':
          return settings.workDuration * 60
        case 'shortBreak':
          return settings.shortBreakDuration * 60
        case 'longBreak':
          return settings.longBreakDuration * 60
      }
    },
    [settings]
  )

  const playNotification = useCallback(() => {
    try {
      // Create a simple beep sound
      const audioContext = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      oscillator.frequency.value = 600
      // oscillator.frequency.value = 800
      oscillator.type = 'sine'
      gainNode.gain.value = 0.8

      oscillator.start()
      setTimeout(() => {
        oscillator.stop()
        audioContext.close()
      }, 1000)
    } catch (error) {
      console.error('Audio not supported:', error)
    }
  }, [])

  const switchMode = useCallback(
    (newMode: TimerMode) => {
      setMode(newMode)
      setTimeLeft(getDurationForMode(newMode))
      setIsRunning(false)
    },
    [getDurationForMode]
  )

  const handleTimerComplete = useCallback(() => {
    playNotification()
    setIsRunning(false)

    if (mode === 'work') {
      const newCompletedSessions = completedSessions + 1
      setCompletedSessions(newCompletedSessions)

      if (newCompletedSessions % settings.sessionsBeforeLongBreak === 0) {
        switchMode('longBreak')
      } else {
        switchMode('shortBreak')
      }
    } else {
      switchMode('work')
    }
  }, [mode, completedSessions, settings.sessionsBeforeLongBreak, playNotification, switchMode])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      handleTimerComplete()
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, timeLeft, handleTimerComplete])

  // Update document title with timer
  useEffect(() => {
    const minutes = Math.floor(timeLeft / 60)
    const seconds = timeLeft % 60
    const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`
    document.title = `${timeStr} - ${modeConfig[mode].label} | Pomodoro Timer`

    return () => {
      document.title = 'Pomodoro Timer | StudyTools AI'
    }
  }, [timeLeft, mode])

  const toggleTimer = () => {
    setIsRunning((prev) => !prev)
  }

  const resetTimer = () => {
    setTimeLeft(getDurationForMode(mode))
    setIsRunning(false)
  }

  const skipToNext = () => {
    if (mode === 'work') {
      const newCompletedSessions = completedSessions + 1
      setCompletedSessions(newCompletedSessions)

      if (newCompletedSessions % settings.sessionsBeforeLongBreak === 0) {
        switchMode('longBreak')
      } else {
        switchMode('shortBreak')
      }
    } else {
      switchMode('work')
    }
  }

  const updateSettings = (newSettings: Partial<TimerSettings>) => {
    const updated = { ...settings, ...newSettings }
    setSettings(updated)

    // Reset timer if not running
    if (!isRunning) {
      setTimeLeft(
        mode === 'work'
          ? updated.workDuration * 60
          : mode === 'shortBreak'
          ? updated.shortBreakDuration * 60
          : updated.longBreakDuration * 60
      )
    }
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const progress =
    ((getDurationForMode(mode) - timeLeft) / getDurationForMode(mode)) * 100

  const config = modeConfig[mode]
  const Icon = config.icon

  return (
    <ToolLayout
      title="Pomodoro Timer"
      description="Boost your productivity with the Pomodoro technique. Stay focused and take regular breaks."
      category="student"
      toolName="Pomodoro Timer"
    >
      <div className="space-y-6">
        {/* Mode Selector */}
        <div className="flex justify-center gap-2">
          {(Object.keys(modeConfig) as TimerMode[]).map((m) => {
            const cfg = modeConfig[m]
            return (
              <Button
                key={m}
                variant={mode === m ? 'default' : 'outline'}
                size="sm"
                onClick={() => switchMode(m)}
                className={cn(mode === m && cfg.bgColor, mode === m && cfg.color)}
              >
                <cfg.icon className="mr-1.5 h-4 w-4" />
                {m === 'work'
                  ? 'Focus'
                  : m === 'shortBreak'
                  ? 'Short Break'
                  : 'Long Break'}
              </Button>
            )
          })}
        </div>

        {/* Timer Display */}
        <div className="flex flex-col items-center">
          <div
            className={cn(
              'relative flex h-64 w-64 flex-col items-center justify-center rounded-full border-8',
              config.bgColor
            )}
          >
            {/* Progress Ring */}
            <svg
              className="absolute inset-0 -rotate-90"
              viewBox="0 0 256 256"
            >
              <circle
                cx="128"
                cy="128"
                r="120"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-muted"
              />
              <circle
                cx="128"
                cy="128"
                r="120"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 120}
                strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
                className={config.color}
              />
            </svg>

            <Icon className={cn('h-8 w-8', config.color)} />
            <div className={cn('mt-2 text-6xl font-bold tabular-nums', config.color)}>
              {minutes.toString().padStart(2, '0')}:
              {seconds.toString().padStart(2, '0')}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{config.label}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-3">
          <Button variant="outline" size="icon" onClick={resetTimer}>
            <RotateCcw className="h-5 w-5" />
          </Button>
          <Button
            size="lg"
            onClick={toggleTimer}
            className={cn('px-8', isRunning && 'bg-amber-500 hover:bg-amber-600')}
          >
            {isRunning ? (
              <>
                <Pause className="mr-2 h-5 w-5" />
                Pause
              </>
            ) : (
              <>
                <Play className="mr-2 h-5 w-5" />
                Start
              </>
            )}
          </Button>
          <Button variant="outline" size="icon" onClick={skipToNext}>
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-8 text-center">
          <div>
            <p className="text-3xl font-bold text-primary">{completedSessions}</p>
            <p className="text-sm text-muted-foreground">Sessions Done</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-emerald-500">
              {Math.floor((completedSessions * settings.workDuration) / 60)}h{' '}
              {(completedSessions * settings.workDuration) % 60}m
            </p>
            <p className="text-sm text-muted-foreground">Focus Time</p>
          </div>
        </div>

        {/* Settings Dialog */}
        <div className="flex justify-center">
          <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Timer Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="space-y-3">
                  <Label>Focus Duration: {settings.workDuration} min</Label>
                  <Slider
                    value={[settings.workDuration]}
                    onValueChange={([v]) =>
                      updateSettings({ workDuration: v })
                    }
                    min={5}
                    max={60}
                    step={5}
                  />
                </div>
                <div className="space-y-3">
                  <Label>
                    Short Break Duration: {settings.shortBreakDuration} min
                  </Label>
                  <Slider
                    value={[settings.shortBreakDuration]}
                    onValueChange={([v]) =>
                      updateSettings({ shortBreakDuration: v })
                    }
                    min={1}
                    max={15}
                    step={1}
                  />
                </div>
                <div className="space-y-3">
                  <Label>
                    Long Break Duration: {settings.longBreakDuration} min
                  </Label>
                  <Slider
                    value={[settings.longBreakDuration]}
                    onValueChange={([v]) =>
                      updateSettings({ longBreakDuration: v })
                    }
                    min={10}
                    max={30}
                    step={5}
                  />
                </div>
                <div className="space-y-3">
                  <Label>
                    Sessions Before Long Break:{' '}
                    {settings.sessionsBeforeLongBreak}
                  </Label>
                  <Slider
                    value={[settings.sessionsBeforeLongBreak]}
                    onValueChange={([v]) =>
                      updateSettings({ sessionsBeforeLongBreak: v })
                    }
                    min={2}
                    max={8}
                    step={1}
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Instructions */}
        <div className="rounded-lg border bg-muted/30 p-4">
          <h3 className="font-semibold">How the Pomodoro Technique works:</h3>
          <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-muted-foreground">
            <li>Work for 25 minutes (one &quot;pomodoro&quot;)</li>
            <li>Take a short 5-minute break</li>
            <li>After 4 pomodoros, take a longer 15-minute break</li>
            <li>Repeat to maintain focus and avoid burnout</li>
          </ol>
        </div>
      </div>
    </ToolLayout>
  )
}
