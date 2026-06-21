import { useState } from "react";
import { Plus, Pencil, Trash2, Target, X, ExternalLink, Globe, Phone, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  useListLeads, getListLeadsQueryKey, useCreateLead, useUpdateLead, useDeleteLead,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/layouts/AdminLayout";

interface LeadForm {
  companyName: string;
  url: string;
  leadDescription: string;
  personName: string;
  website: string;
  phoneNumber: string;
  linkedinUrl: string;
}

const emptyForm: LeadForm = { companyName: "", url: "", leadDescription: "", personName: "", website: "", phoneNumber: "", linkedinUrl: "" };

export default function AdminLeadsPage() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const LIMIT = 20;
  const params = { page, limit: LIMIT };

  const { data, isLoading } = useListLeads({ params });
  const createLead = useCreateLead();
  const updateLead = useUpdateLead();
  const deleteLead = useDeleteLead();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<LeadForm>(emptyForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const leads = data?.leads || [];
  const total = data?.total || 0;

  const openCreate = () => { setForm(emptyForm); setEditingId(null); setDialogOpen(true); };
  const openEdit = (lead: any) => {
    setForm({
      companyName: lead.companyName, url: lead.url || "", leadDescription: lead.leadDescription,
      personName: lead.personName || "", website: lead.website || "", phoneNumber: lead.phoneNumber || "",
      linkedinUrl: lead.linkedinUrl || "",
    });
    setEditingId(lead.id);
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    const data = {
      ...form,
      url: form.url || undefined,
      personName: form.personName || undefined,
      website: form.website || undefined,
      phoneNumber: form.phoneNumber || undefined,
      linkedinUrl: form.linkedinUrl || undefined,
    };
    if (editingId) {
      updateLead.mutate({ leadId: editingId, data }, {
        onSuccess: () => { qc.invalidateQueries({ queryKey: getListLeadsQueryKey(params) }); setDialogOpen(false); toast({ title: "Lead updated" }); },
      });
    } else {
      createLead.mutate({ data }, {
        onSuccess: () => { qc.invalidateQueries({ queryKey: getListLeadsQueryKey(params) }); setDialogOpen(false); toast({ title: "Lead created" }); },
      });
    }
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteLead.mutate({ leadId: deleteId }, {
      onSuccess: () => { qc.invalidateQueries({ queryKey: getListLeadsQueryKey(params) }); setDeleteId(null); toast({ title: "Lead deleted" }); },
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black">Lead Management</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{total} leads in system</p>
          </div>
          <Button className="gradient-primary text-white border-0" onClick={openCreate} data-testid="button-create-lead">
            <Plus className="w-4 h-4 mr-2" /> Add Lead
          </Button>
        </div>

        <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/20">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Company</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">Contact</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden lg:table-cell">Links</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border/20">
                    <td className="px-4 py-3"><Skeleton className="h-5 w-48" /></td>
                    <td className="px-4 py-3 hidden md:table-cell"><Skeleton className="h-5 w-32" /></td>
                    <td className="px-4 py-3 hidden lg:table-cell"><Skeleton className="h-7 w-24" /></td>
                    <td className="px-4 py-3 text-right"><Skeleton className="h-7 w-16 ml-auto" /></td>
                  </tr>
                )) : leads.map((lead: any) => (
                  <tr key={lead.id} className="border-b border-border/20 hover:bg-secondary/20 transition-colors" data-testid={`lead-row-${lead.id}`}>
                    <td className="px-4 py-3">
                      <div className="font-medium">{lead.companyName}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-xs">{lead.leadDescription?.slice(0, 60)}...</div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                      <div className="text-sm">{lead.personName || "—"}</div>
                      {lead.phoneNumber && <div className="text-xs">{lead.phoneNumber}</div>}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex flex-col gap-1">
                        {lead.website && (
                          <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                            <Globe className="w-3 h-3" /> Website
                          </a>
                        )}
                        {lead.linkedinUrl && (
                          <a href={lead.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline flex items-center gap-1">
                            <Linkedin className="w-3 h-3" /> LinkedIn
                          </a>
                        )}
                        {!lead.website && !lead.linkedinUrl && <span className="text-muted-foreground text-xs">—</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => openEdit(lead)} data-testid={`button-edit-lead-${lead.id}`}>
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive" onClick={() => setDeleteId(lead.id)} data-testid={`button-delete-lead-${lead.id}`}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!isLoading && leads.length === 0 && (
            <div className="py-12 text-center">
              <Target className="w-8 h-8 mx-auto mb-2 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">No leads yet</p>
            </div>
          )}
        </div>

        {total > LIMIT && (
          <div className="flex justify-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
            <span className="text-sm text-muted-foreground py-2 px-3">Page {page}</span>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => p + 1)} disabled={page >= Math.ceil(total / LIMIT)}>Next</Button>
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg" data-testid="dialog-lead-form">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Lead" : "Add Lead"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Company Name *</Label>
                <Input value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} placeholder="Company name" className="mt-1" data-testid="input-lead-company" />
              </div>
              <div>
                <Label>Person Name</Label>
                <Input value={form.personName} onChange={(e) => setForm({ ...form, personName: e.target.value })} placeholder="Contact person" className="mt-1" data-testid="input-lead-person" />
              </div>
            </div>
            <div>
              <Label>Lead Description *</Label>
              <Textarea value={form.leadDescription} onChange={(e) => setForm({ ...form, leadDescription: e.target.value })} placeholder="Describe the lead..." rows={3} className="mt-1" data-testid="textarea-lead-description" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>URL</Label>
                <Input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." className="mt-1" data-testid="input-lead-url" />
              </div>
              <div>
                <Label>Website</Label>
                <Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://..." className="mt-1" data-testid="input-lead-website" />
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} placeholder="+1 555 0123" className="mt-1" data-testid="input-lead-phone" />
              </div>
              <div>
                <Label>LinkedIn URL</Label>
                <Input value={form.linkedinUrl} onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })} placeholder="https://linkedin.com/in/..." className="mt-1" data-testid="input-lead-linkedin" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button className="gradient-primary text-white border-0" onClick={handleSubmit} disabled={!form.companyName || !form.leadDescription || createLead.isPending || updateLead.isPending} data-testid="button-save-lead">
              {editingId ? "Save Changes" : "Create Lead"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Lead</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. The lead will be permanently deleted.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={handleDelete} data-testid="button-confirm-delete">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
