import { LayoutDashboard, Package, LogOut, ClipboardList, Users, BarChart3 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Sidebar({ activePage }) {
  const handleLogout = async () => {
    if (confirm("คุณต้องการออกจากระบบใช่หรือไม่?")) {
      await supabase.auth.signOut();
      window.location.href = "/login";
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'แดชบอร์ด', icon: <LayoutDashboard size={20}/>, path: '/dashboard' },
    { id: 'products', label: 'จัดการสินค้า', icon: <Package size={20}/>, path: '/products' },
    { id: 'orders', label: 'รายการสั่งซื้อ', icon: <ClipboardList size={20}/>, path: '/orders' },
    { id: 'customers', label: 'ลูกค้า', icon: <Users size={20}/>, path: '/customers' },
    { id: 'reports', label: 'รายงานยอดขาย', icon: <BarChart3 size={20}/>, path: '/reports' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shadow-xl sticky top-0 h-screen">
      <div className="p-6 text-white text-xl font-bold border-b border-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">X</div> 
        <span>Xaibo1e Admin</span>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <a 
            key={item.id}
            href={item.path} 
            className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
              activePage === item.id 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            {item.icon} {item.label}
          </a>
        ))}
      </nav>
      <button 
        onClick={handleLogout}
        className="p-6 border-t border-slate-800 flex items-center gap-3 text-slate-500 hover:text-red-400 transition-all cursor-pointer w-full"
      >
        <LogOut size={20}/> ออกจากระบบ
      </button>
    </aside>
  );
}