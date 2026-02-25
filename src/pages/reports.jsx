import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Sidebar from '../components/Sidebar';
import { BarChart3, Calendar } from 'lucide-react';

export default function Reports() {
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    async function fetchReport() {
      const { data } = await supabase
        .from('orders')
        .select('created_at, total_amount')
        .eq('status', 'paid'); // เอาเฉพาะที่จ่ายแล้ว

      // จัดกลุ่มตามวันที่ (YYYY-MM-DD)
      const daily = data.reduce((acc, curr) => {
        const date = new Date(curr.created_at).toLocaleDateString('th-TH');
        acc[date] = (acc[date] || 0) + Number(curr.total_amount);
        return acc;
      }, {});

      setReportData(Object.entries(daily).map(([date, amount]) => ({ date, amount })));
    }
    fetchReport();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar activePage="reports" />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
          <BarChart3 className="text-blue-600" /> รายงานยอดขายรายวัน
        </h1>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden max-w-2xl">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 font-bold text-slate-600">วันที่</th>
                <th className="p-4 font-bold text-slate-600 text-right">ยอดรวม</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reportData.map((d, i) => (
                <tr key={i} className="hover:bg-green-50/50">
                  <td className="p-4 text-slate-700 flex items-center gap-2"><Calendar size={16}/> {d.date}</td>
                  <td className="p-4 text-right font-bold text-green-600">฿{d.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}