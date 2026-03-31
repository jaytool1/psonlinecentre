import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Service } from '../types';
import { 
  Search, 
  ArrowRight, 
  Phone, 
  MessageCircle, 
  MapPin, 
  Mail, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Globe,
  ChevronRight,
  Filter,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import UploadModal from '../components/UploadModal';
import { cn } from '../lib/utils';

interface HomeProps {
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
}

export default function Home({ isDarkMode, setIsDarkMode }: HomeProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'services'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setServices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service)));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const categories = ['All', ...Array.from(new Set(services.map(s => s.category).filter(Boolean)))];

  const filteredServices = services.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const features = [
    { title: 'Fast Processing', desc: 'Get your documents processed in record time.', icon: Zap },
    { title: 'Secure Data', desc: 'Your personal information is safe with us.', icon: ShieldCheck },
    { title: 'Expert Support', desc: 'Dedicated team to help you at every step.', icon: CheckCircle2 },
    { title: 'Online Tracking', desc: 'Track your application status in real-time.', icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] dot-pattern">
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 lg:px-10 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--muted)] border border-[var(--border)]">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest opacity-60">Sabhi Online Services Ek Jagah</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-bold font-mono tracking-tighter uppercase flex flex-wrap items-center gap-x-4 md:gap-x-8 drop-shadow-[0_0_15px_rgba(0,0,0,0.05)] dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.05)]">
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
              >
                PANKAJ
              </motion.span>
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="relative inline-block"
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-[var(--accent)] to-transparent opacity-100">ONLINE</span>
                <span className="absolute inset-0 dot-pattern opacity-50 pointer-events-none" />
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
              >
                CENTER
              </motion.span>
            </h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.8 }}
              className="text-lg max-w-md leading-relaxed font-medium"
            >
              Experience the next generation of digital services. Fast, secure, and minimal. Just like it should be.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-wrap gap-4"
            >
              <a href="#services" className="nothing-button group">
                Apply Now
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#contact" className="nothing-button-outline">
                Contact Us
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative"
          >
            <div className="aspect-square rounded-[60px] overflow-hidden border border-[var(--border)] shadow-2xl relative z-10">
              <img 
                src="https://picsum.photos/seed/tech/1000/1000" 
                alt="Hero" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-10 text-white">
                <p className="text-4xl font-bold font-mono tracking-tighter uppercase">Digital India</p>
                <p className="opacity-60 text-sm uppercase tracking-widest">Empowering citizens through technology</p>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 border border-[var(--border)] rounded-full opacity-20 animate-spin-slow" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-[var(--fg)] opacity-[0.02] rounded-full blur-3xl" />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 lg:px-10 bg-[var(--muted)]/30 border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="nothing-card p-8 space-y-4 hover:bg-[var(--bg)]"
            >
              <div className="w-12 h-12 bg-[var(--fg)] text-[var(--bg)] rounded-2xl flex items-center justify-center">
                <feature.icon size={24} />
              </div>
              <h3 className="text-xl font-bold font-mono tracking-tighter uppercase">{feature.title}</h3>
              <p className="text-sm opacity-60 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-6xl font-bold font-mono tracking-tighter uppercase">Our Services</h2>
              <p className="text-lg opacity-60 max-w-xl">Choose from a wide range of digital services tailored to your needs.</p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
                <input
                  type="text"
                  placeholder="Search services..."
                  className="nothing-input pl-12"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat || 'All')}
                    className={cn(
                      "nothing-badge whitespace-nowrap px-6 py-3 transition-all",
                      selectedCategory === (cat || 'All') ? "bg-[var(--fg)] text-[var(--bg)]" : "hover:bg-[var(--muted)]"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <Loader2 className="animate-spin opacity-20" size={48} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredServices.map((service, i) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  viewport={{ once: true }}
                  className="nothing-card group p-4 flex flex-col"
                >
                  <div className="aspect-square mb-6 rounded-[32px] overflow-hidden bg-[var(--muted)] border border-[var(--border)] relative">
                    <img
                      src={service.imageUrl}
                      alt={service.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="nothing-badge bg-[var(--bg)]/80 backdrop-blur-md">₹{service.price}</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div>
                      <h4 className="text-xl font-bold font-mono tracking-tighter uppercase mb-1">{service.name}</h4>
                      {service.category && (
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-30">{service.category}</p>
                      )}
                    </div>
                    <p className="text-sm opacity-60 line-clamp-2 leading-relaxed">{service.description || 'Professional service for your digital needs.'}</p>
                  </div>

                  <button
                    onClick={() => setSelectedService(service)}
                    className="nothing-button w-full mt-8 group/btn"
                  >
                    Apply Now
                    <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              ))}
              {filteredServices.length === 0 && (
                <div className="col-span-full nothing-card text-center py-20 opacity-50">
                  <p className="text-xl font-mono uppercase tracking-widest">No services found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 px-6 lg:px-10 bg-[var(--muted)]/30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div className="space-y-12">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-6xl font-bold font-mono tracking-tighter uppercase">Get in Touch</h2>
              <p className="text-lg opacity-60 max-w-md">Have questions? We're here to help you with any queries.</p>
            </div>

            <div className="space-y-8">
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 bg-[var(--bg)] border border-[var(--border)] rounded-2xl flex items-center justify-center group-hover:bg-[var(--fg)] group-hover:text-[var(--bg)] transition-all">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest opacity-30">Call Us</p>
                  <p className="text-xl font-bold">+91 76547 48924</p>
                </div>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 bg-[var(--bg)] border border-[var(--border)] rounded-2xl flex items-center justify-center group-hover:bg-[#25D366] group-hover:text-white group-hover:border-[#25D366] transition-all">
                  <MessageCircle size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest opacity-30">WhatsApp</p>
                  <p className="text-xl font-bold">Message on WhatsApp</p>
                </div>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 bg-[var(--bg)] border border-[var(--border)] rounded-2xl flex items-center justify-center group-hover:bg-[var(--fg)] group-hover:text-[var(--bg)] transition-all">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest opacity-30">Location</p>
                  <p className="text-xl font-bold">Aran Chowk, Ward No 13, Saharsa, Bihar - 852124</p>
                </div>
              </div>
            </div>
          </div>

          <div className="nothing-card p-0 overflow-hidden h-[500px] border-2">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57404.1448834947!2d86.5644837!3d25.8833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ee46067750539f%3A0x67148d7672288e1d!2sSaharsa%2C%20Bihar!5e0!3m2!1sen!2sin!4v1711890000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, filter: isDarkMode ? 'invert(90%) hue-rotate(180deg)' : 'none' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
      
      <AnimatePresence>
        {selectedService && (
          <UploadModal 
            service={selectedService} 
            onClose={() => setSelectedService(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
