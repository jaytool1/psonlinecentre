import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[var(--bg)] border-t border-[var(--border)] pt-20 pb-10 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
        <div className="space-y-6">
          <Link to="/" className="text-2xl font-bold font-mono tracking-tighter uppercase">
            PANKAJ <span className="opacity-50">ONLINE</span>
          </Link>
          <p className="text-sm opacity-60 leading-relaxed">
            Your one-stop destination for all online services. We provide fast, reliable, and affordable digital solutions.
          </p>
          <div className="flex gap-4">
            <a href="#" className="p-2 hover:bg-[var(--muted)] rounded-full transition-all"><Instagram size={20} /></a>
            <a href="#" className="p-2 hover:bg-[var(--muted)] rounded-full transition-all"><Facebook size={20} /></a>
            <a href="#" className="p-2 hover:bg-[var(--muted)] rounded-full transition-all"><Twitter size={20} /></a>
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-xs font-bold uppercase tracking-widest opacity-30">Quick Links</h4>
          <ul className="space-y-4 text-sm font-medium">
            <li><a href="#" className="hover:opacity-50 transition-opacity">Home</a></li>
            <li><a href="#services" className="hover:opacity-50 transition-opacity">Services</a></li>
            <li><a href="#about" className="hover:opacity-50 transition-opacity">About Us</a></li>
            <li><a href="#contact" className="hover:opacity-50 transition-opacity">Contact</a></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-xs font-bold uppercase tracking-widest opacity-30">Services</h4>
          <ul className="space-y-4 text-sm font-medium">
            <li><a href="#" className="hover:opacity-50 transition-opacity">PAN Card</a></li>
            <li><a href="#" className="hover:opacity-50 transition-opacity">Aadhar Services</a></li>
            <li><a href="#" className="hover:opacity-50 transition-opacity">Voter ID</a></li>
            <li><a href="#" className="hover:opacity-50 transition-opacity">Passport Apply</a></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-xs font-bold uppercase tracking-widest opacity-30">Contact Us</h4>
          <ul className="space-y-4 text-sm font-medium">
            <li className="flex items-center gap-3">
              <Phone size={18} className="opacity-30" />
              <span>+91 76547 48924</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="opacity-30" />
              <span>contact@pankajonline.com</span>
            </li>
            <li className="flex items-center gap-3">
              <MapPin size={18} className="opacity-30" />
              <span>Aran Chowk, Ward No 13, Saharsa, Bihar - 852124</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-10 border-t border-[var(--border)] flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-mono opacity-30 uppercase tracking-widest">
        <p>© 2026 PANKAJ ONLINE CENTER. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:opacity-100">Privacy Policy</a>
          <a href="#" className="hover:opacity-100">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
