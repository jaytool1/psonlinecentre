import { MessageCircle, Phone } from 'lucide-react';
import { motion } from 'motion/react';

export default function WhatsAppButton() {
  const phoneNumber = '917654748924';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=Hello, I have a query regarding your services.`;

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-4">
      <motion.a
        href={`tel:+${phoneNumber}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-14 h-14 bg-[var(--bg)] text-[var(--fg)] border border-[var(--border)] rounded-full flex items-center justify-center shadow-2xl hover:bg-[var(--fg)] hover:text-[var(--bg)] transition-all"
      >
        <Phone size={24} />
      </motion.a>
      
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:brightness-110 transition-all"
      >
        <MessageCircle size={28} />
      </motion.a>
    </div>
  );
}
