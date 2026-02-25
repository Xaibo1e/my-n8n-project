import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Sidebar from '../components/Sidebar';
import { Package, ClipboardList, TrendingUp, DollarSign } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, sales: 0 });

  useEffect(() => {
    async function getStats() {
      const { count: pCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
      const { count: oCount } = await supabase.from('orders').select('*', { count: 'exact', head: true });
      const { data: salesData } = await supabase.from('orders').select('total_amount').eq('status', 'paid');
      const total = salesData?.reduce((acc, curr) => acc + Number(curr.total_amount), 0) || 0;

      setStats({ products: pCount || 0, orders: oCount || 0, sales: total });
    }
    getStats();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar activePage="dashboard" />
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-2xl font-black text-slate-800">ภาพรวมระบบ</h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white mb-4"><Package /></div>
            <p className="text-slate-500 text-sm font-bold">สินค้าทั้งหมด</p>
            <h2 className="text-3xl font-black text-slate-800">{stats.products} <span className="text-sm font-normal text-slate-400">รายการ</span></h2>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center text-white mb-4"><ClipboardList /></div>
            <p className="text-slate-500 text-sm font-bold">ออเดอร์ใหม่</p>
            <h2 className="text-3xl font-black text-slate-800">{stats.orders} <span className="text-sm font-normal text-slate-400">รายการ</span></h2>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white mb-4"><DollarSign /></div>
            <p className="text-slate-500 text-sm font-bold">ยอดขายรวม</p>
            <h2 className="text-3xl font-black text-slate-800">฿{stats.sales.toLocaleString()}</h2>
          </div>
        </div>
      </main>
    </div>
  );
}