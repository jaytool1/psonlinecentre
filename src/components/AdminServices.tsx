import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { Service } from '../types';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  Upload, 
  Image as ImageIcon,
  Loader2,
  Check,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { cn } from '../lib/utils';

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'services'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setServices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service)));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const resetForm = () => {
    setName('');
    setPrice('');
    setCategory('');
    setDescription('');
    setImageFile(null);
    setImagePreview(null);
    setEditingService(null);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setName(service.name);
    setPrice(service.price);
    setCategory(service.category || '');
    setDescription(service.description || '');
    setImagePreview(service.imageUrl);
    setIsModalOpen(true);
  };

  const handleDelete = async (service: Service) => {
    if (!window.confirm(`Are you sure you want to delete ${service.name}?`)) return;
    
    try {
      await deleteDoc(doc(db, 'services', service.id));
      // Optionally delete image from storage if it's not a placeholder
      if (service.imageUrl.includes('firebasestorage')) {
        const imageRef = ref(storage, service.imageUrl);
        await deleteObject(imageRef).catch(e => console.error('Failed to delete image:', e));
      }
      toast.success('Service deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete service');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      let imageUrl = editingService?.imageUrl || '';

      if (imageFile) {
        const storageRef = ref(storage, `services/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const serviceData = {
        name,
        price,
        category,
        description,
        imageUrl,
      };

      if (editingService) {
        await updateDoc(doc(db, 'services', editingService.id), serviceData);
        toast.success('Service updated successfully');
      } else {
        await addDoc(collection(db, 'services'), serviceData);
        toast.success('Service added successfully');
      }

      setIsModalOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save service');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
          <input
            type="text"
            placeholder="Search services..."
            className="nothing-input pl-12"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="nothing-button w-full md:w-auto"
        >
          <Plus size={18} />
          Add Service
        </button>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="animate-spin opacity-20" size={48} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredServices.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="nothing-card group relative overflow-hidden"
            >
              <div className="aspect-video mb-4 rounded-2xl overflow-hidden bg-[var(--muted)] border border-[var(--border)]">
                <img
                  src={service.imageUrl}
                  alt={service.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h4 className="font-bold text-lg leading-tight">{service.name}</h4>
                  <span className="nothing-badge shrink-0">₹{service.price}</span>
                </div>
                {service.category && (
                  <p className="text-xs font-mono opacity-50 uppercase tracking-widest">{service.category}</p>
                )}
                <p className="text-sm opacity-70 line-clamp-2">{service.description || 'No description provided.'}</p>
              </div>

              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(service)}
                  className="p-2 bg-[var(--bg)] border border-[var(--border)] rounded-full hover:bg-[var(--fg)] hover:text-[var(--bg)] transition-all"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(service)}
                  className="p-2 bg-[var(--bg)] border border-[var(--border)] rounded-full hover:bg-red-500 hover:text-white transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
          {filteredServices.length === 0 && (
            <div className="col-span-full nothing-card text-center py-20 opacity-50">
              <ImageIcon size={48} className="mx-auto mb-4 opacity-20" />
              <p>No services found.</p>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-[var(--bg)] border border-[var(--border)] rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold font-mono tracking-tighter uppercase">
                  {editingService ? 'Edit Service' : 'Add New Service'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-[var(--muted)] rounded-full">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest opacity-50">Service Name</label>
                    <input
                      type="text"
                      className="nothing-input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest opacity-50">Price (₹)</label>
                    <input
                      type="text"
                      className="nothing-input"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest opacity-50">Category</label>
                    <input
                      type="text"
                      className="nothing-input"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest opacity-50">Image</label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="service-image"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setImageFile(file);
                            setImagePreview(URL.createObjectURL(file));
                          }
                        }}
                      />
                      <label
                        htmlFor="service-image"
                        className="nothing-input flex items-center gap-3 cursor-pointer hover:border-[var(--fg)]"
                      >
                        <Upload size={18} />
                        <span className="truncate">{imageFile ? imageFile.name : 'Upload Image'}</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest opacity-50">Description</label>
                  <textarea
                    className="nothing-input min-h-[100px]"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {imagePreview && (
                  <div className="relative aspect-video rounded-2xl overflow-hidden border border-[var(--border)]">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => { setImageFile(null); setImagePreview(null); }}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="nothing-button-outline flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="nothing-button flex-1"
                  >
                    {submitting ? <Loader2 className="animate-spin" size={20} /> : (
                      <>
                        <Check size={20} />
                        {editingService ? 'Update Service' : 'Create Service'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
