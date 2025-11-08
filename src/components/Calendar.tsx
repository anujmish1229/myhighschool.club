import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from "date-fns";
import { useState } from "react";
import { GlassCard } from "./GlassCard";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { useConfig } from "@/context/ConfigContext";

interface Event {
  title: string;
  date: Date;
  description: string;
}

export const Calendar = () => {
  const { config } = useConfig();
  const [currentDate, setCurrentDate] = useState(new Date());

  // Convert config events (string dates) to Event objects with Date objects
  const events: Event[] = config.events.map(event => ({
    ...event,
    date: new Date(event.date),
  }));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDay = (day: Date) => {
    return events.filter(
      (event) =>
        event.date.getDate() === day.getDate() &&
        event.date.getMonth() === day.getMonth() &&
        event.date.getFullYear() === day.getFullYear()
    );
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Get the day of week the month starts on (0 = Sunday)
  const startDayOfWeek = monthStart.getDay();
  const emptyDays = Array.from({ length: startDayOfWeek });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-light">Upcoming Events</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={goToPreviousMonth}
            className="text-foreground/60 hover:text-primary transition-colors"
            aria-label="Previous month"
          >
            <CaretLeft size={24} weight="light" />
          </button>
          <span className="text-lg font-light min-w-[180px] text-center">
            {format(currentDate, "MMMM yyyy")}
          </span>
          <button
            onClick={goToNextMonth}
            className="text-foreground/60 hover:text-primary transition-colors"
            aria-label="Next month"
          >
            <CaretRight size={24} weight="light" />
          </button>
        </div>
      </div>

      <GlassCard>
        <div className="grid grid-cols-7 gap-2">
          {/* Day headers */}
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-foreground/60 py-2"
            >
              {day}
            </div>
          ))}

          {/* Empty cells for days before month starts */}
          {emptyDays.map((_, index) => (
            <div key={`empty-${index}`} className="aspect-square" />
          ))}

          {/* Calendar days */}
          {daysInMonth.map((day) => {
            const dayEvents = getEventsForDay(day);
            const hasEvents = dayEvents.length > 0;
            const isCurrentDay = isToday(day);

            return (
              <div
                key={day.toISOString()}
                className={`aspect-square p-2 rounded-lg transition-all ${
                  isCurrentDay
                    ? "bg-primary/20 border border-primary"
                    : hasEvents
                    ? "bg-accent/10 border border-accent/30"
                    : "hover:bg-muted/20"
                }`}
              >
                <div className="flex flex-col h-full">
                  <span
                    className={`text-sm ${
                      isCurrentDay
                        ? "text-primary font-medium"
                        : hasEvents
                        ? "text-accent"
                        : "text-foreground/60"
                    }`}
                  >
                    {format(day, "d")}
                  </span>
                  {hasEvents && (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* Event List */}
      <div className="space-y-4">
        <h3 className="text-xl font-light">This Month</h3>
        <div className="grid gap-4">
          {events
            .filter((event) => isSameMonth(event.date, currentDate))
            .map((event, index) => (
              <GlassCard key={index} delay={index * 0.1}>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-lg">{event.title}</h4>
                    <p className="text-sm text-foreground/60 mt-1">
                      {event.description}
                    </p>
                  </div>
                  <div className="text-right text-sm text-foreground/60">
                    <div>{format(event.date, "MMM d")}</div>
                  </div>
                </div>
              </GlassCard>
            ))}
        </div>
      </div>
    </div>
  );
};

