import { useState } from "react";
import { Plus, Pencil, Trash2, Package, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  useListPlans, getListPlansQueryKey, useCreatePlan, useUpdatePlan, useDeletePlan,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/layouts/AdminLayout";
import { formatPrice } from "@/lib/utils";

interface PlanForm {
  name: string;
  price: string;
  currency: "INR" | "USD";
  leadsPerDay: string;
  features: string;
  isActive: boolean;
}

const emptyForm: PlanForm = { name: "", price: "", currency: "INR", leadsPerDay: "", features: "", isActive: true };

export default function AdminPlansPage() {
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: plans, isLoading } = useListPlans();
  const createPlan = useCreatePlan();
  const updatePlan = useUpdatePlan();
  const deletePlan = useDeletePlan();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<PlanForm>(emptyForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const openCreate = () => { setForm(emptyForm); setEditingId(null); setDialogOpen(true); };
  const openEdit = (plan: any) => {
    setForm({
      name: plan.name, price: plan.price.toString(),
      currency: (plan.currency as "INR" | "USD") || "INR",
      leadsPerDay: plan.leadsPerDay.toString(),
      features: (plan.features || []).join("\n"), isActive: plan.isActive,
    });
    setEditingId(plan.id);
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    const features = form.features.split("\n").map((f) => f.trim()).filter(Boolean);
    const data = {
      name: form.name,
      price: parseFloat(form.price),
      currency: form.currency,
      leadsPerDay: parseInt(form.leadsPerDay, 10),
      features,
    };
    if (editingId) {
      updatePlan.mutate({ planId: editingId, data: { ...data, isActive: form.isActive } }, {
        onSuccess: () => { qc.invalidateQueries({ queryKey: getListPlansQueryKey() }); setDialogOpen(false); toast({ title: "Plan updated" }); },
      });
    } else {
      createPlan.mutate({ data }, {
        onSuccess: () => { qc.invalidateQueries({ queryKey: getListPlansQueryKey() }); setDialogOpen(false); toast({ title: "Plan created" }); },
      });
    }
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deletePlan.mutate({ planId: deleteId }, {
      onSuccess: () => { qc.invalidateQueries({ queryKey: getListPlansQueryKey() }); setDeleteId(null); toast({ title: "Plan deleted" }); },
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black">Plan Management</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Create and manage subscription plans</p>
          </div>
          <Button className="gradient-primary text-white border-0" onClick={openCreate} data-testid="button-create-plan">
            <Plus className="w-4 h-4 mr-2" /> Add Plan
          </Button>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-64 rounded-xl" />)}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {(plans || []).map((plan) => (
              <div key={plan.id} className="p-5 rounded-xl border border-border/50 bg-card" data-testid={`plan-card-${plan.id}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center">
                    <Package className="w-4 h-4 text-primary" />
                  </div>
                  <Badge className={`text-xs ${plan.isActive ? "bg-green-500/15 text-green-400 border-green-500/20" : "bg-muted text-muted-foreground"}`}>
                    {plan.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <h3 className="font-bold text-lg">{plan.name}</h3>
                <div className="text-2xl font-black mt-1 mb-0.5">{formatPrice(plan.price, plan.currency)}<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
                <div className="text-xs text-muted-foreground mb-3">{plan.leadsPerDay} leads/day</div>
                <ul className="space-y-1.5 mb-4">
                  {(plan.features || []).slice(0, 3).map((f) => (
                    <li key={f} className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" /> {f}
                    </li>
                  ))}
                  {(plan.features || []).length > 3 && (
                    <li className="text-xs text-muted-foreground">+{(plan.features || []).length - 3} more features</li>
                  )}
                </ul>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => openEdit(plan)} data-testid={`button-edit-plan-${plan.id}`}>
                    <Pencil className="w-3 h-3 mr-1" /> Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => setDeleteId(plan.id)} data-testid={`button-delete-plan-${plan.id}`}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
            {(plans || []).length === 0 && (
              <div className="col-span-3 py-12 text-center text-sm text-muted-foreground">No plans yet. Create one.</div>
            )}
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent data-testid="dialog-plan-form">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Plan" : "Create Plan"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Plan Name *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Pro" className="mt-1" data-testid="input-plan-name" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Price *</Label>
                <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="5000" className="mt-1" data-testid="input-plan-price" />
              </div>
              <div>
                <Label>Currency *</Label>
                <select
                  value={form.currency}
                  onChange={(e) => setForm({ ...form, currency: e.target.value as "INR" | "USD" })}
                  className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  data-testid="select-plan-currency"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                </select>
              </div>
            </div>
            <div>
              <Label>Leads Per Day *</Label>
              <Input type="number" value={form.leadsPerDay} onChange={(e) => setForm({ ...form, leadsPerDay: e.target.value })} placeholder="20" className="mt-1" data-testid="input-plan-leads-per-day" />
            </div>
            <div>
              <Label>Features (one per line)</Label>
              <textarea
                value={form.features}
                onChange={(e) => setForm({ ...form, features: e.target.value })}
                placeholder={"Daily leads delivery\nHigh-intent scoring\nCRM tracking"}
                rows={5}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                data-testid="textarea-plan-features"
              />
            </div>
            {editingId && (
              <div className="flex items-center gap-3">
                <Switch checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} data-testid="switch-plan-active" />
                <Label>Active</Label>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button className="gradient-primary text-white border-0" onClick={handleSubmit} disabled={!form.name || !form.price || !form.leadsPerDay} data-testid="button-save-plan">
              {editingId ? "Save Changes" : "Create Plan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Plan</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete this plan. Users currently on this plan will not be affected immediately.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={handleDelete} data-testid="button-confirm-delete-plan">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
