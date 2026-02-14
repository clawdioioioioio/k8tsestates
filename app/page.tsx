import { Header } from "@/components/Header";
import { ContactForm } from "@/components/ContactForm";
import Image from "next/image";
import { 
  Building2, Home, Briefcase, Phone, Mail, MapPin, ArrowRight, 
  CheckCircle2
} from "lucide-react";

export default function HomePage() {
  return (
    <>
      <Header />
      
      <main>
        {/* ═══════════════ HERO ═══════════════ */}
        <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden" aria-label="Hero">
          {/* Subtle background elements */}
          <div className="absolute inset-0 bg-base-warm" aria-hidden="true" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" aria-hidden="true" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold-300/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" aria-hidden="true" />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Content - 7 cols */}
              <div className="lg:col-span-7 max-w-2xl">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-brand-100 mb-8">
                  <div className="w-2 h-2 bg-accent-500 rounded-full" aria-hidden="true" />
                  <span className="text-sm font-medium text-brand-600">Licensed Broker • RE/MAX</span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-brand-900 mb-6 tracking-tight text-balance">
                  Real estate,{" "}
                  <span className="relative">
                    <span className="text-gradient">reimagined</span>
                    <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none" aria-hidden="true">
                      <path d="M1 5.5C40 2 80 1 100 3C120 5 160 6 199 2.5" stroke="url(#underline-grad)" strokeWidth="2.5" strokeLinecap="round"/>
                      <defs><linearGradient id="underline-grad" x1="0" y1="0" x2="200" y2="0"><stop stopColor="#14B8A6"/><stop offset="1" stopColor="#2DD4BF"/></linearGradient></defs>
                    </svg>
                  </span>
                </h1>
                
                <p className="text-lg sm:text-xl text-brand-600 mb-10 leading-relaxed max-w-xl text-pretty">
                  Corporate-level strategy meets personal attention. Residential, commercial, 
                  and business brokerage for clients who expect more.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                  <a 
                    href="#contact"
                    className="inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-brand-900 text-white font-semibold rounded-full hover:bg-brand-800 transition-colors btn-hover text-base"
                  >
                    Get in Touch
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <a 
                    href="tel:+14168167850"
                    className="inline-flex items-center justify-center gap-2.5 px-7 py-4 text-brand-700 font-semibold rounded-full border-2 border-brand-200 hover:border-brand-300 hover:bg-white transition-colors text-base"
                  >
                    <Phone className="h-4 w-4" />
                    (416) 816-7850
                  </a>
                </div>
              </div>
              
              {/* Photo - 5 cols */}
              <div className="lg:col-span-5 relative hidden lg:block">
                <div className="relative">
                  {/* Decorative shape behind photo */}
                  <div className="absolute -inset-4 bg-gradient-to-br from-accent-200/50 to-gold-300/30 rounded-3xl rotate-2" aria-hidden="true" />
                  
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl shadow-brand-900/10">
                    <Image
                      src="/images/katherine-minovski.jpg"
                      alt="Katherine Minovski - Broker"
                      fill
                      sizes="(max-width: 1024px) 0px, 40vw"
                      className="object-cover"
                      priority
                    />
                  </div>
                  
                  {/* Floating card */}
                  <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-5 shadow-xl shadow-brand-900/8 border border-brand-100/50">
                    <p className="font-bold text-brand-900 text-lg">Katherine Minovski</p>
                    <p className="text-brand-600 text-sm">Broker • RE/MAX Your Community Realty</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ SERVICES ═══════════════ */}
        <section id="services" className="py-24 lg:py-32 bg-base" aria-label="Services">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section header */}
            <div className="max-w-2xl mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-50 rounded-full mb-4">
                <span className="text-accent-600 text-sm font-semibold">What I Do</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-900 mb-5 text-balance">
                Three pillars of expertise
              </h2>
              <p className="text-lg text-brand-600 leading-relaxed text-pretty">
                Whether you&apos;re buying your first home, acquiring a commercial property, 
                or selling a business — I bring the same strategic rigor to every engagement.
              </p>
            </div>
            
            {/* Services cards */}
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {/* Residential */}
              <div className="group bg-white rounded-2xl p-8 lg:p-10 border border-brand-100 hover-lift relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent-50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" aria-hidden="true" />
                <div className="relative">
                  <div className="w-14 h-14 bg-accent-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent-100 transition-colors">
                    <Home className="h-7 w-7 text-accent-600" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-brand-900 mb-3">Residential</h3>
                  <p className="text-brand-600 mb-8 leading-relaxed">
                    Thoughtful guidance for your most important investment. From first-time buyers to luxury estates.
                  </p>
                  
                  <ul className="space-y-3">
                    {["Buyer & Seller Representation", "Investment Properties", "Luxury Homes", "Leasing"].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-brand-700 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-accent-500 flex-shrink-0" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Commercial */}
              <div className="group bg-white rounded-2xl p-8 lg:p-10 border border-brand-100 hover-lift relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold-300/20 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" aria-hidden="true" />
                <div className="relative">
                  <div className="w-14 h-14 bg-gold-400/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gold-400/20 transition-colors">
                    <Building2 className="h-7 w-7 text-gold-600" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-brand-900 mb-3">Commercial</h3>
                  <p className="text-brand-600 mb-8 leading-relaxed">
                    Data-driven analysis and strategic positioning for commercial acquisitions and dispositions.
                  </p>
                  
                  <ul className="space-y-3">
                    {["Investment Analysis", "Retail & Office", "Industrial & Multi-Family", "Commercial Leasing"].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-brand-700 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-gold-500 flex-shrink-0" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Business Sales */}
              <div className="group bg-white rounded-2xl p-8 lg:p-10 border border-brand-100 hover-lift relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" aria-hidden="true" />
                <div className="relative">
                  <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-100 transition-colors">
                    <Briefcase className="h-7 w-7 text-brand-700" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-brand-900 mb-3">Business Sales</h3>
                  <p className="text-brand-600 mb-8 leading-relaxed">
                    Full transaction lifecycle management — from valuation to close — with institutional precision.
                  </p>
                  
                  <ul className="space-y-3">
                    {["Business Valuations", "Buyer Representation", "Seller Representation", "Deal Structuring"].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-brand-700 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-brand-600 flex-shrink-0" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ ABOUT ═══════════════ */}
        <section id="about" className="py-24 lg:py-32 bg-white" aria-label="About Katherine">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Photo side */}
              <div className="relative order-2 lg:order-1">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                  <Image
                    src="/images/katherine-minovski.jpg"
                    alt="Katherine Minovski"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                {/* Experience badge */}
                <div className="absolute -bottom-4 -right-4 sm:bottom-8 sm:-right-4 bg-brand-900 text-white rounded-2xl p-5 shadow-xl">
                  <div className="text-3xl font-bold">10+</div>
                  <div className="text-brand-300 text-sm">Years in<br/>Real Estate</div>
                </div>
              </div>
              
              {/* Content */}
              <div className="order-1 lg:order-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-50 rounded-full mb-4">
                  <span className="text-accent-600 text-sm font-semibold">About Katherine</span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-900 mb-6 text-balance">
                  Complexity,<br/>
                  <span className="text-brand-500">driven by results.</span>
                </h2>
                
                <div className="space-y-5 text-brand-700 leading-relaxed text-base max-w-prose">
                  <p className="text-pretty">
                    Before real estate, Katherine spent years in the corporate trenches — closing 
                    7-figure deals and exceeding 8-figure targets at Fortune 500 companies.
                  </p>
                  <p className="text-pretty">
                    As <strong className="text-brand-900">VP of Sales & Product Development at Vertical Scope</strong>, 
                    she managed teams internationally and negotiated the sale of an equity position to Torstar Corporation.
                  </p>
                  <p className="text-pretty">
                    As <strong className="text-brand-900">COO & VP Business Development at Bassett Media Group</strong>, 
                    she played a pivotal role in bringing the company public.
                  </p>
                  <p className="text-pretty">
                    Since 2016, Katherine has applied that same strategic discipline as a 
                    <strong className="text-brand-900"> licensed RE/MAX broker</strong> — serving clients 
                    across residential, commercial, and business sales with a level of rigor 
                    most agents simply can&apos;t match.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ CONTACT ═══════════════ */}
        <section id="contact" className="py-24 lg:py-32 bg-base" aria-label="Contact">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
              {/* Info */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-50 rounded-full mb-4">
                  <span className="text-accent-600 text-sm font-semibold">Get in Touch</span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-900 mb-6 text-balance">
                  Let&apos;s start a conversation
                </h2>
                <p className="text-lg text-brand-600 mb-10 leading-relaxed text-pretty">
                  Serving the greater Toronto area — Vaughan, Markham, Richmond Hill, 
                  and beyond. Available for in-person meetings, phone, or video calls.
                </p>
                
                <div className="space-y-5">
                  <a href="tel:+14168167850" className="flex items-center gap-4 group p-4 -mx-4 rounded-xl hover:bg-brand-50 transition-colors">
                    <div className="w-12 h-12 bg-accent-50 rounded-xl flex items-center justify-center group-hover:bg-accent-100 transition-colors">
                      <Phone className="h-5 w-5 text-accent-600" />
                    </div>
                    <div>
                      <div className="text-sm text-brand-600 font-medium">Phone</div>
                      <div className="text-brand-900 font-semibold text-lg">(416) 816-7850</div>
                    </div>
                  </a>
                  
                  <a href="mailto:kminovski@gmail.com" className="flex items-center gap-4 group p-4 -mx-4 rounded-xl hover:bg-brand-50 transition-colors">
                    <div className="w-12 h-12 bg-accent-50 rounded-xl flex items-center justify-center group-hover:bg-accent-100 transition-colors">
                      <Mail className="h-5 w-5 text-accent-600" />
                    </div>
                    <div>
                      <div className="text-sm text-brand-600 font-medium">Email</div>
                      <div className="text-brand-900 font-semibold text-lg">kminovski@gmail.com</div>
                    </div>
                  </a>
                  
                  <div className="flex items-center gap-4 p-4 -mx-4">
                    <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-brand-700" />
                    </div>
                    <div>
                      <div className="text-sm text-brand-600 font-medium">Office</div>
                      <div className="text-brand-900 font-semibold">RE/MAX Your Community Realty</div>
                      <div className="text-sm text-brand-600">161 Main Street, Unionville, ON</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Form */}
              <div className="bg-brand-50 rounded-2xl p-8 lg:p-10">
                <h3 className="text-xl font-bold text-brand-900 mb-1">Send a message</h3>
                <p className="text-brand-600 mb-8 text-sm">I typically respond within a few hours.</p>
                
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="bg-brand-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <span className="text-white font-bold text-base">K8</span>
                </div>
                <span className="font-bold text-lg">Estates</span>
              </div>
              <p className="text-brand-400 text-sm leading-relaxed">
                Modern real estate and business brokerage. Corporate strategy meets personal service.
              </p>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-sm mb-4 text-brand-200">Navigate</h4>
              <div className="space-y-1">
                {[
                  { label: "Services", href: "#services" },
                  { label: "About", href: "#about" },
                  { label: "Blog", href: "/blog" },
                  { label: "Contact", href: "#contact" },
                ].map((item) => (
                  <a key={item.label} href={item.href} className="block text-brand-400 hover:text-white transition-colors text-sm py-2">
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
            
            {/* Services */}
            <div>
              <h4 className="font-semibold text-sm mb-4 text-brand-200">Services</h4>
              <div className="space-y-1">
                {["Residential", "Commercial", "Business Sales", "Leasing"].map((item) => (
                  <a key={item} href="#services" className="block text-brand-400 hover:text-white transition-colors text-sm py-2">
                    {item}
                  </a>
                ))}
              </div>
            </div>
            
            {/* Contact */}
            <div>
              <h4 className="font-semibold text-sm mb-4 text-brand-200">Contact</h4>
              <div className="space-y-1 text-brand-400 text-sm">
                <a href="tel:+14168167850" className="block hover:text-white transition-colors py-2">(416) 816-7850</a>
                <a href="mailto:kminovski@gmail.com" className="block hover:text-white transition-colors py-2">kminovski@gmail.com</a>
                <p className="py-2">161 Main Street<br/>Unionville, ON</p>
              </div>
              {/* Social Links */}
              <div className="flex gap-3 mt-4">
                <a href="https://x.com/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="X (Twitter)">
                  <svg className="h-4 w-4 text-brand-300" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Instagram">
                  <svg className="h-4 w-4 text-brand-300" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg>
                </a>
                <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Facebook">
                  <svg className="h-4 w-4 text-brand-300" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="https://tiktok.com/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="TikTok">
                  <svg className="h-4 w-4 text-brand-300" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-brand-500">
              © {new Date().getFullYear()} K8ts Estates. All rights reserved.
            </p>
            <p className="text-xs text-brand-600">
              RE/MAX Your Community Realty, Brokerage
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
