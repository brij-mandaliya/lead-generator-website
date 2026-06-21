import { useState } from "react";
import { Link } from "wouter";
import { Target, Search, ChevronRight, CalendarIcon, X, Globe, Phone, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useListLeads } from "@workspace/api-client-react";
import { format, isSameDay } from "date-fns";
import DashboardLayout from "@/components/layouts/DashboardLayout";

export default function LeadsPage() {
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [page, setPage] = useState(1);
  const LIMIT = 20;

  const params: any = { page, limit: LIMIT };

  const { data, isLoading } = useListLeads({ params });

  const leads = data?.leads || [];
  const total = data?.total || 0;

    const filtered = leads.filter((l: any) => {
    const matchSearch = !search ||
      l.companyName?.toLowerCase().includes(search.toLowerCase()) ||
      l.leadDescription?.toLowerCase().includes(search.toLowerCase()) ||
      l.personName?.toLowerCase().includes(search.toLowerCase());
    const matchDate = !dateFilter || (l.createdAt && isSameDay(new Date(l.createdAt), dateFilter));
    return matchSearch && matchDate;
  });

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black">My Leads</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{total} leads available</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search leads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              data-testid="input-search-leads"
            />
          </div>

          {/* Date filter */}
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-40 justify-start text-left font-normal gap-2 ${!dateFilter ? "text-muted-foreground" : ""}`}
                data-testid="button-date-filter"
              >
                <CalendarIcon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">
                  {dateFilter ? format(dateFilter, "MMM d, yyyy") : "Pick a date"}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateFilter}
                onSelect={(date) => {
                  setDateFilter(date);
                  setPage(1);
                  setCalendarOpen(false);
                }}
                initialFocus
              />
              {dateFilter && (
                <div className="border-t border-border p-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs gap-1.5 text-muted-foreground"
                    onClick={() => { setDateFilter(undefined); setCalendarOpen(false); }}
                  >
                    <X className="w-3 h-3" />
                    Clear date
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/20">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Company</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">Contact</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden lg:table-cell">Website</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden xl:table-cell">Date</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground w-8" />
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i} className="border-b border-border/20">
                        <td className="px-4 py-3"><Skeleton className="h-5 w-40" /></td>
                        <td className="px-4 py-3 hidden md:table-cell"><Skeleton className="h-5 w-32" /></td>
                        <td className="px-4 py-3 hidden lg:table-cell"><Skeleton className="h-5 w-24" /></td>
                        <td className="px-4 py-3 hidden xl:table-cell"><Skeleton className="h-5 w-20" /></td>
                        <td className="px-4 py-3"><Skeleton className="h-5 w-5" /></td>
                      </tr>
                    ))
                  : filtered.map((lead: any) => (
                      <tr key={lead.id} className="border-b border-border/20 hover:bg-secondary/20 transition-colors" data-testid={`lead-row-${lead.id}`}>
                        <td className="px-4 py-3">
                          <Link href={`/dashboard/leads/${lead.id}`}>
                            <div className="cursor-pointer">
                              <div className="font-medium hover:text-primary transition-colors">
                                {lead.companyName}
                              </div>
                              <div className="text-xs text-muted-foreground truncate max-w-xs mt-0.5">{lead.leadDescription?.slice(0, 60)}...</div>
                            </div>
                          </Link>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <div className="text-sm">{lead.personName || "—"}</div>
                          {lead.phoneNumber && (
                            <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              <Phone className="w-3 h-3" /> {lead.phoneNumber}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          {lead.website || lead.url ? (
                            <a
                              href={lead.website || lead.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline flex items-center gap-1"
                              data-testid={`link-lead-site-${lead.id}`}
                            >
                              <Globe className="w-3 h-3" />
                              <span className="truncate max-w-[120px]">{(lead.website || lead.url).replace(/^https?:\/\//, "").replace(/\/.*$/, "")}</span>
                            </a>
                          ) : (
                            <span className="text-muted-foreground text-xs">—</span>
                          )}
                          {lead.linkedinUrl && (
                            <a
                              href={lead.linkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-400 hover:underline flex items-center gap-1 mt-1"
                            >
                              <Linkedin className="w-3 h-3" /> LinkedIn
                            </a>
                          )}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs hidden xl:table-cell">
                          {lead.createdAt ? format(new Date(lead.createdAt), "MMM d, yyyy") : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <Link href={`/dashboard/leads/${lead.id}`}>
                            <ChevronRight className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground" />
                          </Link>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
          {!isLoading && filtered.length === 0 && (
            <div className="py-16 text-center">
              <Target className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">No leads found</p>
              {dateFilter && (
                <Button variant="ghost" size="sm" className="mt-2 text-xs" onClick={() => setDateFilter(undefined)}>
                  Clear date filter
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {total > LIMIT && (
          <div className="flex justify-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} data-testid="button-prev-page">Previous</Button>
            <span className="text-sm text-muted-foreground py-2 px-3">Page {page} of {Math.ceil(total / LIMIT)}</span>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => p + 1)} disabled={page >= Math.ceil(total / LIMIT)} data-testid="button-next-page">Next</Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
