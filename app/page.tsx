import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  Home, 
  Briefcase, 
  Users, 
  Award, 
  TrendingUp,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Sparkles,
  Shield,
  Heart,
  Target,
  Zap,
  MessageCircle
} from "lucide-react";

export default function HomePage() {
  return (
    <>
      <Header />
      
      {/* Hero Section - Refined & Prestigious */}
      <section className="relative min-h-screen flex items-center pt-24 pb-20 overflow-hidden">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50 via-white to-brand-100/50" />
        
        {/* Decorative elements */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-0 w-80 h-80 bg-brand-200/30 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Refined badge */}
            <div className="inline-flex items-center gap-2 bg-brand-900/5 border border-brand-200 px-5 py-2.5 rounded-full text-sm mb-8">
              <Sparkles className="h-4 w-4 text-gold-500" />
              <span className="text-brand-600 font-medium">AI-Powered Real Estate & Business Advisory</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display text-brand-900 leading-[1.1] mb-8">
              Where Technology<br />
              <span className="text-gradient">Meets Trust</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-brand-500 mb-10 leading-relaxed max-w-2xl mx-auto font-light">
              Experience real estate reimagined. Bespoke strategies, 
              white-glove service, and cutting-edge AI — tailored to your 
              unique journey.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
              <Button size="lg" variant="primary" className="group">
                Begin Your Journey
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline">
                Discover Our Approach
              </Button>
            </div>
            
            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center gap-8 text-sm text-brand-400">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-gold-500" />
                <span>Licensed Broker</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-gold-500" />
                <span>RE/MAX Excellence</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-gold-500" />
                <span>AI-Enhanced Service</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-brand-300 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-brand-400 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Philosophy Section - What Makes Us Different */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <p className="text-gold-600 font-medium tracking-wide uppercase text-sm mb-4">Our Philosophy</p>
            <h2 className="text-4xl md:text-5xl font-display text-brand-900 mb-6">
              A New Standard in<br />Real Estate Excellence
            </h2>
            <p className="text-lg text-brand-500 leading-relaxed">
              We believe every client deserves more than a transaction — they deserve 
              a trusted advisor who combines deep expertise with the latest technology 
              to deliver exceptional outcomes.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Sparkles,
                title: "AI-Powered Insights",
                description: "Leverage cutting-edge technology for market analysis, valuation, and strategic decision-making."
              },
              {
                icon: Heart,
                title: "White Glove Service",
                description: "Personalized attention at every step. Your journey is unique — your service should be too."
              },
              {
                icon: Target,
                title: "Tailored Strategies",
                description: "Custom plans designed for your individual goals, timeline, and circumstances."
              },
              {
                icon: MessageCircle,
                title: "Exceptional Communication",
                description: "Proactive updates, clear guidance, and always available when you need us."
              }
            ].map((item, i) => (
              <div key={i} className="group">
                <div className="bg-brand-50 rounded-2xl p-8 h-full border border-transparent hover:border-gold-400/30 hover:shadow-lg hover:shadow-gold-400/5 transition-all duration-300">
                  <div className="w-14 h-14 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <item.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-display text-brand-900 mb-3">{item.title}</h3>
                  <p className="text-brand-500 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section - Refined */}
      <section id="services" className="py-24 bg-brand-950 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <p className="text-gold-400 font-medium tracking-wide uppercase text-sm mb-4">Services</p>
            <h2 className="text-4xl md:text-5xl font-display mb-6">
              Comprehensive Advisory<br />For Every Need
            </h2>
            <p className="text-lg text-brand-300 leading-relaxed">
              From finding your dream home to orchestrating complex business transactions — 
              we bring the same level of excellence to every engagement.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Residential */}
            <div className="group relative bg-brand-900/50 rounded-3xl p-10 border border-brand-800 hover:border-gold-500/30 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-b from-gold-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <Home className="h-10 w-10 text-gold-400 mb-6" />
                <h3 className="text-2xl font-display mb-4">Residential</h3>
                <p className="text-brand-300 mb-6 leading-relaxed">
                  Whether you&apos;re buying your first home or selling a cherished property, 
                  we guide you with expertise and care.
                </p>
                <ul className="space-y-3 text-sm text-brand-400">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-gold-500 shrink-0" />
                    Buyer & Seller Representation
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-gold-500 shrink-0" />
                    Luxury & Investment Properties
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-gold-500 shrink-0" />
                    Residential Leasing
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Commercial */}
            <div className="group relative bg-brand-900/50 rounded-3xl p-10 border border-brand-800 hover:border-gold-500/30 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-b from-gold-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <Building2 className="h-10 w-10 text-gold-400 mb-6" />
                <h3 className="text-2xl font-display mb-4">Commercial</h3>
                <p className="text-brand-300 mb-6 leading-relaxed">
                  Strategic acquisitions, dispositions, and leasing for investors 
                  and business owners seeking exceptional opportunities.
                </p>
                <ul className="space-y-3 text-sm text-brand-400">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-gold-500 shrink-0" />
                    Investment Properties
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-gold-500 shrink-0" />
                    Retail, Office & Industrial
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-gold-500 shrink-0" />
                    Commercial Leasing
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Business Brokerage */}
            <div className="group relative bg-brand-900/50 rounded-3xl p-10 border border-brand-800 hover:border-gold-500/30 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-b from-gold-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <Briefcase className="h-10 w-10 text-gold-400 mb-6" />
                <h3 className="text-2xl font-display mb-4">Business Advisory</h3>
                <p className="text-brand-300 mb-6 leading-relaxed">
                  From valuation to closing, we orchestrate business transactions 
                  with the discretion and expertise they require.
                </p>
                <ul className="space-y-3 text-sm text-brand-400">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-gold-500 shrink-0" />
                    Business Valuations
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-gold-500 shrink-0" />
                    Buyer & Seller Representation
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-gold-500 shrink-0" />
                    Deal Structuring & Negotiation
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section - Prestigious */}
      <section id="about" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-gold-600 font-medium tracking-wide uppercase text-sm mb-4">About Katherine</p>
              <h2 className="text-4xl md:text-5xl font-display text-brand-900 mb-8 leading-tight">
                A Different Kind<br />of Real Estate Professional
              </h2>
              
              <div className="space-y-6 text-brand-600 leading-relaxed">
                <p className="text-lg">
                  <strong className="text-brand-900">Before entering real estate, Katherine Minovski spent over a decade 
                  at the highest levels of enterprise sales</strong> — serving as VP of Sales and VP of Product 
                  Development, closing seven-figure deals with Fortune 500 clients, and building relationships 
                  with 30+ national agencies representing brands like Ford, Toyota, Mercedes, and Harley-Davidson.
                </p>
                
                <p>
                  She didn&apos;t just meet targets — she consistently exceeded them, delivering 20-28% growth 
                  in an industry averaging 14-17%. She achieved 135% of quota on eight-figure targets. 
                  She knows what it takes to close complex, high-stakes deals.
                </p>
                
                <p>
                  <strong className="text-gold-600">Today, that same strategic thinking, relentless execution, 
                  and client-first approach powers K8ts Estates.</strong> Combined with AI-powered insights 
                  and a commitment to white-glove service, Katherine delivers an experience that&apos;s 
                  truly exceptional — whether you&apos;re buying your first home, selling a commercial 
                  property, or navigating a complex business transaction.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mt-10">
                <div className="bg-brand-50 rounded-xl p-6">
                  <div className="text-3xl font-display text-gold-600 mb-1">135%</div>
                  <div className="text-sm text-brand-600">Of quota achieved on eight-figure targets</div>
                </div>
                <div className="bg-brand-50 rounded-xl p-6">
                  <div className="text-3xl font-display text-gold-600 mb-1">30+</div>
                  <div className="text-sm text-brand-600">National agency relationships</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              {/* Photo placeholder with elegant frame */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-gold-400/20 to-brand-200/20 rounded-3xl transform rotate-3" />
                <div className="relative aspect-[4/5] bg-brand-100 rounded-3xl overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-brand-400">
                      <Users className="h-20 w-20 mx-auto mb-4 opacity-50" />
                      <p className="text-sm">Professional Photo</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating quote card */}
              <div className="absolute -bottom-8 -left-8 right-8 bg-brand-900 text-white p-8 rounded-2xl shadow-2xl">
                <p className="font-display text-xl italic leading-relaxed">
                  &ldquo;Your biggest financial decisions deserve more than a transaction — 
                  they deserve a trusted advisor committed to your success.&rdquo;
                </p>
                <p className="text-gold-400 font-medium mt-4">— Katherine Minovski</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-24 bg-brand-50">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-gold-600 font-medium tracking-wide uppercase text-sm mb-4">The Experience</p>
            <h2 className="text-4xl md:text-5xl font-display text-brand-900 mb-6">
              What to Expect When<br />You Work With Us
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                title: "Discovery",
                description: "We begin by deeply understanding your goals, timeline, and unique circumstances. No two clients are alike — neither is our approach."
              },
              {
                step: "02",
                title: "Strategy",
                description: "Using AI-powered market analysis and decades of experience, we craft a tailored plan designed to achieve your specific objectives."
              },
              {
                step: "03",
                title: "Execution",
                description: "With clear communication at every step, we guide you through the process — handling complexity so you can focus on what matters."
              }
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="text-8xl font-display text-brand-200/50 absolute -top-4 -left-2">{item.step}</div>
                <div className="relative pt-12">
                  <h3 className="text-2xl font-display text-brand-900 mb-4">{item.title}</h3>
                  <p className="text-brand-500 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Elegant */}
      <section className="py-24 bg-brand-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-800 to-brand-950" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-display text-white mb-6">
              Ready to Experience<br />Real Estate Reimagined?
            </h2>
            <p className="text-xl text-brand-300 mb-10 leading-relaxed">
              Let&apos;s have a conversation about your goals. No pressure, no obligation — 
              just a chance to see if we&apos;re the right fit for your journey.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" variant="secondary" className="group">
                <Phone className="mr-2 h-5 w-5" />
                Schedule a Call
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <Mail className="mr-2 h-5 w-5" />
                Send a Message
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <p className="text-gold-600 font-medium tracking-wide uppercase text-sm mb-4">Get in Touch</p>
              <h2 className="text-4xl md:text-5xl font-display text-brand-900 mb-6">
                Let&apos;s Start a<br />Conversation
              </h2>
              <p className="text-lg text-brand-500 mb-10 leading-relaxed">
                Serving Southern Ontario — from Toronto and the GTA to Hamilton, 
                Kitchener-Waterloo, and beyond. Available for in-person meetings, 
                video calls, or however you prefer to connect.
              </p>
              
              <div className="space-y-6">
                <a href="tel:+14168167850" className="flex items-center gap-4 group">
                  <div className="w-14 h-14 bg-brand-50 rounded-xl flex items-center justify-center group-hover:bg-gold-500 transition-colors">
                    <Phone className="h-6 w-6 text-brand-600 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <div className="text-sm text-brand-400">Phone</div>
                    <div className="text-lg text-brand-900 font-medium">(416) 816-7850</div>
                  </div>
                </a>
                
                <a href="mailto:kminovski@gmail.com" className="flex items-center gap-4 group">
                  <div className="w-14 h-14 bg-brand-50 rounded-xl flex items-center justify-center group-hover:bg-gold-500 transition-colors">
                    <Mail className="h-6 w-6 text-brand-600 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <div className="text-sm text-brand-400">Email</div>
                    <div className="text-lg text-brand-900 font-medium">kminovski@gmail.com</div>
                  </div>
                </a>
                
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-brand-50 rounded-xl flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-brand-600" />
                  </div>
                  <div>
                    <div className="text-sm text-brand-400">Office</div>
                    <div className="text-brand-900">
                      RE/MAX Your Community Realty<br />
                      <span className="text-brand-500">161 Main Street, Unionville, ON</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-brand-50 rounded-3xl p-10">
                <h3 className="text-2xl font-display text-brand-900 mb-2">Send a Message</h3>
                <p className="text-brand-500 mb-8">I typically respond within a few hours.</p>
                
                <form className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <input 
                      type="text" 
                      placeholder="First Name" 
                      className="w-full px-5 py-4 bg-white rounded-xl border border-brand-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition text-brand-900 placeholder:text-brand-400"
                    />
                    <input 
                      type="text" 
                      placeholder="Last Name" 
                      className="w-full px-5 py-4 bg-white rounded-xl border border-brand-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition text-brand-900 placeholder:text-brand-400"
                    />
                  </div>
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    className="w-full px-5 py-4 bg-white rounded-xl border border-brand-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition text-brand-900 placeholder:text-brand-400"
                  />
                  <input 
                    type="tel" 
                    placeholder="Phone Number" 
                    className="w-full px-5 py-4 bg-white rounded-xl border border-brand-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition text-brand-900 placeholder:text-brand-400"
                  />
                  <select 
                    className="w-full px-5 py-4 bg-white rounded-xl border border-brand-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition text-brand-500"
                  >
                    <option value="">I&apos;m interested in...</option>
                    <option value="buying-residential">Buying a Home</option>
                    <option value="selling-residential">Selling a Home</option>
                    <option value="buying-commercial">Commercial Real Estate</option>
                    <option value="leasing">Leasing</option>
                    <option value="buying-business">Buying a Business</option>
                    <option value="selling-business">Selling a Business</option>
                    <option value="other">Other</option>
                  </select>
                  <textarea 
                    placeholder="Tell me about your goals..." 
                    rows={4}
                    className="w-full px-5 py-4 bg-white rounded-xl border border-brand-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none transition resize-none text-brand-900 placeholder:text-brand-400"
                  />
                  <Button type="submit" variant="primary" className="w-full">
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Clean & Minimal */}
      <footer className="bg-brand-950 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <span className="text-3xl font-display">
                K8ts<span className="text-gold-400">Estates</span>
              </span>
              <p className="text-brand-400 text-sm mt-2">
                Katherine Minovski, Broker<br />
                RE/MAX Your Community Realty
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-8 text-sm text-brand-400">
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
