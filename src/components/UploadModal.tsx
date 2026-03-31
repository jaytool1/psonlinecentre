import React, { useState } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Service } from '../types';
import { 
  X, 
  Upload, 
  Check, 
  Loader2, 
  FileText, 
  User, 
  Phone,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { useDropzone } from 'react-dropzone';
import { cn } from '../lib/utils';

interface UploadModalProps {
  service: Service | null;
  onClose: () => void;
}

export default function UploadModal({ service, onClose }: UploadModalProps) {
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles: File[]) => setFile(acceptedFiles[0]),
    maxFiles: 1,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'application/pdf': ['.pdf'],
    },
  } as any);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !service) return;

    setSubmitting(true);
    try {
      // 1. Upload Document
      const storageRef = ref(storage, `applications/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const documentUrl = await getDownloadURL(snapshot.ref);

      // 2. Save Application
      await addDoc(collection(db, 'applications'), {
        serviceName: service.name,
        userName,
        userPhone,
        documentUrl,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      setSuccess(true);
      toast.success('Application submitted successfully!');
      
      // Redirect to WhatsApp after 2 seconds
      setTimeout(() => {
        const whatsappUrl = `https://wa.me/917654748924?text=Hello, I have applied for ${service.name}. My name is ${userName}.`;
        window.open(whatsappUrl, '_blank');
        onClose();
      }, 2000);

    } catch (error: any) {
      toast.error(error.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (!service) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative bg-[var(--bg)] border border-[var(--border)] rounded-[40px] w-full max-w-xl overflow-hidden shadow-2xl"
      >
        {success ? (
          <div className="p-12 text-center space-y-6">
            <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto">
              <Check size={40} />
            </div>
            <h3 className="text-3xl font-bold font-mono tracking-tighter uppercase">Success!</h3>
            <p className="text-sm opacity-60">
              Your application for <strong>{service.name}</strong> has been submitted. 
              Redirecting you to WhatsApp for further communication...
            </p>
            <div className="w-full h-1 bg-[var(--border)] rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 2 }}
                className="h-full bg-[var(--fg)]"
              />
            </div>
          </div>
        ) : (
          <>
            <div className="p-8 border-b border-[var(--border)] flex items-center justify-between bg-[var(--muted)]">
              <div>
                <h3 className="text-xl font-bold font-mono tracking-tighter uppercase">Apply Now</h3>
                <p className="text-xs opacity-50 font-medium">{service.name} • ₹{service.price}</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-[var(--bg)] rounded-full transition-all">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
                  <input
                    type="text"
                    placeholder="Your Full Name"
                    className="nothing-input pl-12"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
                  <input
                    type="tel"
                    placeholder="WhatsApp Number"
                    className="nothing-input pl-12"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest opacity-30">Upload Document (PDF/Image)</label>
                <div
                  {...getRootProps()}
                  className={cn(
                    "border-2 border-dashed border-[var(--border)] rounded-3xl p-8 text-center cursor-pointer transition-all hover:border-[var(--fg)] hover:bg-[var(--muted)]",
                    isDragActive && "border-[var(--fg)] bg-[var(--muted)]",
                    file && "border-green-500 bg-green-500/5"
                  )}
                >
                  <input {...getInputProps()} />
                  {file ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center">
                        <Check size={24} />
                      </div>
                      <p className="text-sm font-bold truncate max-w-[200px]">{file.name}</p>
                      <p className="text-xs opacity-50">Click to change file</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 bg-[var(--muted)] rounded-full flex items-center justify-center">
                        <Upload size={24} className="opacity-30" />
                      </div>
                      <p className="text-sm font-medium">Drag & drop or click to upload</p>
                      <p className="text-xs opacity-40">Max size: 5MB (PDF, JPG, PNG)</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                <AlertCircle size={18} className="text-blue-500 shrink-0 mt-0.5" />
                <p className="text-[10px] leading-relaxed opacity-70">
                  By submitting, you agree to our terms. We will process your application and contact you via WhatsApp for further steps.
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting || !file || !userName || !userPhone}
                className="nothing-button w-full py-4 text-lg"
              >
                {submitting ? <Loader2 className="animate-spin" size={24} /> : (
                  <>
                    Submit Application
                    <Check size={20} />
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}
