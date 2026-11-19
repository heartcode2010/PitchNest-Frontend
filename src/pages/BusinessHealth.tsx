import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, CheckCircle2, CircleDollarSign, Clock3, Loader2, Plus, RefreshCw, ShieldAlert, TrendingDown, TrendingUp } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { listBusinesses, type Business } from "../api/businesses";
import { getBusinessHealth, saveBusinessHealth, type BusinessHealthDiagnosis, type BusinessHealthInput, type BusinessHealthSnapshot } from "../api/businessHealth";

function currentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
}
const initialForm = (): BusinessHealthInput => ({
  periodStart: currentMonth(), currency: "NGN", revenue: 0, directCosts: 0,
  operatingExpenses: 0, cashBalance: 0, marketingSpend: 0,
  newCustomers: 0, activeCustomers: 0, lostCustomers: 0, notes: "",
});
const money = (value: number | null | undefined, currency: string) => value == null
  ? "Not enough data"
  : new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 0 }).format(value);
const monthLabel = (value: string) => new Date(`${value}T00:00:00`).toLocaleDateString(undefined, { month: "long", year: "numeric" });

function MetricCard({ label, value, detail, icon: Icon, tone = "neutral" }: {
  label: string; value: string; detail: string; icon: React.ComponentType<{ size?: number; className?: string }>; tone?: "neutral" | "good" | "bad";
}) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
    <div className="flex items-center justify-between gap-3">
      <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400">{label}</p>
      <Icon size={16} className={tone === "good" ? "text-emerald-600" : tone === "bad" ? "text-rose-500" : "text-slate-400"} />
    </div>
    <p className="mt-3 break-words text-2xl font-bold tracking-tight text-slate-950 dark:text-white">{value}</p>
    <p className="mt-1 text-[11px] leading-relaxed text-slate-400">{detail}</p>
  </div>;
}

function Field({ label, value, onChange, prefix, step = "0.01", min = "0" }: {
  label: string; value: number | string; onChange: (value: string) => void; prefix?: string; step?: string; min?: string;
}) {
  return <label className="block min-w-0">
    <span className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-zinc-300">{label}</span>
    <div className="flex min-w-0 items-center rounded-xl border border-slate-200 bg-white focus-within:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-950">
      {prefix && <span className="pl-3 text-xs text-slate-400">{prefix}</span>}
      <input type="number" min={min} step={step} value={value} onChange={event => onChange(event.target.value)}
        className="w-full min-w-0 rounded-xl bg-transparent px-3 py-2.5 text-sm text-slate-900 outline-none dark:text-white" />
    </div>
  </label>;
}

function statusCopy(status: BusinessHealthDiagnosis["status"]) {
  if (status === "critical") return { title: "Immediate action needed", detail: "Your latest figures contain one or more critical warning signals.", className: "border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-200" };
  if (status === "attention") return { title: "Some areas need attention", detail: "Review the warnings below and track the impact of your next actions.", className: "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200" };
  if (status === "stable") return { title: "No immediate warning detected", detail: "Keep recording consistent monthly figures to spot changes early.", className: "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-200" };
  return { title: "Add your first monthly report", detail: "Enter real business figures to unlock runway, margin and customer diagnostics.", className: "border-slate-200 bg-slate-50 text-slate-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200" };
}

export default function BusinessHealth() {
  const { authFetch } = useAuth();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [businessId, setBusinessId] = useState("");
  const [snapshots, setSnapshots] = useState<BusinessHealthSnapshot[]>([]);
  const [diagnosis, setDiagnosis] = useState<BusinessHealthDiagnosis | null>(null);
  const [form, setForm] = useState<BusinessHealthInput>(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const selectedBusiness = useMemo(() => businesses.find(item => item.id === businessId) ?? null, [businesses, businessId]);
  const refresh = useCallback(async (id: string) => {
    setLoading(true); setError("");
    try {
      const result = await getBusinessHealth(authFetch, id);
      setSnapshots(result.snapshots);
      setDiagnosis(result.diagnosis);
      const thisMonth = result.snapshots.find(item => item.periodStart === currentMonth());
      if (thisMonth) setForm({ ...thisMonth });
      else setForm(initialForm());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load business health.");
    } finally { setLoading(false); }
  }, [authFetch]);

  useEffect(() => {
    let active = true;
    listBusinesses(authFetch).then(items => {
      if (!active) return;
      setBusinesses(items);
      if (items.length) setBusinessId(items[0].id);
      else setLoading(false);
    }).catch(err => {
      if (active) { setError(err instanceof Error ? err.message : "Unable to load your businesses."); setLoading(false); }
    });
    return () => { active = false; };
  }, [authFetch]);

  useEffect(() => { if (businessId) void refresh(businessId); }, [businessId, refresh]);

  const setField = <K extends keyof BusinessHealthInput>(key: K, value: BusinessHealthInput[K]) => {
    setForm(previous => ({ ...previous, [key]: value }));
  };
  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!businessId) return;
    setSaving(true); setError(""); setSuccess("");
    try {
      const result = await saveBusinessHealth(authFetch, businessId, {
        ...form,
        revenue: Number(form.revenue), directCosts: Number(form.directCosts),
        operatingExpenses: Number(form.operatingExpenses), cashBalance: Number(form.cashBalance),
        marketingSpend: Number(form.marketingSpend), newCustomers: Number(form.newCustomers),
        activeCustomers: Number(form.activeCustomers), lostCustomers: Number(form.lostCustomers),
      });
      setSnapshots(result.snapshots); setDiagnosis(result.diagnosis);
      setSuccess("Monthly figures saved. Your diagnosis has been recalculated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save this report.");
    } finally { setSaving(false); }
  };

  const metrics = diagnosis?.metrics;
  const currency = form.currency || metrics?.currency || "NGN";
  const status = statusCopy(diagnosis?.status ?? "insufficient_data");
  const latest = snapshots[0];

  return <div className="mx-auto w-full max-w-6xl space-y-6 pb-12">
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"><Activity size={12}/> Business intelligence</div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">Know what is happening inside your business.</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500 dark:text-zinc-400">Track real monthly numbers, understand cash pressure and spot operating problems before they become expensive.</p>
      </div>
      {businesses.length > 0 && <label className="block min-w-[220px]">
        <span className="mb-1.5 block text-xs font-semibold text-slate-500">Business</span>
        <select value={businessId} onChange={event => setBusinessId(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white">
          {businesses.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
      </label>}
    </header>

    {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">{error}</div>}
    {success && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">{success}</div>}

    {!loading && businesses.length === 0 && <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-zinc-700 dark:bg-zinc-900">
      <Activity size={30} className="mx-auto text-slate-400"/>
      <h2 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">Create your business workspace first</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">Business Health works with a business profile so your financial records stay attached to the right company.</p>
      <a href="/workspace/businesses" className="mt-5 inline-flex rounded-xl bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white">Open business workspace</a>
    </div>}

    {businesses.length > 0 && <>
      <div className={`rounded-2xl border p-4 sm:p-5 ${status.className}`}>
        <div className="flex items-start gap-3">
          {diagnosis?.status === "critical" ? <ShieldAlert size={21} className="mt-0.5 shrink-0"/> : diagnosis?.status === "stable" ? <CheckCircle2 size={21} className="mt-0.5 shrink-0"/> : <AlertTriangle size={21} className="mt-0.5 shrink-0"/>}
          <div><p className="font-bold">{status.title}</p><p className="mt-1 text-sm opacity-80">{status.detail}</p></div>
        </div>
      </div>

      {loading ? <div className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white p-12 text-sm text-slate-500 dark:border-zinc-800 dark:bg-zinc-900"><Loader2 size={18} className="animate-spin"/> Loading saved business records…</div> : <>
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Gross profit" value={money(metrics?.grossProfit, currency)} detail={metrics?.grossMargin == null ? "Add revenue to calculate margin" : `${metrics.grossMargin}% gross margin`} icon={CircleDollarSign} tone={metrics?.grossProfit != null && metrics.grossProfit < 0 ? "bad" : "neutral"}/>
          <MetricCard label="Operating result" value={money(metrics?.operatingProfit, currency)} detail={metrics?.operatingMargin == null ? "After direct costs and overheads" : `${metrics.operatingMargin}% operating margin`} icon={metrics?.operatingProfit != null && metrics.operatingProfit < 0 ? TrendingDown : TrendingUp} tone={metrics?.operatingProfit != null && metrics.operatingProfit < 0 ? "bad" : "good"}/>
          <MetricCard label="Cash runway" value={metrics?.runwayMonths == null ? (metrics?.monthlyNetBurn === 0 && metrics ? "Not burning" : "Not available") : `${metrics.runwayMonths} months`} detail={metrics?.monthlyNetBurn ? `${money(metrics.monthlyNetBurn, currency)} net burn per month` : "Based on latest recorded net burn"} icon={Clock3} tone={metrics?.runwayMonths != null && metrics.runwayMonths < 3 ? "bad" : "neutral"}/>
          <MetricCard label="Customer acquisition cost" value={money(metrics?.customerAcquisitionCost, currency)} detail={metrics?.churnRate == null ? "Add customer counts to calculate churn" : `${metrics.churnRate}% recorded churn rate`} icon={ArrowDownRight}/>
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,.9fr)]">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div><h2 className="text-lg font-bold text-slate-950 dark:text-white">Monthly operating report</h2><p className="mt-1 text-xs text-slate-500">One record per business per month. Saving again replaces that month's figures.</p></div>
              <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600 dark:bg-zinc-800 dark:text-zinc-300">{selectedBusiness?.name ?? "Business"}</span>
            </div>
            <form onSubmit={save} className="mt-5 space-y-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-zinc-300">Reporting month</span><input type="month" required value={form.periodStart.slice(0,7)} onChange={event => setField("periodStart", `${event.target.value}-01`)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"/></label>
                <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-zinc-300">Currency (ISO code)</span><input required maxLength={3} minLength={3} value={form.currency} onChange={event => setField("currency", event.target.value.toUpperCase())} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm uppercase dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"/></label>
              </div>
              <div><p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Revenue and costs</p><div className="grid gap-3 sm:grid-cols-2">
                <Field label="Revenue collected" value={form.revenue} onChange={v => setField("revenue", Number(v))}/>
                <Field label="Direct delivery / product costs" value={form.directCosts} onChange={v => setField("directCosts", Number(v))}/>
                <Field label="Operating expenses" value={form.operatingExpenses} onChange={v => setField("operatingExpenses", Number(v))}/>
                <Field label="Cash currently available" value={form.cashBalance} onChange={v => setField("cashBalance", Number(v))}/>
                <Field label="Marketing and sales spend" value={form.marketingSpend} onChange={v => setField("marketingSpend", Number(v))}/>
              </div></div>
              <div><p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Customer movement</p><div className="grid gap-3 sm:grid-cols-3">
                <Field label="New customers" step="1" value={form.newCustomers} onChange={v => setField("newCustomers", Number(v))}/>
                <Field label="Active customers" step="1" value={form.activeCustomers} onChange={v => setField("activeCustomers", Number(v))}/>
                <Field label="Customers lost" step="1" value={form.lostCustomers} onChange={v => setField("lostCustomers", Number(v))}/>
              </div></div>
              <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-zinc-300">Context / notes (optional)</span><textarea rows={3} maxLength={2000} value={form.notes} onChange={event => setField("notes", event.target.value)} placeholder="Explain unusual costs, one-off revenue, major customer losses or other context…" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"/></label>
              <button type="submit" disabled={saving} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-800 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:opacity-60 sm:w-auto">{saving ? <><Loader2 size={16} className="animate-spin"/> Saving report…</> : <><Plus size={16}/> Save and diagnose this month</>}</button>
            </form>
          </section>

          <section className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="text-lg font-bold text-slate-950 dark:text-white">What needs attention</h2>
              <p className="mt-1 text-xs text-slate-500">Diagnostics are calculated from the figures you provide, not invented market data.</p>
              <div className="mt-4 space-y-3">
                {(diagnosis?.issues ?? []).map((issue, index) => <div key={`${issue.title}-${index}`} className="rounded-xl border border-slate-100 p-3 dark:border-zinc-800">
                  <div className="flex items-start gap-2"><span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${issue.severity === "critical" ? "bg-rose-500" : issue.severity === "warning" ? "bg-amber-500" : "bg-emerald-500"}`}/><div><p className="text-sm font-bold text-slate-900 dark:text-zinc-100">{issue.title}</p><p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-zinc-400">{issue.detail}</p></div></div>
                </div>)}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="text-lg font-bold text-slate-950 dark:text-white">Recommended next actions</h2>
              <ol className="mt-4 space-y-3">
                {(diagnosis?.nextActions ?? []).map((action, index) => <li key={action} className="flex gap-3 text-sm text-slate-600 dark:text-zinc-300"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[11px] font-bold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">{index + 1}</span><span className="leading-relaxed">{action}</span></li>)}
              </ol>
            </div>
          </section>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between gap-3"><div><h2 className="text-lg font-bold text-slate-950 dark:text-white">Saved monthly history</h2><p className="mt-1 text-xs text-slate-500">Your latest 24 records. Select a month to edit its figures.</p></div><button onClick={() => void refresh(businessId)} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"><RefreshCw size={13}/> Refresh</button></div>
          {snapshots.length === 0 ? <p className="mt-5 rounded-xl bg-slate-50 p-5 text-center text-sm text-slate-500 dark:bg-zinc-950">No monthly records yet. Save your first report to start building a trend.</p> : <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[560px] text-left text-sm"><thead><tr className="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400 dark:border-zinc-800"><th className="pb-3">Month</th><th className="pb-3 text-right">Revenue</th><th className="pb-3 text-right">Expenses</th><th className="pb-3 text-right">Cash</th><th className="pb-3 text-right">Customers</th></tr></thead><tbody>{snapshots.map(item => <tr key={item.id} onClick={() => setForm({ ...item })} className={`cursor-pointer border-b border-slate-50 last:border-0 hover:bg-slate-50 dark:border-zinc-800/70 dark:hover:bg-zinc-800/40 ${form.periodStart === item.periodStart ? "bg-emerald-50/60 dark:bg-emerald-950/10" : ""}`}><td className="py-3 font-semibold text-slate-800 dark:text-zinc-200">{monthLabel(item.periodStart)}</td><td className="py-3 text-right tabular-nums">{money(item.revenue, item.currency)}</td><td className="py-3 text-right tabular-nums">{money(item.directCosts + item.operatingExpenses, item.currency)}</td><td className="py-3 text-right tabular-nums">{money(item.cashBalance, item.currency)}</td><td className="py-3 text-right tabular-nums">{item.activeCustomers}</td></tr>)}</tbody></table></div>}
        </section>
      </>}
    </>}
    <p className="text-[11px] leading-relaxed text-slate-400">This tool provides operational calculations based on user-entered figures. It is not an accounting audit, tax opinion or investment advice. Confirm important decisions with a qualified professional.</p>
  </div>;
}
