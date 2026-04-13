"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { AdminShell } from "@/components/admin/admin-shell";
import { Calendar, ChevronLeft, ChevronRight, Check } from "lucide-react";
import type { ServiceLog } from "@/lib/admin-helpers";
import { LOG_STATUS_COLORS } from "@/lib/admin-helpers";
import { format, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isToday, isSameDay } from "date-fns";

type View = "day" | "week";

export default function AdminSchedulePage() {
  const [view, setView] = useState<View>("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [logs, setLogs] = useState<ServiceLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const start = view === "day"
        ? format(currentDate, "yyyy-MM-dd")
        : format(startOfWeek(currentDate, { weekStartsOn: 1 }), "yyyy-MM-dd");
      const end = view === "day"
        ? format(currentDate, "yyyy-MM-dd")
        : format(endOfWeek(currentDate, { weekStartsOn: 1 }), "yyyy-MM-dd");

      const { data } = await supabase
        .from("service_logs")
        .select("*")
        .gte("service_date", start)
        .lte("service_date", end)
        .order("service_date")
        .order("start_time");

      if (data) setLogs(data);
      setLoading(false);
    }
    load();
  }, [currentDate, view]);

  async function markCompleted(logId: string) {
    await supabase.from("service_logs").update({ status: "completed" as const }).eq("id", logId);
    setLogs((prev) => prev.map((l) => (l.id === logId ? { ...l, status: "completed" as const } : l)));
  }

  function navigate(direction: "prev" | "next") {
    const days = view === "day" ? 1 : 7;
    setCurrentDate((d) => (direction === "next" ? addDays(d, days) : subDays(d, days)));
  }

  const weekDays = view === "week"
    ? eachDayOfInterval({ start: startOfWeek(currentDate, { weekStartsOn: 1 }), end: endOfWeek(currentDate, { weekStartsOn: 1 }) })
    : [currentDate];

  function getLogsForDay(day: Date) {
    const dateStr = format(day, "yyyy-MM-dd");
    return logs.filter((l) => l.service_date === dateStr);
  }

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-dark-olive">Schedule</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setView("day")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${view === "day" ? "bg-forest-green text-white" : "bg-off-white text-muted-olive"}`}
          >
            Day
          </button>
          <button
            onClick={() => setView("week")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${view === "week" ? "bg-forest-green text-white" : "bg-off-white text-muted-olive"}`}
          >
            Week
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate("prev")} className="p-2 text-muted-olive hover:text-dark-olive rounded-lg hover:bg-off-white">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="text-center">
          <p className="font-heading text-lg font-bold text-dark-olive">
            {view === "day" ? format(currentDate, "EEEE, MMMM d, yyyy") : `${format(weekDays[0], "MMM d")} — ${format(weekDays[6], "MMM d, yyyy")}`}
          </p>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="text-xs text-forest-green hover:underline"
          >
            Today
          </button>
        </div>
        <button onClick={() => navigate("next")} className="p-2 text-muted-olive hover:text-dark-olive rounded-lg hover:bg-off-white">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-6 w-6 border-2 border-sage-green border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className={view === "week" ? "grid grid-cols-1 md:grid-cols-7 gap-3" : ""}>
          {weekDays.map((day) => {
            const dayLogs = getLogsForDay(day);
            return (
              <div key={format(day, "yyyy-MM-dd")} className={`${view === "week" ? "" : ""}`}>
                <div className={`text-center mb-2 ${isToday(day) ? "text-forest-green" : "text-dark-olive"}`}>
                  <p className="text-xs font-medium uppercase">{format(day, "EEE")}</p>
                  <p className={`text-lg font-heading font-bold ${isToday(day) ? "bg-forest-green text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto" : ""}`}>
                    {format(day, "d")}
                  </p>
                </div>
                <div className="space-y-1.5 min-h-[60px]">
                  {dayLogs.length === 0 ? (
                    <p className="text-xs text-muted-olive text-center py-2">—</p>
                  ) : (
                    dayLogs.map((log) => (
                      <div key={log.id} className={`card bg-off-white p-2 text-xs ${log.status === "completed" ? "opacity-60" : ""}`}>
                        <div className="flex items-center justify-between gap-1">
                          <div className="min-w-0">
                            <p className="font-medium text-dark-olive truncate">{log.pet_name}</p>
                            <p className="text-muted-olive truncate">
                              {log.service_type.replace("_", " ")}
                              {log.start_time ? ` ${log.start_time.slice(0, 5)}` : ""}
                            </p>
                          </div>
                          {log.status === "scheduled" ? (
                            <button
                              onClick={() => markCompleted(log.id)}
                              className="p-1 text-green-600 hover:bg-green-50 rounded shrink-0"
                              title="Mark completed"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                          ) : (
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium shrink-0 ${LOG_STATUS_COLORS[log.status]}`}>
                              {log.status === "completed" ? "\u2713" : log.status}
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {logs.length === 0 && !loading && (
        <div className="card bg-off-white p-8 text-center mt-4">
          <Calendar className="h-10 w-10 text-border-gray mx-auto mb-3" />
          <p className="text-sm text-muted-olive">No services scheduled for this {view}</p>
          <p className="text-xs text-muted-olive mt-1">
            Services appear here when logged with &quot;scheduled&quot; status
          </p>
        </div>
      )}
    </AdminShell>
  );
}
