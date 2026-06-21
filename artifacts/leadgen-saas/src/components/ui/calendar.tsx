import * as React from "react"
import { DayPicker } from "react-day-picker"
import { cn } from "@/lib/utils"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("rdp-calendar", className)}
      classNames={{
        ...classNames,
      }}
      {...props}
    />
  )
}

export { Calendar }
