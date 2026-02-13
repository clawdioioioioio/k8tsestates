import { Header } from "@/components/Header";
import Image from "next/image";
import { 
  Building2, 
  Home, 
  Briefcase, 
  Award, 
  Phone,
  Mail,
  MapPin,
  ArrowUpRight,
  Sparkles,
  Shield,
  LineChart,
  Brain,
  Lock,
  FileCheck,
  MessageSquare,
  Play,
  Zap,
  Target,
  TrendingUp
} from "lucide-react";

export default function HomePage() {
  return (
    <>
      <Header />
      
      {/* Hero - Bold, Energetic */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-animated" />
        
        {/* Floating orbs */}
        <div className="absolute top-20 right-[20%] w-72 h-72 bg-accent-400/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-[10%] w-96 h-96 bg-gold-400/10 rounded-full blur-3xl animate-float animation-delay-300" />
        
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), 
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Left - Content */}
            <div className="lg:col-span-7">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8 animate-slide-up">
                <span className="w-2 h-2 bg-accent-400 rounded-full animate-pulse-glow" />
                <span className="text-sm font-medium text-white/90">AI-Powered Real Estate</span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white mb-6 animate-slide-up animation-delay-100" style={{ opacity: 0, animationFillMode: 'forwards' }}>
                Real Estate,
                <br />
                <span className="text-gradient inline-block">Reimagined.</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-white/70 mb-10 max-w-xl leading-relaxed animate-slide-up animation-delay-200" style={{ opacity: 0, animationFillMode: 'forwards' }}>
                Combining institutional expertise with cutting-edge AI to deliver 
                <span className="text-accent-400 font-semibold"> exceptional outcomes</span> for 
                discerning clients in Southern Ontario.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-slide-up animation-delay-300" style={{ opacity: 0, animationFillMode: 'forwards' }}>
                <a 
                  href="#contact"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-accent-400 text-brand-900 font-bold text-lg rounded-2xl hover:bg-accent-300 transition-all btn-magnetic glow-cyan"
                >
                  Start Your Journey
                  <ArrowUpRight className="h-5 w-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
                <a 
                  href="#services"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/10 text-white font-semibold text-lg rounded-2xl border border-white/20 hover:bg-white/20 transition-all"
                >
                  <Play className="h-5 w-5" />
                  See How It Works
                </a>
              </div>
              
              {/* Trust indicators */}
              <div className="flex flex-wrap items-center gap-6 text-white/60 text-sm animate-slide-up animation-delay-400" style={{ opacity: 0, animationFillMode: 'forwards' }}>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-accent-400" />
                  <span>Licensed Broker</span>
                </div>
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-accent-400" />
                  <span>AI-Enhanced</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-gold-400" />
                  <span>RE/MAX Partner</span>
                </div>
              </div>
            </div>
            
            {/* Right - Photo with floating cards */}
            <div className="lg:col-span-5 relative hidden lg:block">
              <div className="relative">
                {/* Main photo */}
                <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl shadow-black/30 animate-slide-up animation-delay-200" style={{ opacity: 0, animationFillMode: 'forwards' }}>
                  <Image
                    src="https://papiphotos.remax-im.com/Person/102525316/MainPhoto_cropped/MainPhoto_cropped.jpg"
                    alt="Katherine Minovski - Broker"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-900/60 via-transparent to-transparent" />
                  
                  {/* Name badge */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="glass-dark rounded-2xl p-5 border border-white/10">
                      <p className="font-bold text-white text-xl">Katherine Minovski</p>
                      <p className="text-white/60 text-sm">Broker • RE/MAX Your Community</p>
                    </div>
                  </div>
                </div>
                
                {/* Floating stat cards */}
                <div className="absolute -top-4 -right-4 glass rounded-2xl p-4 shadow-xl animate-float animation-delay-100">
                  <div className="text-2xl font-bold text-brand-900">135%</div>
                  <div className="text-xs text-brand-500">Quota Achievement</div>
                </div>
                
                <div className="absolute top-1/3 -left-8 glass rounded-2xl p-4 shadow-xl animate-float animation-delay-300">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-accent-500" />
                    <span className="font-bold text-brand-900">7-Figure</span>
                  </div>
                  <div className="text-xs text-brand-500">Deals Closed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
            <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Bento Grid - What Makes Us Different */}
      <section className="py-24 md:py-32 bg-base relative overflow-hidden">
        <div className="container mx-auto px-6">
          {/* Section header */}
          <div className="max-w-3xl mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-100 text-accent-600 rounded-full text-sm font-semibold mb-6">
              <Zap className="h-4 w-4" />
              The K8ts Difference
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-brand-900 mb-6">
              Not your typical
              <br />
              <span className="text-gradient">brokerage.</span>
            </h2>
            <p className="text-xl text-brand-500 leading-relaxed">
              We combine institutional rigor with cutting-edge technology to deliver 
              results that matter.
            </p>
          </div>
          
          {/* Bento grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Large featured card */}
            <div className="md:col-span-2 lg:col-span-2 lg:row-span-2 group relative bg-brand-900 rounded-3xl p-8 md:p-10 overflow-hidden card-tilt">
              <div className="absolute top-0 right-0 w-80 h-80 bg-accent-400/10 rounded-full blur-3xl" />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-accent-400/20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <Brain className="h-8 w-8 text-accent-400" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">AI-Powered Intelligence</h3>
                <p className="text-lg text-white/60 leading-relaxed max-w-lg mb-8">
                  Predictive pricing models, market trend analysis, and personalized 
                  recommendations powered by machine learning — giving you an edge 
                  in every negotiation.
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-accent-400">98%</div>
                    <div className="text-xs text-white/40">Price Accuracy</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-accent-400">24/7</div>
                    <div className="text-xs text-white/40">Market Monitoring</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-accent-400">10x</div>
                    <div className="text-xs text-white/40">Faster Insights</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Smaller cards */}
            <div className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 border border-brand-100 card-tilt">
              <div className="w-14 h-14 bg-gold-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="h-7 w-7 text-gold-500" />
              </div>
              <h3 className="text-xl font-bold text-brand-900 mb-3">White Glove Service</h3>
              <p className="text-brand-500 leading-relaxed">
                Bespoke attention at every step. Your journey is unique — your experience should be too.
              </p>
            </div>
            
            <div className="group bg-gradient-to-br from-accent-400 to-accent-500 rounded-3xl p-8 card-tilt glow-cyan">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <LineChart className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Data-Driven Strategy</h3>
              <p className="text-white/80 leading-relaxed">
                Investment calculators, demographic insights, and market intelligence for informed decisions.
              </p>
            </div>
            
            <div className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 border border-brand-100 card-tilt">
              <div className="w-14 h-14 bg-brand-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Lock className="h-7 w-7 text-brand-600" />
              </div>
              <h3 className="text-xl font-bold text-brand-900 mb-3">Full Transparency</h3>
              <p className="text-brand-500 leading-relaxed">
                Real-time tracking, secure documents, and clear communication. Always know where you stand.
              </p>
            </div>
            
            <div className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 border border-brand-100 card-tilt">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Target className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-brand-900 mb-3">Results Obsessed</h3>
              <p className="text-brand-500 leading-relaxed">
                135% quota achievement. 7-figure deals closed. We don&apos;t just meet expectations — we exceed them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services - Modern Cards */}
      <section id="services" className="py-24 md:py-32 bg-brand-900 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(34, 211, 238, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 80% 50%, rgba(251, 191, 36, 0.08) 0%, transparent 50%)`
        }} />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-accent-400 rounded-full text-sm font-semibold mb-6 border border-white/10">
              <Building2 className="h-4 w-4" />
              Services
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6">
              Multi-sector expertise.
              <br />
              <span className="text-gradient">Single point of trust.</span>
            </h2>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Residential */}
            <div className="group relative bg-white/5 backdrop-blur-sm rounded-3xl p-8 md:p-10 border border-white/10 hover:border-accent-400/50 transition-all duration-500 hover-scale">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-400 to-accent-500 rounded-t-3xl scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              
              <div className="w-16 h-16 bg-accent-400/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-accent-400/20 transition-colors">
                <Home className="h-8 w-8 text-accent-400" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4">Residential</h3>
              <p className="text-white/60 mb-8 leading-relaxed">
                From first homes to legacy estates. Lifestyle-focused guidance that goes 
                beyond square footage.
              </p>
              
              <div className="space-y-3">
                {["Buyer Representation", "Seller Representation", "Investment Properties", "Leasing"].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-white/70 text-sm">
                    <div className="w-1.5 h-1.5 bg-accent-400 rounded-full" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Commercial */}
            <div className="group relative bg-white/5 backdrop-blur-sm rounded-3xl p-8 md:p-10 border border-white/10 hover:border-gold-400/50 transition-all duration-500 hover-scale">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-400 to-gold-500 rounded-t-3xl scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              
              <div className="w-16 h-16 bg-gold-400/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-gold-400/20 transition-colors">
                <Building2 className="h-8 w-8 text-gold-400" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4">Commercial</h3>
              <p className="text-white/60 mb-8 leading-relaxed">
                Data-driven acquisitions and dispositions. Cap rate analysis and 
                strategic positioning.
              </p>
              
              <div className="space-y-3">
                {["Investment Analysis", "Retail & Office", "Industrial & Multi-Family", "Commercial Leasing"].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-white/70 text-sm">
                    <div className="w-1.5 h-1.5 bg-gold-400 rounded-full" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Business */}
            <div className="group relative bg-white/5 backdrop-blur-sm rounded-3xl p-8 md:p-10 border border-white/10 hover:border-accent-400/50 transition-all duration-500 hover-scale">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-400 via-gold-400 to-accent-500 rounded-t-3xl scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              
              <div className="w-16 h-16 bg-gradient-to-br from-accent-400/10 to-gold-400/10 rounded-2xl flex items-center justify-center mb-8 group-hover:from-accent-400/20 group-hover:to-gold-400/20 transition-colors">
                <Briefcase className="h-8 w-8 text-accent-400" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4">Business Advisory</h3>
              <p className="text-white/60 mb-8 leading-relaxed">
                Complete transaction lifecycle for business sales. Valuations, deal 
                structuring, and negotiation.
              </p>
              
              <div className="space-y-3">
                {["Business Valuations", "Buyer Representation", "Seller Representation", "Deal Structuring"].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-white/70 text-sm">
                    <div className="w-1.5 h-1.5 bg-accent-400 rounded-full" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About - Asymmetric Layout */}
      <section id="about" className="py-24 md:py-32 bg-base relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left - Photo stack */}
            <div className="lg:col-span-5 relative">
              <div className="relative">
                {/* Main photo */}
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src="https://papiphotos.remax-im.com/Person/102525316/MainPhoto_cropped/MainPhoto_cropped.jpg"
                    alt="Katherine Minovski"
                    fill
                    className="object-cover"
                  />
                </div>
                
                {/* Quote card */}
                <div className="absolute -bottom-6 -right-6 md:-right-12 left-8 bg-brand-900 text-white p-6 md:p-8 rounded-2xl shadow-2xl">
                  <p className="text-lg md:text-xl font-semibold leading-relaxed mb-4">
                    &ldquo;Complex transactions require someone who&apos;s been in the arena.&rdquo;
                  </p>
                  <p className="text-accent-400 font-medium">— Katherine Minovski</p>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-accent-400/20 rounded-full blur-2xl" />
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gold-400/20 rounded-full blur-2xl" />
              </div>
            </div>
            
            {/* Right - Content */}
            <div className="lg:col-span-7 lg:pl-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-100 text-brand-600 rounded-full text-sm font-semibold mb-6">
                <Award className="h-4 w-4" />
                Your Guide
              </div>
              
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-brand-900 mb-8">
                Built for
                <br />
                <span className="text-gradient">complexity.</span>
              </h2>
              
              <div className="space-y-6 text-lg text-brand-600 leading-relaxed mb-10">
                <p>
                  Before real estate, Katherine spent over a decade at the highest levels 
                  of enterprise sales — serving as <strong className="text-brand-900">VP of Sales and VP of Product Development</strong>, 
                  closing seven-figure deals with Fortune 500 clients.
                </p>
                <p>
                  She didn&apos;t just meet targets — she consistently exceeded them. 
                  <span className="text-accent-600 font-semibold"> 20-28% growth</span> in 
                  an industry averaging 14-17%. <span className="text-accent-600 font-semibold">135% of quota</span> on 
                  eight-figure targets.
                </p>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-10">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-brand-100 text-center hover-scale">
                  <div className="text-3xl md:text-4xl font-bold text-accent-500">135%</div>
                  <div className="text-sm text-brand-500 mt-1">Quota</div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-brand-100 text-center hover-scale">
                  <div className="text-3xl md:text-4xl font-bold text-gold-500">30+</div>
                  <div className="text-sm text-brand-500 mt-1">Partners</div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-brand-100 text-center hover-scale">
                  <div className="text-3xl md:text-4xl font-bold text-brand-900">7-Fig</div>
                  <div className="text-sm text-brand-500 mt-1">Deals</div>
                </div>
              </div>
              
              <a 
                href="#contact"
                className="inline-flex items-center gap-2 text-brand-900 font-bold hover:text-accent-600 transition-colors group"
              >
                Work with Katherine
                <ArrowUpRight className="h-5 w-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Client Portal Preview - Split */}
      <section className="py-24 md:py-32 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-100 text-accent-600 rounded-full text-sm font-semibold mb-6">
                <FileCheck className="h-4 w-4" />
                Client Experience
              </div>
              
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-brand-900 mb-6">
                Transparency
                <br />
                <span className="text-gradient">built in.</span>
              </h2>
              
              <p className="text-xl text-brand-500 mb-10 leading-relaxed">
                From initial consultation to closing day, you&apos;ll never wonder 
                where things stand. Real-time visibility into your entire journey.
              </p>
              
              <div className="space-y-6">
                {[
                  { icon: FileCheck, title: "Transaction Tracking", desc: "Live progress updates on every milestone." },
                  { icon: Lock, title: "Secure Document Vault", desc: "All contracts in one encrypted location." },
                  { icon: MessageSquare, title: "Direct Communication", desc: "No phone tag. No delays. Just answers." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-accent-100 transition-colors">
                      <item.icon className="h-6 w-6 text-brand-600 group-hover:text-accent-600 transition-colors" />
                    </div>
                    <div>
                      <h4 className="font-bold text-brand-900 mb-1">{item.title}</h4>
                      <p className="text-brand-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Portal mockup */}
            <div className="relative">
              <div className="relative bg-brand-900 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <div className="ml-4 flex-1 h-6 bg-brand-800 rounded-lg" />
                </div>
                
                <div className="space-y-4">
                  {/* Progress */}
                  <div className="bg-brand-800/80 rounded-2xl p-5">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-white/60">Transaction Progress</span>
                      <span className="text-sm font-bold text-accent-400">75%</span>
                    </div>
                    <div className="h-2 bg-brand-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-accent-400 to-accent-500 rounded-full" style={{ width: '75%' }} />
                    </div>
                  </div>
                  
                  {/* Cards grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-brand-800/80 rounded-2xl p-5">
                      <div className="text-xs text-white/40 mb-1">Next Milestone</div>
                      <div className="text-white font-bold">Home Inspection</div>
                      <div className="text-xs text-accent-400 mt-1">Feb 15, 2026</div>
                    </div>
                    <div className="bg-brand-800/80 rounded-2xl p-5">
                      <div className="text-xs text-white/40 mb-1">Documents</div>
                      <div className="text-white font-bold">12 Files</div>
                      <div className="text-xs text-green-400 mt-1 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                        All signed
                      </div>
                    </div>
                  </div>
                  
                  {/* Activity */}
                  <div className="bg-brand-800/80 rounded-2xl p-5">
                    <div className="text-xs text-white/40 mb-3">Recent Activity</div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/80">Offer accepted</span>
                        <span className="text-white/40">2d ago</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/80">Mortgage pre-approval</span>
                        <span className="text-white/40">5d ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative glow */}
              <div className="absolute -z-10 -inset-4 bg-gradient-to-r from-accent-400/20 to-gold-400/20 rounded-3xl blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Bold */}
      <section className="py-24 md:py-32 bg-brand-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-animated opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-400/20 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-8">
              Ready to work with
              <br />
              <span className="text-gradient">a true partner?</span>
            </h2>
            <p className="text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed">
              Let&apos;s have a conversation about your goals. No pressure — 
              just a chance to see if we&apos;re the right fit.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="tel:+14168167850"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-accent-400 text-brand-900 font-bold text-lg rounded-2xl hover:bg-accent-300 transition-all btn-magnetic glow-cyan"
              >
                <Phone className="h-5 w-5" />
                (416) 816-7850
              </a>
              <a 
                href="#contact"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/10 text-white font-semibold text-lg rounded-2xl border border-white/20 hover:bg-white/20 transition-all"
              >
                <Mail className="h-5 w-5" />
                Send Message
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact - Clean */}
      <section id="contact" className="py-24 md:py-32 bg-base">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-100 text-brand-600 rounded-full text-sm font-semibold mb-6">
                <Mail className="h-4 w-4" />
                Contact
              </div>
              
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-brand-900 mb-6">
                Let&apos;s start a
                <br />
                <span className="text-gradient">conversation.</span>
              </h2>
              
              <p className="text-xl text-brand-500 mb-10 leading-relaxed">
                Serving Southern Ontario — Toronto, Vaughan, Markham, and the greater GTA. 
                Available in-person, by phone, or video call.
              </p>
              
              <div className="space-y-6">
                <a href="tel:+14168167850" className="flex items-center gap-4 group">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-lg group-hover:scale-105 transition-all">
                    <Phone className="h-6 w-6 text-brand-600" />
                  </div>
                  <div>
                    <div className="text-sm text-brand-400">Phone</div>
                    <div className="text-lg text-brand-900 font-bold">(416) 816-7850</div>
                  </div>
                </a>
                
                <a href="mailto:kminovski@gmail.com" className="flex items-center gap-4 group">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-lg group-hover:scale-105 transition-all">
                    <Mail className="h-6 w-6 text-brand-600" />
                  </div>
                  <div>
                    <div className="text-sm text-brand-400">Email</div>
                    <div className="text-lg text-brand-900 font-bold">kminovski@gmail.com</div>
                  </div>
                </a>
                
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                    <MapPin className="h-6 w-6 text-brand-600" />
                  </div>
                  <div>
                    <div className="text-sm text-brand-400">Office</div>
                    <div className="text-brand-900 font-bold">RE/MAX Your Community Realty</div>
                    <div className="text-sm text-brand-500">161 Main Street, Unionville, ON</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Form */}
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-brand-100">
              <h3 className="text-2xl font-bold text-brand-900 mb-2">Send a Message</h3>
              <p className="text-brand-500 mb-8">Typically respond within a few hours.</p>
              
              <form className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <input 
                    type="text" 
                    placeholder="First Name" 
                    className="w-full px-5 py-4 bg-brand-50 rounded-xl border-2 border-transparent focus:border-accent-400 focus:bg-white outline-none transition text-brand-900 placeholder:text-brand-400"
                  />
                  <input 
                    type="text" 
                    placeholder="Last Name" 
                    className="w-full px-5 py-4 bg-brand-50 rounded-xl border-2 border-transparent focus:border-accent-400 focus:bg-white outline-none transition text-brand-900 placeholder:text-brand-400"
                  />
                </div>
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="w-full px-5 py-4 bg-brand-50 rounded-xl border-2 border-transparent focus:border-accent-400 focus:bg-white outline-none transition text-brand-900 placeholder:text-brand-400"
                />
                <input 
                  type="tel" 
                  placeholder="Phone Number" 
                  className="w-full px-5 py-4 bg-brand-50 rounded-xl border-2 border-transparent focus:border-accent-400 focus:bg-white outline-none transition text-brand-900 placeholder:text-brand-400"
                />
                <select 
                  className="w-full px-5 py-4 bg-brand-50 rounded-xl border-2 border-transparent focus:border-accent-400 focus:bg-white outline-none transition text-brand-500"
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
                  className="w-full px-5 py-4 bg-brand-50 rounded-xl border-2 border-transparent focus:border-accent-400 focus:bg-white outline-none transition resize-none text-brand-900 placeholder:text-brand-400"
                />
                <button 
                  type="submit" 
                  className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-900 text-white font-bold text-lg rounded-xl hover:bg-brand-800 transition-all btn-magnetic"
                >
                  Send Message
                  <ArrowUpRight className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-950 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-400 to-accent-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">K8</span>
              </div>
              <div>
                <span className="text-xl font-bold">Estates</span>
                <p className="text-brand-500 text-sm">Katherine Minovski, Broker</p>
              </div>
            </div>
            
            <div className="flex items-center gap-8 text-sm text-brand-400">
              <a href="#services" className="hover:text-white transition">Services</a>
              <a href="#about" className="hover:text-white transition">About</a>
              <a href="#contact" className="hover:text-white transition">Contact</a>
            </div>
            
            <div className="text-sm text-brand-500 text-center md:text-right">
              <p>© {new Date().getFullYear()} K8ts Estates</p>
              <p className="mt-1">RE/MAX Your Community Realty</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
