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
  ArrowRight
} from "lucide-react";

export default function HomePage() {
  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-brand-100" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-800 hidden lg:block" 
          style={{ clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)" }} 
        />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Award className="h-4 w-4" />
                RE/MAX Broker | Since 2016
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-brand-900 leading-tight mb-6">
                Real Estate &<br />
                <span className="text-gold-500">Business Brokerage</span><br />
                Excellence
              </h1>
              
              <p className="text-lg text-brand-600 mb-8 leading-relaxed">
                From residential homes to commercial properties and complete business sales — 
                Katherine Minovski brings over a decade of high-stakes sales expertise to every transaction. 
                Your success is the only outcome.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button size="lg" variant="primary">
                  Book Free Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline">
                  View Services
                </Button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-brand-200">
                <div>
                  <div className="text-3xl font-display font-bold text-brand-800">8+</div>
                  <div className="text-sm text-brand-600">Years Experience</div>
                </div>
                <div>
                  <div className="text-3xl font-display font-bold text-brand-800">$50M+</div>
                  <div className="text-sm text-brand-600">Transactions</div>
                </div>
                <div>
                  <div className="text-3xl font-display font-bold text-brand-800">100%</div>
                  <div className="text-sm text-brand-600">Client Focus</div>
                </div>
              </div>
            </div>
            
            <div className="hidden lg:block">
              {/* Placeholder for Katherine's photo */}
              <div className="relative">
                <div className="w-full aspect-[3/4] bg-brand-700 rounded-2xl overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white/80">
                      <Users className="h-24 w-24 mx-auto mb-4" />
                      <p className="text-lg">Katherine Minovski</p>
                      <p className="text-sm opacity-75">Broker</p>
                    </div>
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gold-500 rounded-2xl -z-10" />
                <div className="absolute -top-6 -right-6 w-24 h-24 border-4 border-gold-500 rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-brand-900 mb-4">
              Comprehensive Real Estate &<br />Business Services
            </h2>
            <p className="text-lg text-brand-600">
              Whether you&apos;re buying, selling, or leasing — residential, commercial, or an entire business — 
              K8ts Estates provides expert representation at every stage.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Residential */}
            <div className="group p-8 bg-brand-50 rounded-2xl hover:bg-brand-800 transition-all duration-300">
              <div className="w-14 h-14 bg-brand-800 group-hover:bg-gold-500 rounded-xl flex items-center justify-center mb-6 transition-colors">
                <Home className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-display font-bold text-brand-900 group-hover:text-white mb-3 transition-colors">
                Residential Real Estate
              </h3>
              <p className="text-brand-600 group-hover:text-brand-200 transition-colors mb-4">
                Expert guidance for buying and selling homes across Southern Ontario. 
                From first-time buyers to luxury properties.
              </p>
              <ul className="space-y-2 text-sm text-brand-600 group-hover:text-brand-200 transition-colors">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-gold-500" />
                  Buyer Representation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-gold-500" />
                  Seller Representation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-gold-500" />
                  Residential Leasing
                </li>
              </ul>
            </div>
            
            {/* Commercial */}
            <div className="group p-8 bg-brand-50 rounded-2xl hover:bg-brand-800 transition-all duration-300">
              <div className="w-14 h-14 bg-brand-800 group-hover:bg-gold-500 rounded-xl flex items-center justify-center mb-6 transition-colors">
                <Building2 className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-display font-bold text-brand-900 group-hover:text-white mb-3 transition-colors">
                Commercial Real Estate
              </h3>
              <p className="text-brand-600 group-hover:text-brand-200 transition-colors mb-4">
                Investment properties, retail spaces, office buildings, and industrial facilities. 
                Strategic acquisitions and dispositions.
              </p>
              <ul className="space-y-2 text-sm text-brand-600 group-hover:text-brand-200 transition-colors">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-gold-500" />
                  Sales & Acquisitions
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-gold-500" />
                  Commercial Leasing
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-gold-500" />
                  Investment Analysis
                </li>
              </ul>
            </div>
            
            {/* Business Brokerage */}
            <div className="group p-8 bg-brand-50 rounded-2xl hover:bg-brand-800 transition-all duration-300 md:col-span-2 lg:col-span-1">
              <div className="w-14 h-14 bg-brand-800 group-hover:bg-gold-500 rounded-xl flex items-center justify-center mb-6 transition-colors">
                <Briefcase className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-display font-bold text-brand-900 group-hover:text-white mb-3 transition-colors">
                Business Brokerage
              </h3>
              <p className="text-brand-600 group-hover:text-brand-200 transition-colors mb-4">
                Complete business transaction services — from valuation to closing. 
                Confidential, professional, results-driven.
              </p>
              <ul className="space-y-2 text-sm text-brand-600 group-hover:text-brand-200 transition-colors">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-gold-500" />
                  Business Valuations
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-gold-500" />
                  Buyer & Seller Representation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-gold-500" />
                  Deal Structuring & Negotiation
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-brand-800 text-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Meet Katherine Minovski
              </h2>
              <div className="w-20 h-1 bg-gold-500 mb-8" />
              
              <div className="space-y-6 text-brand-100 leading-relaxed">
                <p>
                  <strong className="text-white">Katherine Minovski isn&apos;t your typical real estate agent.</strong> 
                  Before entering real estate in 2016, she spent over a decade as a senior executive 
                  in digital media and enterprise sales — serving as VP of Sales and VP of Product Development, 
                  closing seven-figure deals with Fortune 500 clients, and building relationships with 
                  30+ national agencies representing brands like Ford, Toyota, Honda, Mercedes, GM, and Harley-Davidson.
                </p>
                
                <p>
                  At VerticalScope, she didn&apos;t just meet targets — she shattered them. While the industry 
                  averaged 14-17% growth, Katherine delivered <strong className="text-gold-400">20-28% growth 
                  for three consecutive years</strong>. She achieved 135% of quota by Q2 on eight-figure targets. 
                  She directly closed seven-figure deals with clients from BRP to Progressive Insurance to Discount Tire.
                </p>
                
                <p>
                  <strong className="text-gold-400">What sets Katherine apart?</strong> She&apos;s a closer. 
                  She&apos;s negotiated with C-suite executives, presented to investors, and built campaigns 
                  from concept to completion for the biggest names in automotive, powersports, and beyond. 
                  When deals get complex, when stakes are high, when other agents would walk away — 
                  that&apos;s when Katherine thrives.
                </p>
                
                <p>
                  Today, that same strategic thinking, relentless execution, and client-first approach 
                  powers her real estate and business brokerage practice. She became a licensed Broker 
                  shortly after entering the industry — a testament to her rapid mastery and commitment 
                  to operating at the highest level. Whether you&apos;re buying your first home, selling 
                  a commercial property, or orchestrating the sale of an established business — 
                  you deserve someone who&apos;s done this at the highest levels.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mt-10">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gold-500 rounded-lg flex items-center justify-center shrink-0">
                    <TrendingUp className="h-6 w-6 text-brand-900" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Seven-Figure Closer</div>
                    <div className="text-sm text-brand-200">Fortune 500 enterprise sales</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gold-500 rounded-lg flex items-center justify-center shrink-0">
                    <Award className="h-6 w-6 text-brand-900" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Licensed Broker</div>
                    <div className="text-sm text-brand-200">RE/MAX Your Community Realty</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              {/* About image placeholder */}
              <div className="aspect-[4/5] bg-brand-700 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white/60">
                    <Users className="h-20 w-20 mx-auto mb-4" />
                    <p>Professional Photo</p>
                  </div>
                </div>
              </div>
              {/* Quote */}
              <div className="absolute -bottom-6 -left-6 right-12 bg-white text-brand-900 p-6 rounded-xl shadow-xl">
                <p className="font-display text-lg italic">
                  &ldquo;I&apos;ve closed seven-figure deals for Fortune 500 clients. Your biggest 
                  financial decision deserves that same level of expertise and commitment.&rdquo;
                </p>
                <p className="text-gold-600 font-semibold mt-2">— Katherine Minovski</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Track Record Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-brand-900 mb-4">
              A Track Record That Speaks
            </h2>
            <p className="text-lg text-brand-600">
              Before real estate, Katherine built a career closing deals that others said couldn&apos;t be done.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-brand-50 p-6 rounded-2xl text-center">
              <div className="text-4xl font-display font-bold text-gold-600 mb-2">135%</div>
              <div className="text-brand-700 font-medium">Of Quota Achieved</div>
              <div className="text-sm text-brand-500 mt-1">On eight-figure targets</div>
            </div>
            <div className="bg-brand-50 p-6 rounded-2xl text-center">
              <div className="text-4xl font-display font-bold text-gold-600 mb-2">7-Figure</div>
              <div className="text-brand-700 font-medium">Deals Closed</div>
              <div className="text-sm text-brand-500 mt-1">Fortune 500 clients</div>
            </div>
            <div className="bg-brand-50 p-6 rounded-2xl text-center">
              <div className="text-4xl font-display font-bold text-gold-600 mb-2">30+</div>
              <div className="text-brand-700 font-medium">National Agencies</div>
              <div className="text-sm text-brand-500 mt-1">Major brand relationships</div>
            </div>
            <div className="bg-brand-50 p-6 rounded-2xl text-center">
              <div className="text-4xl font-display font-bold text-gold-600 mb-2">20-28%</div>
              <div className="text-brand-700 font-medium">YoY Growth</div>
              <div className="text-sm text-brand-500 mt-1">3 consecutive years</div>
            </div>
          </div>
          
          <div className="mt-12 bg-brand-800 rounded-2xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-display font-bold text-white mb-4">
                  Former Clients Include
                </h3>
                <p className="text-brand-200 mb-6">
                  A decade of building relationships with the world&apos;s leading brands 
                  and their agencies — now focused entirely on you.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {['Ford', 'Toyota', 'Honda', 'Mercedes', 'GM', 'Subaru', 'Harley-Davidson', 'Progressive', 'Allstate'].map((brand) => (
                  <div key={brand} className="bg-brand-700/50 rounded-lg py-2 px-3 text-center text-sm text-brand-200">
                    {brand}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 bg-brand-50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-brand-900 mb-4">
              Why Choose K8ts Estates
            </h2>
            <p className="text-lg text-brand-600">
              The difference is in the details — and the results.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Expert Negotiator",
                description: "Enterprise sales background means Katherine knows how to structure and close complex deals."
              },
              {
                title: "Full Representation",
                description: "Buyer, seller, or multiple representation — clear communication and ethical practice always."
              },
              {
                title: "Market Knowledge",
                description: "Deep expertise across Southern Ontario&apos;s residential, commercial, and business markets."
              },
              {
                title: "Results Focused",
                description: "Every strategy, every decision, every action is designed to maximize your outcome."
              }
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-gold-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-display font-bold text-brand-900">{i + 1}</span>
                </div>
                <h3 className="text-lg font-display font-bold text-brand-900 mb-2">{item.title}</h3>
                <p className="text-brand-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-brand-800 to-brand-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-brand-200 mb-8 max-w-2xl mx-auto">
            Whether you&apos;re buying, selling, or exploring your options — 
            let&apos;s have a conversation about your goals.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary">
              <Phone className="mr-2 h-5 w-5" />
              Call Now
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-brand-900">
              <Mail className="mr-2 h-5 w-5" />
              Send Email
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-brand-900 mb-6">
                Get In Touch
              </h2>
              <p className="text-lg text-brand-600 mb-8">
                Serving all of Southern Ontario — from Toronto and the GTA to Hamilton, 
                Kitchener-Waterloo, and beyond.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center shrink-0">
                    <Phone className="h-6 w-6 text-brand-700" />
                  </div>
                  <div>
                    <div className="font-semibold text-brand-900">Phone</div>
                    <a href="tel:+14168167850" className="text-brand-600 hover:text-gold-600 transition">
                      (416) 816-7850
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center shrink-0">
                    <Mail className="h-6 w-6 text-brand-700" />
                  </div>
                  <div>
                    <div className="font-semibold text-brand-900">Email</div>
                    <a href="mailto:kminovski@gmail.com" className="text-brand-600 hover:text-gold-600 transition">
                      kminovski@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="h-6 w-6 text-brand-700" />
                  </div>
                  <div>
                    <div className="font-semibold text-brand-900">Office</div>
                    <div className="text-brand-600">
                      RE/MAX Your Community Realty<br />
                      161 Main Street<br />
                      Unionville, Ontario L3R 2G8
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-brand-50 rounded-2xl p-8">
              <h3 className="text-xl font-display font-bold text-brand-900 mb-6">
                Send a Message
              </h3>
              <form className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="First Name" 
                    className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition"
                  />
                  <input 
                    type="text" 
                    placeholder="Last Name" 
                    className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition"
                  />
                </div>
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition"
                />
                <input 
                  type="tel" 
                  placeholder="Phone Number" 
                  className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition"
                />
                <select 
                  className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition text-brand-600"
                >
                  <option value="">I&apos;m interested in...</option>
                  <option value="buying-residential">Buying a Home</option>
                  <option value="selling-residential">Selling a Home</option>
                  <option value="buying-commercial">Buying Commercial Property</option>
                  <option value="selling-commercial">Selling Commercial Property</option>
                  <option value="leasing">Leasing</option>
                  <option value="buying-business">Buying a Business</option>
                  <option value="selling-business">Selling a Business</option>
                  <option value="other">Other</option>
                </select>
                <textarea 
                  placeholder="Tell me about your goals..." 
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition resize-none"
                />
                <Button type="submit" variant="primary" className="w-full">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <span className="text-2xl font-display font-bold">
                K8ts<span className="text-gold-500">Estates</span>
              </span>
              <p className="text-brand-300 text-sm mt-2">
                Katherine Minovski, Broker | RE/MAX Your Community Realty
              </p>
            </div>
            <div className="text-sm text-brand-400 text-center md:text-right">
              <p>© {new Date().getFullYear()} K8ts Estates. All rights reserved.</p>
              <p className="mt-1">Serving Southern Ontario</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
