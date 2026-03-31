import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { Application } from '../types';
import { 
  Search, 
  Trash2, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Filter,
  MoreVertical,
  Download,
  Phone,
  User as UserIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { cn, formatDate } from '../lib/utils';

export default function AdminApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const q = query(collection(db, 'applications'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setApplications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Application)));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleStatusUpdate = async (id: string, status: Application['status']) => {
    try {
      await updateDoc(doc(db, 'applications', id), { status });
      toast.success(`Status updated to ${status}`);
    } catch (error: any) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;
    try {
      await deleteDoc(doc(db, 'applications', id));
      toast.success('Application deleted');
    } catch (error: any) {
      toast.error('Failed to delete application');
    }
  };

  const filteredApps = applications.filter(app => {
    const matchesSearch = 
      app.userName.toLowerCase().includes(search.toLowerCase()) ||
      app.serviceName.toLowerCase().includes(search.toLowerCase()) ||
      app.userPhone.includes(search);
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
          <input
            type="text"
            placeholder="Search by name, phone, service..."
            className="nothing-input pl-12"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Filter size={18} className="opacity-30" />
          <select
            className="nothing-input w-full md:w-48"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[var(--border)] border-t-[var(--fg)] rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredApps.map((app, i) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="nothing-card p-6 flex flex-col md:flex-row items-start md:items-center gap-6 hover:bg-[var(--muted)]/50"
            >
              <div className={cn(
                "w-12 h-12 shrink-0 rounded-full flex items-center justify-center",
                app.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                app.status === 'processing' ? 'bg-blue-500/10 text-blue-500' :
                'bg-green-500/10 text-green-500'
              )}>
                {app.status === 'pending' ? <Clock size={24} /> :
                 app.status === 'processing' ? <TrendingUp size={24} /> :
                 <CheckCircle2 size={24} />}
              </div>

              <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <UserIcon size={14} className="opacity-30" />
                    <p className="font-bold truncate">{app.userName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="opacity-30" />
                    <p className="text-sm opacity-70">{app.userPhone}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-widest opacity-30">Service</p>
                  <p className="font-medium truncate">{app.serviceName}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-widest opacity-30">Applied On</p>
                  <p className="text-sm opacity-70">{formatDate(app.createdAt as any)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
                <a
                  href={app.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nothing-button-outline p-3 rounded-full"
                  title="View Document"
                >
                  <ExternalLink size={18} />
                </a>
                
                <div className="relative group/menu">
                  <button className="nothing-button-outline p-3 rounded-full">
                    <MoreVertical size={18} />
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--bg)] border border-[var(--border)] rounded-2xl shadow-xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-10 p-2">
                    <button
                      onClick={() => handleStatusUpdate(app.id, 'pending')}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-[var(--muted)] rounded-xl flex items-center gap-2"
                    >
                      <Clock size={14} className="text-yellow-500" /> Mark Pending
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(app.id, 'processing')}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-[var(--muted)] rounded-xl flex items-center gap-2"
                    >
                      <TrendingUp size={14} className="text-blue-500" /> Mark Processing
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(app.id, 'completed')}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-[var(--muted)] rounded-xl flex items-center gap-2"
                    >
                      <CheckCircle2 size={14} className="text-green-500" /> Mark Completed
                    </button>
                    <div className="h-px bg-[var(--border)] my-2" />
                    <button
                      onClick={() => handleDelete(app.id)}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-red-500/10 text-red-500 rounded-xl flex items-center gap-2"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {filteredApps.length === 0 && (
            <div className="nothing-card text-center py-20 opacity-50">
              <AlertCircle size={48} className="mx-auto mb-4 opacity-20" />
              <p>No applications found matching your criteria.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
