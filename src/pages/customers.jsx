import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Sidebar from '../components/Sidebar';
import { Users, User } from 'lucide-react';

export default function Customers() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    async function fetchCustomers() {
      // ดึงข้อมูลชื่อลูกค้าและยอดรวมจากตาราง orders
      const { data } = await supabase.from('orders').select('customer_name, total_amount');
      
      // นำข้อมูลมาจัดกลุ่ม (Group by Name) เพื่อสรุปยอดรายคน
      const summary = data.reduce((acc, curr) => {
        if (!acc[curr.customer_name]) {
          acc[curr.customer_name] = { name: curr.customer_name, total: 0, count: 0 };
        }
        acc[curr.customer_name].total += Number(curr.total_amount);
        acc[curr.customer_name].count += 1;
        return acc;
      }, {});

      setCustomers(Object.values(summary));
    }
    fetchCustomers();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar activePage="customers" />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
          <Users className="text-blue-600" /> ข้อมูลลูกค้า
        </h1>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 font-bold text-slate-600">ชื่อลูกค้า</th>
                <th className="p-4 font-bold text-slate-600 text-center">จำนวนออเดอร์</th>
                <th className="p-4 font-bold text-slate-600 text-right">ยอดซื้อสะสม</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.map((c, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="p-4 flex items-center gap-3 font-medium text-slate-800">
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center"><User size={16}/></div>
                    {c.name}
                  </td>
                  <td className="p-4 text-center text-slate-600">{c.count} รายการ</td>
                  <td className="p-4 text-right font-bold text-blue-600">฿{c.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}