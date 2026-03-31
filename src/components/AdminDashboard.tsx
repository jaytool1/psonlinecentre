import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { Service, Application } from '../types';
import { 
  Briefcase, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  ArrowRight,
  Plus
} from 'lucide-react';
import { motion } from 'motion/react';
import { formatDate, cn } from '../lib/utils';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [services, setServices] = useState<Service[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const qServices = query(collection(db, 'services'));
    const qApps = query(collection(db, 'applications'), orderBy('createdAt', 'desc'));

    const unsubServices = onSnapshot(qServices, (snapshot) => {
      setServices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service)));
    });

    const unsubApps = onSnapshot(qApps, (snapshot) => {
      setApplications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Application)));
      setLoading(false);
    });

    return () => {
      unsubServices();
      unsubApps();
    };
  }, []);

  const stats = [
    { name: 'Total Services', value: services.length, icon: Briefcase, color: 'text-blue-500' },
    { name: 'Total Applications', value: applications.length, icon: FileText, color: 'text-purple-500' },
    { name: 'Pending', value: applications.filter(a => a.status === 'pending').length, icon: Clock, color: 'text-yellow-500' },
    { name: 'Completed', value: applications.filter(a => a.status === 'completed').length, icon: CheckCircle2, color: 'text-green-500' },
  ];

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[var(--border)] border-t-[var(--fg)] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="nothing-card flex items-center gap-6"
          >
            <div className={stat.color}>
              <stat.icon size={32} />
            </div>
            <div>
              <p className="text-sm opacity-50 font-medium">{stat.name}</p>
              <h3 className="text-3xl font-bold font-mono tracking-tighter">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Recent Applications */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold font-mono uppercase tracking-widest">Recent Applications</h3>
            <Link to="/admin/applications" className="text-sm font-medium hover:underline flex items-center gap-2">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="space-y-4">
            {applications.slice(0, 5).map((app, i) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="nothing-card p-4 flex items-center gap-4 hover:bg-[var(--muted)]"
              >
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  app.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                  app.status === 'processing' ? 'bg-blue-500/10 text-blue-500' :
                  'bg-green-500/10 text-green-500'
                )}>
                  {app.status === 'pending' ? <Clock size={20} /> :
                   app.status === 'processing' ? <TrendingUp size={20} /> :
                   <CheckCircle2 size={20} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold truncate">{app.userName}</p>
                  <p className="text-xs opacity-50 truncate">{app.serviceName}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono">{formatDate(app.createdAt as any)}</p>
                  <span className={cn(
                    "text-[10px] uppercase font-bold px-2 py-0.5 rounded-full",
                    app.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                    app.status === 'processing' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                    'bg-green-500/10 text-green-500 border border-green-500/20'
                  )}>
                    {app.status}
                  </span>
                </div>
              </motion.div>
            ))}
            {applications.length === 0 && (
              <div className="nothing-card text-center py-10 opacity-50">
                <FileText size={48} className="mx-auto mb-4 opacity-20" />
                <p>No applications yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold font-mono uppercase tracking-widest">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-4">
            <Link to="/admin/services" className="nothing-card p-6 flex flex-col items-center text-center gap-4 hover:bg-[var(--muted)] transition-all">
              <div className="w-12 h-12 bg-[var(--fg)] text-[var(--bg)] rounded-full flex items-center justify-center">
                <Plus size={24} />
              </div>
              <div>
                <p className="font-bold">Add New Service</p>
                <p className="text-xs opacity-50">Create a new service offering</p>
              </div>
            </Link>
            
            <div className="nothing-card p-6 bg-[var(--muted)] border-dashed border-2">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle size={20} className="text-yellow-500" />
                <p className="font-bold text-sm">Admin Tip</p>
              </div>
              <p className="text-xs opacity-70 leading-relaxed">
                Regularly check pending applications to ensure quick service delivery to your customers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
