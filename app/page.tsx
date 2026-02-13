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
  ArrowRight,
  Shield,
  LineChart,
  Users,
  FileText,
  CheckCircle2,
  ChevronRight
} from "lucide-react";

export default function HomePage() {
  return (
    <>
      <Header />
      
      {/* Hero - Clean & Professional */}
      <section className="relative min-h-[90vh] flex items-center pt-20 bg-brand-900">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Content */}
            <div className="max-w-xl">
              <p className="text-accent-400 font-medium mb-4 animate-fade-in">
                Real Estate • Business Sales • Commercial
              </p>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white mb-6 animate-fade-in delay-100" style={{ opacity: 0 }}>
                Experience that delivers{" "}
                <span className="text-accent-400">results.</span>
              </h1>
              
              <p className="text-lg text-brand-300 mb-8 leading-relaxed animate-fade-in delay-200" style={{ opacity: 0 }}>
                Combining institutional expertise with personalized service for 
                discerning clients across Southern Ontario. Residential, commercial, 
                and business sales.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in delay-300" style={{ opacity: 0 }}>
                <a 
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-brand-900 font-medium rounded-lg hover:bg-brand-100 transition-colors"
                >
                  Schedule a Consultation
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a 
                  href="tel:+14168167850"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-white font-medium rounded-lg border border-brand-700 hover:bg-brand-800 transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  (416) 816-7850
                </a>
              </div>
            </div>
            
            {/* Photo - Clean, no floating cards */}
            <div className="relative hidden lg:block">
              <div className="relative aspect-[4/5] max-w-md ml-auto rounded-2xl overflow-hidden shadow-2xl shadow-black/20">
                <Image
                  src="https://papiphotos.remax-im.com/Person/102525316/MainPhoto_cropped/MainPhoto_cropped.jpg"
                  alt="Katherine Minovski - Broker"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              
              {/* Simple name badge at bottom */}
              <div className="absolute -bottom-6 left-8 right-8 bg-white rounded-xl p-5 shadow-lg">
                <p className="font-semibold text-brand-900 text-lg">Katherine Minovski</p>
                <p className="text-brand-500 text-sm">Broker • RE/MAX Your Community Realty</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar - Simple - Force redeploy v2 */}
      <section className="py-8 bg-white border-b border-brand-100">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16 text-brand-500 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-accent-500" />
              <span>Licensed Broker</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-gold-500" />
              <span>RE/MAX Partner</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-brand-400" />
              <span>Fortune 500 Experience</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-accent-500" />
              <span>Trusted Advisor</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services - Clean Grid */}
      <section id="services" className="py-20 lg:py-28 bg-base">
        <div className="container mx-auto px-6 lg:px-8">
          {/* Section header */}
          <div className="max-w-2xl mb-16">
            <p className="text-accent-500 font-medium mb-3">Services</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-brand-900 mb-4">
              Comprehensive real estate expertise
            </h2>
            <p className="text-lg text-brand-500 leading-relaxed">
              Full-service representation across residential, commercial, and business sectors 
              with the analytical rigor of institutional experience.
            </p>
          </div>
          
          {/* Services grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Residential */}
            <div className="group bg-white rounded-xl p-8 border border-brand-100 hover-lift">
              <div className="w-12 h-12 bg-accent-500/10 rounded-lg flex items-center justify-center mb-6">
                <Home className="h-6 w-6 text-accent-500" />
              </div>
              
              <h3 className="text-xl font-semibold text-brand-900 mb-3">Residential</h3>
              <p className="text-brand-500 mb-6 leading-relaxed">
                From first homes to luxury estates. Thoughtful guidance that goes 
                beyond the transaction.
              </p>
              
              <ul className="space-y-2.5">
                {["Buyer Representation", "Seller Representation", "Investment Properties", "Leasing"].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-brand-600 text-sm">
                    <ChevronRight className="h-4 w-4 text-accent-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Commercial */}
            <div className="group bg-white rounded-xl p-8 border border-brand-100 hover-lift">
              <div className="w-12 h-12 bg-gold-500/10 rounded-lg flex items-center justify-center mb-6">
                <Building2 className="h-6 w-6 text-gold-500" />
              </div>
              
              <h3 className="text-xl font-semibold text-brand-900 mb-3">Commercial</h3>
              <p className="text-brand-500 mb-6 leading-relaxed">
                Data-driven acquisitions and dispositions with rigorous analysis 
                and strategic positioning.
              </p>
              
              <ul className="space-y-2.5">
                {["Investment Analysis", "Retail & Office", "Industrial & Multi-Family", "Commercial Leasing"].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-brand-600 text-sm">
                    <ChevronRight className="h-4 w-4 text-gold-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Business */}
            <div className="group bg-white rounded-xl p-8 border border-brand-100 hover-lift">
              <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center mb-6">
                <Briefcase className="h-6 w-6 text-brand-600" />
              </div>
              
              <h3 className="text-xl font-semibold text-brand-900 mb-3">Business Sales</h3>
              <p className="text-brand-500 mb-6 leading-relaxed">
                Complete transaction lifecycle for business sales with valuations 
                and deal structuring.
              </p>
              
              <ul className="space-y-2.5">
                {["Business Valuations", "Buyer Representation", "Seller Representation", "Deal Structuring"].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-brand-600 text-sm">
                    <ChevronRight className="h-4 w-4 text-brand-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* About - Professional Layout */}
      <section id="about" className="py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Photo */}
            <div className="relative order-2 lg:order-1">
              <div className="relative aspect-[4/5] rounded-xl overflow-hidden">
                <Image
                  src="https://papiphotos.remax-im.com/Person/102525316/MainPhoto_cropped/MainPhoto_cropped.jpg"
                  alt="Katherine Minovski"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            
            {/* Content */}
            <div className="order-1 lg:order-2">
              <p className="text-accent-500 font-medium mb-3">About</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-brand-900 mb-6">
                Built for complexity
              </h2>
              
              <div className="space-y-5 text-brand-600 leading-relaxed mb-10">
                <p>
                  <strong className="text-brand-900">VP of Sales and VP of Product Development at Vertical Scope.</strong> Negotiated 
                  the sale of an equity position to Torstar Corporation.
                </p>
                <p>
                  <strong className="text-brand-900">COO & VP Business Development at Bassett Media Group.</strong> Drove 
                  sales growth for their media network. Played a pivotal role in bringing the company public.
                </p>
                <p>
                  <strong className="text-brand-900">Licensed real estate broker since 2016, RE/MAX.</strong> Applying 
                  the same strategic discipline to residential, commercial, and business sales.
                </p>
                <p>
                  Consistently closed 7-figure deals with Fortune 500 clients across 30+ partnerships. 
                  Track record: <span className="text-accent-600 font-medium">20-28% growth</span> in 
                  an industry averaging 14-17%.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props - Minimal Cards */}
      <section className="py-20 lg:py-28 bg-base">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <p className="text-accent-500 font-medium mb-3">Why K8ts Estates</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-brand-900 mb-4">
              A different approach
            </h2>
            <p className="text-lg text-brand-500">
              Institutional rigor meets personalized attention.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: LineChart, title: "Data-Driven", desc: "Market analytics and investment modeling for informed decisions." },
              { icon: Shield, title: "Full Transparency", desc: "Real-time updates and clear communication at every step." },
              { icon: Users, title: "White Glove Service", desc: "Personalized attention tailored to your unique needs." },
              { icon: FileText, title: "Proven Process", desc: "Structured methodology refined over a decade of complex deals." }
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-brand-100 hover-lift">
                <item.icon className="h-6 w-6 text-accent-500 mb-4" />
                <h3 className="font-semibold text-brand-900 mb-2">{item.title}</h3>
                <p className="text-sm text-brand-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Simple & Professional */}
      <section className="py-20 lg:py-28 bg-brand-900">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-6">
              Ready to discuss your goals?
            </h2>
            <p className="text-lg text-brand-300 mb-10 max-w-xl mx-auto">
              Whether you&apos;re buying, selling, or investing, let&apos;s have a 
              conversation about how I can help.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="tel:+14168167850"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-brand-900 font-medium rounded-lg hover:bg-brand-100 transition-colors"
              >
                <Phone className="h-4 w-4" />
                (416) 816-7850
              </a>
              <a 
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-white font-medium rounded-lg border border-brand-600 hover:bg-brand-800 transition-colors"
              >
                <Mail className="h-4 w-4" />
                Send a Message
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact - Clean Form */}
      <section id="contact" className="py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Info */}
            <div>
              <p className="text-accent-500 font-medium mb-3">Contact</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-brand-900 mb-6">
                Let&apos;s connect
              </h2>
              <p className="text-lg text-brand-500 mb-10 leading-relaxed">
                Serving Southern Ontario — Toronto, Vaughan, Markham, and the greater GTA. 
                Available for in-person meetings, phone, or video consultations.
              </p>
              
              <div className="space-y-6">
                <a href="tel:+14168167850" className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-brand-50 rounded-lg flex items-center justify-center group-hover:bg-accent-50 transition-colors">
                    <Phone className="h-5 w-5 text-brand-600 group-hover:text-accent-600 transition-colors" />
                  </div>
                  <div>
                    <div className="text-sm text-brand-400">Phone</div>
                    <div className="text-brand-900 font-medium">(416) 816-7850</div>
                  </div>
                </a>
                
                <a href="mailto:kminovski@gmail.com" className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-brand-50 rounded-lg flex items-center justify-center group-hover:bg-accent-50 transition-colors">
                    <Mail className="h-5 w-5 text-brand-600 group-hover:text-accent-600 transition-colors" />
                  </div>
                  <div>
                    <div className="text-sm text-brand-400">Email</div>
                    <div className="text-brand-900 font-medium">kminovski@gmail.com</div>
                  </div>
                </a>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-50 rounded-lg flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-brand-600" />
                  </div>
                  <div>
                    <div className="text-sm text-brand-400">Office</div>
                    <div className="text-brand-900 font-medium">RE/MAX Your Community Realty</div>
                    <div className="text-sm text-brand-500">161 Main Street, Unionville, ON</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Form */}
            <div className="bg-brand-50 rounded-xl p-8 lg:p-10">
              <h3 className="text-xl font-semibold text-brand-900 mb-2">Send a message</h3>
              <p className="text-brand-500 mb-8 text-sm">I typically respond within a few hours.</p>
              
              <form className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <input 
                    type="text" 
                    placeholder="First Name" 
                    className="w-full px-4 py-3 bg-white rounded-lg border border-brand-200 focus:border-accent-400 focus:ring-2 focus:ring-accent-100 outline-none transition text-brand-900 placeholder:text-brand-400 text-sm"
                  />
                  <input 
                    type="text" 
                    placeholder="Last Name" 
                    className="w-full px-4 py-3 bg-white rounded-lg border border-brand-200 focus:border-accent-400 focus:ring-2 focus:ring-accent-100 outline-none transition text-brand-900 placeholder:text-brand-400 text-sm"
                  />
                </div>
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="w-full px-4 py-3 bg-white rounded-lg border border-brand-200 focus:border-accent-400 focus:ring-2 focus:ring-accent-100 outline-none transition text-brand-900 placeholder:text-brand-400 text-sm"
                />
                <input 
                  type="tel" 
                  placeholder="Phone Number" 
                  className="w-full px-4 py-3 bg-white rounded-lg border border-brand-200 focus:border-accent-400 focus:ring-2 focus:ring-accent-100 outline-none transition text-brand-900 placeholder:text-brand-400 text-sm"
                />
                <select 
                  className="w-full px-4 py-3 bg-white rounded-lg border border-brand-200 focus:border-accent-400 focus:ring-2 focus:ring-accent-100 outline-none transition text-brand-500 text-sm"
                >
                  <option value="">I&apos;m interested in...</option>
                  <option value="buy-home">Buying a Home</option>
                  <option value="sell-home">Selling a Home</option>
                  <option value="invest">Investment Property</option>
                  <option value="commercial">Commercial Real Estate</option>
                  <option value="buy-business">Buying a Business</option>
                  <option value="sell-business">Selling a Business</option>
                </select>
                <textarea 
                  placeholder="Tell me about your goals..." 
                  rows={4}
                  className="w-full px-4 py-3 bg-white rounded-lg border border-brand-200 focus:border-accent-400 focus:ring-2 focus:ring-accent-100 outline-none transition resize-none text-brand-900 placeholder:text-brand-400 text-sm"
                />
                <button 
                  type="submit" 
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-900 text-white font-medium rounded-lg hover:bg-brand-800 transition-colors"
                >
                  Send Message
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="bg-brand-900 text-white py-12">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-accent-500 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">K8</span>
              </div>
              <div>
                <span className="font-semibold">Estates</span>
                <p className="text-brand-400 text-xs">Katherine Minovski, Broker</p>
              </div>
            </div>
            
            <div className="flex items-center gap-8 text-sm text-brand-400">
              <a href="#services" className="hover:text-white transition">Services</a>
              <a href="#about" className="hover:text-white transition">About</a>
              <a href="#contact" className="hover:text-white transition">Contact</a>
            </div>
            
            <div className="text-sm text-brand-500 text-center md:text-right">
              <p>© {new Date().getFullYear()} K8ts Estates</p>
              <p className="text-xs mt-0.5">RE/MAX Your Community Realty</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
