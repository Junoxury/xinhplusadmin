"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateRangePickerProps {
  date?: DateRange
  onDateChange?: (date: DateRange | undefined) => void
  className?: string
  selected?: boolean
}

export function DateRangePicker({ 
  date, 
  onDateChange, 
  className,
  selected = false 
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [internalDate, setInternalDate] = React.useState<DateRange | undefined>(date)
  const [tempDate, setTempDate] = React.useState<DateRange | undefined>(undefined)
  const [selectionStep, setSelectionStep] = React.useState<'start' | 'end'>('start')

  React.useEffect(() => {
    setInternalDate(date)
  }, [date])

  const handleSelect = (newDate: DateRange | undefined) => {
    if (!newDate?.from) return;

    if (selectionStep === 'start') {
      // 시작일 선택시 이전 선택을 모두 초기화
      setTempDate({
        from: newDate.from,
        to: undefined
      })
      setSelectionStep('end')
    } else {
      // 종료일 선택
      if (tempDate?.from && newDate.to) {
        // 종료일이 시작일보다 이전인 경우 시작일을 새로 선택하도록
        if (newDate.to < tempDate.from) {
          setTempDate({
            from: newDate.to,
            to: undefined
          })
          setSelectionStep('end')
          return
        }
        
        setTempDate({
          from: tempDate.from,
          to: newDate.to
        })
      }
    }
  }

  const handlePopoverOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open) {
      // 달력이 열릴 때마다 모든 선택을 초기화
      setSelectionStep('start')
      setTempDate(undefined)
    }
  }

  const handleApply = () => {
    if (tempDate?.from && tempDate?.to) {
      setInternalDate(tempDate)
      if (onDateChange) {
        onDateChange(tempDate)
      }
      setIsOpen(false)
      setSelectionStep('start')
      setTempDate(undefined)
    }
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={handlePopoverOpenChange}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={selected ? "default" : "outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !internalDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {internalDate?.from ? (
              internalDate.to ? (
                <>
                  {format(internalDate.from, "PPP", { locale: ko })} -{" "}
                  {format(internalDate.to, "PPP", { locale: ko })}
                </>
              ) : (
                format(internalDate.from, "PPP", { locale: ko })
              )
            ) : (
              <span>날짜를 선택하세요</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4" align="start">
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground mb-2">
              {selectionStep === 'start' ? (
                '시작일을 선택하세요'
              ) : (
                <>
                  시작일: {format(tempDate?.from!, "PPP", { locale: ko })}
                  <br />
                  종료일을 선택하세요
                </>
              )}
            </div>
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={new Date()}
              selected={tempDate}
              onSelect={handleSelect}
              numberOfMonths={2}
              locale={ko}
              disabled={{ before: selectionStep === 'end' ? tempDate?.from : undefined }}
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsOpen(false)
                  setTempDate(undefined)
                  setSelectionStep('start')
                }}
                className="text-white hover:text-white border-white hover:border-white"
              >
                취소
              </Button>
              <Button
                size="sm"
                onClick={handleApply}
                disabled={!tempDate?.from || !tempDate?.to}
              >
                적용
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
} 