import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { 
  Building2, 
  Home, 
  Briefcase, 
  Users, 
  Award, 
  TrendingUp,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Sparkles,
  Shield,
  LineChart,
  Brain,
  Lock,
  FileCheck,
  MessageSquare,
  ChevronRight
} from "lucide-react";

export default function HomePage() {
  return (
    <>
      <Header />
      
      {/* Hero Section - Quiet Luxury Aesthetic */}
      <section className="relative min-h-screen flex items-center pt-20">
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 bg-base" />
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `radial-gradient(circle at 70% 30%, rgba(64, 224, 255, 0.08) 0%, transparent 50%),
                           radial-gradient(circle at 30% 70%, rgba(193, 155, 110, 0.06) 0%, transparent 40%)`
        }} />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Content */}
            <div className="max-w-xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-px w-12 bg-accent-400" />
                <span className="text-sm font-medium text-brand-500 tracking-widest uppercase">
                  Modern Brokerage
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-display text-brand-900 mb-8">
                Your Guide to<br />
                <span className="text-gradient-luxury">Exceptional</span><br />
                Outcomes
              </h1>
              
              <p className="text-xl text-brand-500 mb-10 leading-relaxed">
                Navigating real estate and business transactions requires more than expertise — 
                it requires a trusted guide who combines institutional knowledge with 
                cutting-edge technology to serve your unique journey.
              </p>
              
              {/* Persona Pathfinding - Split Navigation */}
              <div className="mb-12">
                <p className="text-sm text-brand-400 mb-4 uppercase tracking-wide">I&apos;m looking to:</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Buy Property", href: "#services" },
                    { label: "Sell Property", href: "#services" },
                    { label: "Invest", href: "#services" },
                    { label: "Buy/Sell Business", href: "#services" },
                  ].map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="group flex items-center justify-between px-5 py-4 bg-white border border-brand-200 rounded-xl hover:border-accent-400 hover:bg-brand-50 transition-all duration-300"
                    >
                      <span className="font-medium text-brand-800">{item.label}</span>
                      <ChevronRight className="h-4 w-4 text-brand-400 group-hover:text-accent-500 group-hover:translate-x-1 transition-all" />
                    </a>
                  ))}
                </div>
              </div>
              
              {/* Trust Signals */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-brand-400">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-accent-500" />
                  <span>Licensed Broker</span>
                </div>
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-accent-500" />
                  <span>AI-Enhanced</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-accent-500" />
                  <span>RE/MAX</span>
                </div>
              </div>
            </div>
            
            {/* Right - Katherine's Photo */}
            <div className="relative hidden lg:block">
              <div className="relative">
                {/* Decorative frame */}
                <div className="absolute -inset-4 bg-gradient-to-br from-accent-400/20 to-gold-400/20 rounded-3xl blur-2xl" />
                
                {/* Photo container */}
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="https://papiphotos.remax-im.com/Person/102525316/MainPhoto_cropped/MainPhoto_cropped.jpg"
                    alt="Katherine Minovski - Broker"
                    fill
                    className="object-cover"
                    priority
                  />
                  {/* Subtle overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-900/40 via-transparent to-transparent" />
                  
                  {/* Name card */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="glass-surface px-6 py-4 rounded-xl">
                      <p className="font-display text-xl text-brand-900">Katherine Minovski</p>
                      <p className="text-sm text-brand-500">Broker | RE/MAX Your Community Realty</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition - The Guide Framework */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-8 bg-accent-400" />
              <span className="text-sm font-medium text-brand-500 tracking-widest uppercase">
                The Difference
              </span>
              <div className="h-px w-8 bg-accent-400" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-display text-brand-900 mb-6">
              Not Just a Transaction.<br />
              <span className="text-accent-500">A Partnership.</span>
            </h2>
            
            <p className="text-lg text-brand-500 leading-relaxed">
              Your biggest financial decisions deserve more than a salesperson — 
              they deserve a strategic partner who understands your goals 
              and has the tools to achieve them.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Brain,
                title: "AI-Powered Intelligence",
                description: "Market analysis, predictive pricing, and personalized recommendations driven by cutting-edge technology."
              },
              {
                icon: Sparkles,
                title: "White Glove Service",
                description: "Bespoke attention at every step. Your journey is unique — your experience should be too."
              },
              {
                icon: LineChart,
                title: "Data-Driven Strategy",
                description: "Investment calculators, demographic insights, and market intelligence for informed decisions."
              },
              {
                icon: Lock,
                title: "Transparent Process",
                description: "Real-time transaction tracking, secure document management, and clear communication always."
              }
            ].map((item, i) => (
              <div key={i} className="group card-hover">
                <div className="h-full bg-brand-50 rounded-2xl p-8 border border-brand-100">
                  <div className="w-12 h-12 bg-brand-900 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent-500 transition-colors duration-300">
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-display text-brand-900 mb-3">{item.title}</h3>
                  <p className="text-brand-500 text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services - Siloed Hierarchy */}
      <section id="services" className="py-24 bg-brand-900">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-8 bg-accent-400" />
              <span className="text-sm font-medium text-accent-400 tracking-widest uppercase">
                Services
              </span>
              <div className="h-px w-8 bg-accent-400" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-display text-white mb-6">
              Multi-Sector Expertise.<br />
              <span className="text-accent-400">Single Point of Trust.</span>
            </h2>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Residential */}
            <div className="group relative bg-brand-800/50 rounded-3xl p-10 border border-brand-700 hover:border-accent-400/50 transition-all duration-500">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-400 to-accent-500 rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <Home className="h-10 w-10 text-accent-400 mb-6" />
              <h3 className="text-2xl font-display text-white mb-4">Residential</h3>
              <p className="text-brand-300 mb-8 leading-relaxed">
                From first homes to legacy estates. Lifestyle-focused guidance 
                that goes beyond square footage to understand how you want to live.
              </p>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-brand-400">
                  <div className="w-1.5 h-1.5 bg-accent-400 rounded-full" />
                  Buyer Representation
                </div>
                <div className="flex items-center gap-3 text-brand-400">
                  <div className="w-1.5 h-1.5 bg-accent-400 rounded-full" />
                  Seller Representation
                </div>
                <div className="flex items-center gap-3 text-brand-400">
                  <div className="w-1.5 h-1.5 bg-accent-400 rounded-full" />
                  Investment Properties
                </div>
                <div className="flex items-center gap-3 text-brand-400">
                  <div className="w-1.5 h-1.5 bg-accent-400 rounded-full" />
                  Residential Leasing
                </div>
              </div>
            </div>
            
            {/* Commercial */}
            <div className="group relative bg-brand-800/50 rounded-3xl p-10 border border-brand-700 hover:border-accent-400/50 transition-all duration-500">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-400 to-accent-500 rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <Building2 className="h-10 w-10 text-accent-400 mb-6" />
              <h3 className="text-2xl font-display text-white mb-4">Commercial</h3>
              <p className="text-brand-300 mb-8 leading-relaxed">
                Data-driven acquisitions and dispositions. Cap rate analysis, 
                demographic overlays, and strategic positioning for institutional returns.
              </p>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-brand-400">
                  <div className="w-1.5 h-1.5 bg-accent-400 rounded-full" />
                  Investment Analysis
                </div>
                <div className="flex items-center gap-3 text-brand-400">
                  <div className="w-1.5 h-1.5 bg-accent-400 rounded-full" />
                  Retail & Office
                </div>
                <div className="flex items-center gap-3 text-brand-400">
                  <div className="w-1.5 h-1.5 bg-accent-400 rounded-full" />
                  Industrial & Multi-Family
                </div>
                <div className="flex items-center gap-3 text-brand-400">
                  <div className="w-1.5 h-1.5 bg-accent-400 rounded-full" />
                  Commercial Leasing
                </div>
              </div>
            </div>
            
            {/* Business Brokerage */}
            <div className="group relative bg-brand-800/50 rounded-3xl p-10 border border-brand-700 hover:border-accent-400/50 transition-all duration-500">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-400 to-accent-500 rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <Briefcase className="h-10 w-10 text-accent-400 mb-6" />
              <h3 className="text-2xl font-display text-white mb-4">Business Advisory</h3>
              <p className="text-brand-300 mb-8 leading-relaxed">
                Complete transaction lifecycle for business sales. Valuations, 
                deal structuring, and negotiation with institutional precision.
              </p>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-brand-400">
                  <div className="w-1.5 h-1.5 bg-accent-400 rounded-full" />
                  Business Valuations
                </div>
                <div className="flex items-center gap-3 text-brand-400">
                  <div className="w-1.5 h-1.5 bg-accent-400 rounded-full" />
                  Buyer Representation
                </div>
                <div className="flex items-center gap-3 text-brand-400">
                  <div className="w-1.5 h-1.5 bg-accent-400 rounded-full" />
                  Seller Representation
                </div>
                <div className="flex items-center gap-3 text-brand-400">
                  <div className="w-1.5 h-1.5 bg-accent-400 rounded-full" />
                  Deal Structuring
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About - The Guide */}
      <section id="about" className="py-24 bg-base">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Photo - Mobile visible */}
            <div className="lg:hidden relative">
              <div className="aspect-square rounded-2xl overflow-hidden">
                <Image
                  src="https://papiphotos.remax-im.com/Person/102525316/MainPhoto_cropped/MainPhoto_cropped.jpg"
                  alt="Katherine Minovski"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-8 bg-accent-400" />
                <span className="text-sm font-medium text-brand-500 tracking-widest uppercase">
                  Your Guide
                </span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-display text-brand-900 mb-8">
                Built for Complexity.<br />
                <span className="text-accent-500">Driven by Results.</span>
              </h2>
              
              <div className="space-y-6 text-brand-600 leading-relaxed">
                <p className="text-lg">
                  Before real estate, Katherine Minovski spent over a decade at the highest levels 
                  of enterprise sales — serving as <strong className="text-brand-900">VP of Sales and VP of Product Development</strong>, 
                  closing seven-figure deals with Fortune 500 clients, and building relationships with 
                  30+ national agencies representing Ford, Toyota, Mercedes, and more.
                </p>
                
                <p>
                  She didn&apos;t just meet targets — she consistently exceeded them. <strong className="text-accent-600">20-28% growth</strong> in 
                  an industry averaging 14-17%. <strong className="text-accent-600">135% of quota</strong> on eight-figure targets. 
                  She knows what it takes to navigate complexity and close high-stakes deals.
                </p>
                
                <p>
                  Today, that institutional expertise powers K8ts Estates — combined with AI-driven 
                  market intelligence and a commitment to white-glove service that treats every client 
                  like their only client.
                </p>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-10 pt-10 border-t border-brand-200">
                <div>
                  <div className="text-3xl font-display text-accent-500">135%</div>
                  <div className="text-sm text-brand-500 mt-1">Quota Achievement</div>
                </div>
                <div>
                  <div className="text-3xl font-display text-accent-500">30+</div>
                  <div className="text-sm text-brand-500 mt-1">Agency Partners</div>
                </div>
                <div>
                  <div className="text-3xl font-display text-accent-500">7-Fig</div>
                  <div className="text-sm text-brand-500 mt-1">Deals Closed</div>
                </div>
              </div>
            </div>
            
            {/* Photo - Desktop */}
            <div className="hidden lg:block relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-accent-400/10 to-gold-400/10 rounded-3xl" />
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                <Image
                  src="https://papiphotos.remax-im.com/Person/102525316/MainPhoto_cropped/MainPhoto_cropped.jpg"
                  alt="Katherine Minovski"
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Quote overlay */}
              <div className="absolute -bottom-8 -left-8 right-16 bg-brand-900 text-white p-8 rounded-2xl shadow-xl">
                <p className="font-display text-xl italic leading-relaxed">
                  &ldquo;Complex transactions require someone who&apos;s been in the arena. 
                  I bring institutional rigor to every engagement.&rdquo;
                </p>
                <p className="text-accent-400 font-medium mt-4">— Katherine Minovski</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Architecture - Client Portal Preview */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-8 bg-accent-400" />
                <span className="text-sm font-medium text-brand-500 tracking-widest uppercase">
                  Client Experience
                </span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-display text-brand-900 mb-6">
                Transparency at<br />
                <span className="text-accent-500">Every Step.</span>
              </h2>
              
              <p className="text-lg text-brand-500 mb-10 leading-relaxed">
                From initial consultation to closing day, you&apos;ll never wonder 
                where things stand. Our client portal provides real-time visibility 
                into your entire transaction lifecycle.
              </p>
              
              <div className="space-y-6">
                {[
                  {
                    icon: FileCheck,
                    title: "Transaction Tracking",
                    description: "Live progress updates on inspections, approvals, and milestones."
                  },
                  {
                    icon: Lock,
                    title: "Secure Document Vault",
                    description: "All your contracts and documents in one encrypted location."
                  },
                  {
                    icon: MessageSquare,
                    title: "Direct Communication",
                    description: "Message directly with your team — no phone tag, no delays."
                  }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center shrink-0">
                      <item.icon className="h-6 w-6 text-accent-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-brand-900 mb-1">{item.title}</h4>
                      <p className="text-sm text-brand-500">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Portal Preview Mockup */}
            <div className="relative">
              <div className="bg-brand-900 rounded-2xl p-8 shadow-2xl">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                
                <div className="space-y-4">
                  <div className="bg-brand-800 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-brand-400">Transaction Progress</span>
                      <span className="text-sm text-accent-400">75%</span>
                    </div>
                    <div className="h-2 bg-brand-700 rounded-full">
                      <div className="h-2 bg-accent-400 rounded-full" style={{ width: '75%' }} />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-brand-800 rounded-lg p-4">
                      <div className="text-xs text-brand-400 mb-1">Next Milestone</div>
                      <div className="text-white font-medium">Home Inspection</div>
                      <div className="text-xs text-accent-400 mt-1">Feb 15, 2026</div>
                    </div>
                    <div className="bg-brand-800 rounded-lg p-4">
                      <div className="text-xs text-brand-400 mb-1">Documents</div>
                      <div className="text-white font-medium">12 Files</div>
                      <div className="text-xs text-green-400 mt-1">All signed</div>
                    </div>
                  </div>
                  
                  <div className="bg-brand-800 rounded-lg p-4">
                    <div className="text-xs text-brand-400 mb-2">Recent Activity</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-brand-300">
                        <span>Offer accepted</span>
                        <span className="text-brand-500">2d ago</span>
                      </div>
                      <div className="flex justify-between text-brand-300">
                        <span>Mortgage pre-approval</span>
                        <span className="text-brand-500">5d ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-brand-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `radial-gradient(circle at 30% 50%, rgba(64, 224, 255, 0.15) 0%, transparent 50%)`
        }} />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-display text-white mb-6">
              Ready to Work With<br />
              <span className="text-accent-400">a True Partner?</span>
            </h2>
            <p className="text-xl text-brand-300 mb-10 leading-relaxed">
              Let&apos;s have a conversation about your goals. No pressure — 
              just a chance to see if we&apos;re the right fit for your journey.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" variant="secondary">
                <Phone className="mr-2 h-5 w-5" />
                (416) 816-7850
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <Mail className="mr-2 h-5 w-5" />
                Send Message
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 bg-base">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-8 bg-accent-400" />
                <span className="text-sm font-medium text-brand-500 tracking-widest uppercase">
                  Contact
                </span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-display text-brand-900 mb-6">
                Let&apos;s Start<br />
                <span className="text-accent-500">a Conversation.</span>
              </h2>
              
              <p className="text-lg text-brand-500 mb-10 leading-relaxed">
                Serving Southern Ontario — Toronto, Vaughan, Markham, and the greater GTA. 
                Available in-person, by phone, or video call.
              </p>
              
              <div className="space-y-6">
                <a href="tel:+14168167850" className="flex items-center gap-4 group">
                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                    <Phone className="h-6 w-6 text-brand-600" />
                  </div>
                  <div>
                    <div className="text-sm text-brand-400">Phone</div>
                    <div className="text-lg text-brand-900 font-medium">(416) 816-7850</div>
                  </div>
                </a>
                
                <a href="mailto:kminovski@gmail.com" className="flex items-center gap-4 group">
                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                    <Mail className="h-6 w-6 text-brand-600" />
                  </div>
                  <div>
                    <div className="text-sm text-brand-400">Email</div>
                    <div className="text-lg text-brand-900 font-medium">kminovski@gmail.com</div>
                  </div>
                </a>
                
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <MapPin className="h-6 w-6 text-brand-600" />
                  </div>
                  <div>
                    <div className="text-sm text-brand-400">Office</div>
                    <div className="text-brand-900">RE/MAX Your Community Realty</div>
                    <div className="text-sm text-brand-500">161 Main Street, Unionville, ON</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Form */}
            <div className="bg-white rounded-3xl p-10 shadow-sm">
              <h3 className="text-2xl font-display text-brand-900 mb-2">Send a Message</h3>
              <p className="text-brand-500 mb-8">Typically respond within a few hours.</p>
              
              <form className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <input 
                    type="text" 
                    placeholder="First Name" 
                    className="w-full px-5 py-4 bg-brand-50 rounded-xl border-0 focus:ring-2 focus:ring-accent-400 outline-none transition text-brand-900 placeholder:text-brand-400"
                  />
                  <input 
                    type="text" 
                    placeholder="Last Name" 
                    className="w-full px-5 py-4 bg-brand-50 rounded-xl border-0 focus:ring-2 focus:ring-accent-400 outline-none transition text-brand-900 placeholder:text-brand-400"
                  />
                </div>
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="w-full px-5 py-4 bg-brand-50 rounded-xl border-0 focus:ring-2 focus:ring-accent-400 outline-none transition text-brand-900 placeholder:text-brand-400"
                />
                <input 
                  type="tel" 
                  placeholder="Phone Number" 
                  className="w-full px-5 py-4 bg-brand-50 rounded-xl border-0 focus:ring-2 focus:ring-accent-400 outline-none transition text-brand-900 placeholder:text-brand-400"
                />
                <select 
                  className="w-full px-5 py-4 bg-brand-50 rounded-xl border-0 focus:ring-2 focus:ring-accent-400 outline-none transition text-brand-500"
                >
                  <option value="">I&apos;m looking to...</option>
                  <option value="buy-home">Buy a Home</option>
                  <option value="sell-home">Sell a Home</option>
                  <option value="invest">Invest in Property</option>
                  <option value="commercial">Commercial Real Estate</option>
                  <option value="buy-business">Buy a Business</option>
                  <option value="sell-business">Sell a Business</option>
                </select>
                <textarea 
                  placeholder="Tell me about your goals..." 
                  rows={4}
                  className="w-full px-5 py-4 bg-brand-50 rounded-xl border-0 focus:ring-2 focus:ring-accent-400 outline-none transition resize-none text-brand-900 placeholder:text-brand-400"
                />
                <Button type="submit" variant="primary" className="w-full">
                  Send Message
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-950 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <span className="text-3xl font-display">
                K8ts<span className="text-accent-400">Estates</span>
              </span>
              <p className="text-brand-400 text-sm mt-2">
                Katherine Minovski, Broker<br />
                RE/MAX Your Community Realty
              </p>
            </div>
            
            <div className="flex items-center gap-8 text-sm text-brand-400">
              <a href="#services" className="hover:text-white transition">Services</a>
              <a href="#about" className="hover:text-white transition">About</a>
              <a href="#contact" className="hover:text-white transition">Contact</a>
            </div>
            
            <div className="text-sm text-brand-500 text-center md:text-right">
              <p>© {new Date().getFullYear()} K8ts Estates</p>
              <p className="mt-1">Serving Southern Ontario</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
