import { useLocation } from "wouter";
import { ArrowLeft, Target, Globe, Link2, User, Phone, Linkedin, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetLead, getGetLeadQueryKey, useUpdateLeadStatus, useUpdateLeadNotes } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";

const STATUS_STYLES: Record<string, string> = {
  new: "bg-muted text-muted-foreground",
  contacted: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  closed: "bg-green-500/15 text-green-400 border-green-500/20",
};

interface Props { leadId: string }

export default function LeadDetailPage({ leadId }: Props) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const qc = useQueryClient();
  const id = parseInt(leadId, 10);

  const { data: lead, isLoading } = useGetLead(id, { query: { enabled: !!id, queryKey: getGetLeadQueryKey(id) } });
  const updateStatus = useUpdateLeadStatus();
  const updateNotes = useUpdateLeadNotes();

  const [notes, setNotes] = useState("");
  const [notesDirty, setNotesDirty] = useState(false);

  useEffect(() => {
    if (lead?.userNotes !== undefined) {
      setNotes(lead.userNotes || "");
    }
  }, [lead?.userNotes]);

  const handleStatusChange = (status: string) => {
    updateStatus.mutate(
      { leadId: id, data: { status: status as any } },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: getGetLeadQueryKey(id) });
          toast({ title: "Status updated" });
        },
      }
    );
  };

  const handleSaveNotes = () => {
    updateNotes.mutate(
      { leadId: id, data: { notes } },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: getGetLeadQueryKey(id) });
          setNotesDirty(false);
          toast({ title: "Notes saved" });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      </DashboardLayout>
    );
  }

  if (!lead) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <p className="text-muted-foreground">Lead not found</p>
          <Button variant="outline" className="mt-4" onClick={() => setLocation("/dashboard/leads")}>Back to Leads</Button>
        </div>
      </DashboardLayout>
    );
  }

  const details = [
    { icon: User, label: "Person", value: lead.personName },
    { icon: Link2, label: "URL", value: lead.url },
    { icon: Globe, label: "Website", value: lead.website },
    { icon: Phone, label: "Phone", value: lead.phoneNumber },
    { icon: Linkedin, label: "LinkedIn", value: lead.linkedinUrl },
  ].filter((d) => d.value);

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setLocation("/dashboard/leads")} data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-1" /> Leads
          </Button>
        </div>

        <div className="p-6 rounded-xl border border-border/50 bg-card space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center flex-shrink-0">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl font-black" data-testid="lead-title">{lead.companyName}</h1>
              </div>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed" data-testid="lead-description">{lead.leadDescription}</p>
            </div>
          </div>

          {details.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
              {details.map((d) => {
                const Icon = d.icon;
                const isLink = d.label === "URL" || d.label === "Website" || d.label === "LinkedIn";
                return (
                  <div key={d.label} className="flex flex-col gap-1 p-3 rounded-lg bg-secondary/30 border border-border/30">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Icon className="w-3 h-3" /> {d.label}
                    </div>
                    {isLink ? (
                      <a
                        href={d.value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-primary hover:underline truncate"
                        data-testid={`lead-${d.label.toLowerCase()}`}
                      >
                        {d.value}
                      </a>
                    ) : (
                      <div className="text-sm font-semibold" data-testid={`lead-${d.label.toLowerCase()}`}>{d.value}</div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex items-center gap-3 pt-2 border-t border-border/30">
            <span className="text-sm font-medium text-muted-foreground">Status:</span>
            <Select value={lead.userStatus || "new"} onValueChange={handleStatusChange}>
              <SelectTrigger className={`h-8 text-sm w-36 border ${STATUS_STYLES[lead.userStatus || "new"]}`} data-testid="select-lead-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Notes */}
        <div className="p-5 rounded-xl border border-border/50 bg-card">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold">Notes</h3>
          </div>
          <Textarea
            value={notes}
            onChange={(e) => { setNotes(e.target.value); setNotesDirty(true); }}
            placeholder="Add your notes about this lead..."
            rows={5}
            className="resize-none mb-3"
            data-testid="textarea-notes"
          />
          <Button
            size="sm"
            className="gradient-primary text-white border-0"
            onClick={handleSaveNotes}
            disabled={!notesDirty || updateNotes.isPending}
            data-testid="button-save-notes"
          >
            {updateNotes.isPending ? "Saving..." : "Save Notes"}
          </Button>
        </div>

        <div className="text-xs text-muted-foreground space-x-4">
          <span>Added {new Date(lead.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
          {lead.updatedAt && (
            <span>Updated {new Date(lead.updatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
