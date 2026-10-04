import {Activity, ArrowRight, BarChart3, Check, ChevronRight, CircleDollarSign, Database, FileDown, LayoutDashboard, LockKeyhole, Radio, ShieldCheck, ShoppingCart, Sparkles, TrendingUp, UserRound, UsersRound, Zap,} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

// AI Code
const capabilities = [
  { icon: LayoutDashboard, title: "Executive dashboard", description: "Monitor revenue, orders, users, conversion and recent activity from one focused command center." },
  { icon: BarChart3, title: "Actionable analytics", description: "Understand revenue performance, customer acquisition and traffic sources with clear visual reporting." },
  { icon: Radio, title: "Real-time updates", description: "Socket.IO keeps important order activity and dashboard metrics fresh without manual page refreshes." },
  { icon: FileDown, title: "Reports & export", description: "Review operational trends and export report data as CSV whenever you need it outside the dashboard." },
];

const modules = [
  { icon: LayoutDashboard, title: "Dashboard", description: "A high-level view of business performance and recent activity." },
  { icon: TrendingUp, title: "Analytics", description: "Revenue, acquisition and traffic insights for better decisions." },
  { icon: FileDown, title: "Reports", description: "Structured reporting with filters and CSV export." },
  { icon: UsersRound, title: "Users", description: "Manage users, roles, status and account access." },
  { icon: ShoppingCart, title: "Orders", description: "Monitor orders, details, amounts and live status changes." },
  { icon: UserRound, title: "Customers", description: "Explore customers, order history and customer activity." },
];

const securityItems = [
  "JWT-based authentication",
  "Session-aware access control",
  "Admin, Manager and User roles",
  "Protected application routes",
];

const stack = ["React", "Node.js", "Express", "MongoDB", "REST APIs", "Socket.IO"];

function SectionEyebrow({ children }) {
  return (
    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
      {children}
    </div>
  );
}

function ProductPreview() {
  return (
    <div className="relative mx-auto w-full max-w-2xl lg:ml-auto">
      <div className="absolute -inset-6 rounded-[2rem] bg-primary/10 blur-3xl" />
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/10">
        <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Activity className="h-4 w-4" /></div>
            <div><p className="text-xs font-semibold">PulseBoard</p><p className="text-[10px] text-muted-foreground">Live business overview</p></div>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Live</div>
        </div>
        <div className="grid gap-3 p-4 sm:grid-cols-3 sm:p-5">
          {[['Revenue','₹24.8L','+12.8%',CircleDollarSign],['Orders','1,284','+8.4%',ShoppingCart],['Customers','8,942','+5.2%',UsersRound]].map(([label,value,change,Icon]) => (
            <div key={label} className="rounded-xl border border-border bg-background/70 p-3">
              <div className="mb-4 flex items-center justify-between"><span className="text-[10px] text-muted-foreground">{label}</span><Icon className="h-3.5 w-3.5 text-muted-foreground" /></div>
              <p className="text-lg font-semibold tracking-tight">{value}</p>
              <p className="mt-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">{change} this period</p>
            </div>
          ))}
        </div>
        <div className="grid gap-4 border-t border-border p-4 sm:grid-cols-[1.5fr_0.8fr] sm:p-5">
          <div className="rounded-xl border border-border bg-background/70 p-4">
            <div className="mb-5 flex items-center justify-between"><div><p className="text-xs font-semibold">Revenue performance</p><p className="mt-0.5 text-[10px] text-muted-foreground">Last 7 months</p></div><BarChart3 className="h-4 w-4 text-muted-foreground" /></div>
            <div className="flex h-32 items-end gap-2 sm:h-36">
              {[42,58,49,73,64,88,100].map((height,index) => <div key={index} className="flex flex-1 flex-col justify-end gap-1"><div className="rounded-t-md bg-primary/80" style={{height:`${height}%`}} /><span className="text-center text-[8px] text-muted-foreground">{index+1}</span></div>)}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-background/70 p-4">
            <div className="mb-4 flex items-center justify-between"><div><p className="text-xs font-semibold">Live activity</p><p className="mt-0.5 text-[10px] text-muted-foreground">Updated instantly</p></div><Zap className="h-4 w-4 text-amber-500" /></div>
            <div className="space-y-3">{['New order received','Order completed','Customer updated'].map((item,index) => <div key={item} className="flex items-center gap-2.5"><div className="h-2 w-2 rounded-full bg-primary/70" /><div className="min-w-0 flex-1"><p className="truncate text-[10px] font-medium">{item}</p><p className="text-[9px] text-muted-foreground">{index+1} min ago</p></div></div>)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// AI Code

export default function Home() {
  return (
    <div className="overflow-hidden bg-background text-foreground">
      <section id="overview" className="relative isolate border-b border-border">
        <div className="absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.12),transparent_42%)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-16 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:px-10 lg:py-24 xl:gap-20">
          <div>
            <SectionEyebrow><Sparkles className="h-3.5 w-3.5" />Enterprise analytics, without the noise</SectionEyebrow>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl lg:text-6xl xl:text-7xl">See your business <span className="text-primary">clearly.</span></h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">PulseBoard brings your dashboard, analytics, reports, users, orders and customers into one modern workspace — with real-time updates when your business changes.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/register"><Button size="lg" className="h-11 w-full px-5 sm:w-auto">Get started <ArrowRight /></Button></Link>
              <Link to="/login"><Button size="lg" variant="outline" className="h-11 w-full px-5 sm:w-auto">Sign in</Button></Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
              {['Real-time insights','Role-based access','Operational control'].map(item => <span key={item} className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-500" />{item}</span>)}
            </div>
          </div>
          <ProductPreview />
        </div>
      </section>

      <section id="features" className="border-b border-border bg-muted/20">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10 lg:py-24">
          <div className="max-w-2xl"><SectionEyebrow>Built around the work that matters</SectionEyebrow><h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">One workspace. <span className="text-muted-foreground">Every important signal.</span></h2><p className="mt-4 leading-7 text-muted-foreground">From high-level performance to individual customer activity, PulseBoard turns operational data into a workspace your team can actually use.</p></div>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {capabilities.map(({icon:Icon,title,description}) => <article key={title} className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div><h3 className="mt-5 font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p></article>)}
          </div>
        </div>
      </section>

      <section id="modules" className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10 lg:py-24">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div className="max-w-2xl"><SectionEyebrow>Explore the platform</SectionEyebrow><h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Everything your operations need, <span className="text-muted-foreground">in one place.</span></h2></div><Link to="/register" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">Explore PulseBoard <ChevronRight className="h-4 w-4" /></Link></div>
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {modules.map(({icon:Icon,title,description},index) => <article key={title} className="bg-card p-6 sm:p-7"><div className="flex items-start justify-between"><div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-primary"><Icon className="h-5 w-5" /></div><span className="text-xs font-medium text-muted-foreground">0{index+1}</span></div><h3 className="mt-7 font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p></article>)}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-muted/20">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 sm:px-8 lg:grid-cols-2 lg:px-10 lg:py-24">
          <div><SectionEyebrow><Radio className="h-3.5 w-3.5" />Real-time by design</SectionEyebrow><h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Your dashboard changes <span className="text-primary">when your business does.</span></h2><p className="mt-5 max-w-xl leading-7 text-muted-foreground">PulseBoard uses Socket.IO alongside its REST APIs to keep important order activity and dashboard information synchronized. The interface stays responsive while REST remains the source of truth.</p><div className="mt-7 flex items-center gap-3 rounded-xl border border-border bg-card p-4"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"><Radio className="h-4 w-4" /></div><div><p className="text-sm font-medium">Live connection active</p><p className="text-xs text-muted-foreground">Events update the experience without a manual refresh.</p></div></div></div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7"><div className="flex items-center justify-between border-b border-border pb-4"><div><p className="text-sm font-semibold">Event stream</p><p className="text-xs text-muted-foreground">Recent system activity</p></div><Activity className="h-5 w-5 text-primary" /></div><div className="divide-y divide-border">{[['order:created','New order added to the workspace','Just now'],['order:status-updated','Order status changed to Completed','12 sec ago'],['dashboard:refresh','Metrics synchronized from REST API','24 sec ago']].map(([event,text,time]) => <div key={event} className="flex gap-4 py-4"><div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" /><div className="min-w-0 flex-1"><div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm font-medium">{text}</p><span className="text-[10px] text-muted-foreground">{time}</span></div><p className="mt-1 font-mono text-[10px] text-muted-foreground">{event}</p></div></div>)}</div></div>
        </div>
      </section>

      <section id="security" className="border-b border-border">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:py-24">
          <div><SectionEyebrow><ShieldCheck className="h-3.5 w-3.5" />Security & access</SectionEyebrow><h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Built for controlled access, <span className="text-muted-foreground">not just pretty charts.</span></h2><p className="mt-5 max-w-xl leading-7 text-muted-foreground">Authentication, sessions and role-based permissions are part of the product foundation, so different users can work with the areas they are allowed to access.</p></div>
          <div className="grid gap-3 sm:grid-cols-2">{securityItems.map(item => <div key={item} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><LockKeyhole className="h-4 w-4" /></div><span className="text-sm font-medium">{item}</span></div>)}</div>
        </div>
      </section>

      <section id="about" className="border-b border-border bg-muted/20">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div><SectionEyebrow><Database className="h-3.5 w-3.5" />Modern application architecture</SectionEyebrow><h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">A serious frontend, backed by a real application stack.</h2><p className="mt-5 max-w-2xl leading-7 text-muted-foreground">PulseBoard combines a React interface with a Node.js/Express backend, MongoDB data, REST APIs and Socket.IO events. The result is a portfolio-grade product experience built around real application workflows.</p><div className="mt-7 flex flex-wrap gap-2">{stack.map(item => <span key={item} className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground">{item}</span>)}</div></div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-7"><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground"><ShieldCheck className="h-5 w-5" /></div><div><p className="font-semibold">Designed as a complete product</p><p className="text-xs text-muted-foreground">Not just a dashboard mockup</p></div></div><div className="mt-6 space-y-3">{['Real data workflows','Protected routes & roles','Live application events','Responsive product UI'].map(item => <div key={item} className="flex items-center gap-2.5 text-sm"><Check className="h-4 w-4 text-emerald-500" />{item}</div>)}</div></div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.12),transparent_55%)]" />
        <div className="relative mx-auto max-w-4xl px-6 py-20 text-center sm:px-8 lg:py-28">
          <SectionEyebrow><Sparkles className="h-3.5 w-3.5" />Ready when you are</SectionEyebrow>
          <h2 className="text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">Turn your data into a <span className="text-primary">clearer picture.</span></h2>
          <p className="mx-auto mt-5 max-w-2xl leading-7 text-muted-foreground">Create your PulseBoard workspace and explore the tools built for monitoring, analyzing and managing your business.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link to="/register"><Button size="lg" className="h-11 px-6">Create your account <ArrowRight /></Button></Link><Link to="/login"><Button size="lg" variant="outline" className="h-11 px-6">Sign in</Button></Link></div>
        </div>
      </section>
    </div>
  );
}
