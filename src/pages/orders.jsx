import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Sidebar from '../components/Sidebar';
import { ClipboardList, Eye, CheckCircle, XCircle, Search } from 'lucide-react';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [selectedSlip, setSelectedSlip] = useState(null); 

  // ดึงข้อมูลคำสั่งซื้อ
  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setOrders(data);
  };

  useEffect(() => { fetchOrders(); }, []);

  // ฟังก์ชันอัปเดตสถานะ (เช่น กดรับยอดเงิน)
  const updateStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', id);
    if (!error) fetchOrders();
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar activePage="orders" />

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <ClipboardList className="text-blue-600" /> รายการสั่งซื้อ
          </h1>
          <p className="text-slate-500 text-sm">ตรวจสอบสลิปและยืนยันการชำระเงินจากลูกค้า</p>
        </header>

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-200">
              <tr>
                <th className="p-5 font-bold text-slate-600 text-sm uppercase">ลูกค้า</th>
                <th className="p-5 font-bold text-slate-600 text-sm uppercase">ยอดรวม</th>
                <th className="p-5 font-bold text-slate-600 text-sm uppercase text-center">สถานะ</th>
                <th className="p-5 font-bold text-slate-600 text-sm uppercase text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.length > 0 ? orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-5">
                    <p className="font-semibold text-slate-800">{order.customer_name}</p>
                    <p className="text-xs text-slate-400">{new Date(order.created_at).toLocaleString('th-TH')}</p>
                  </td>
                  <td className="p-5 font-bold text-blue-600">฿{order.total_amount.toLocaleString()}</td>
                  <td className="p-5 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      order.status === 'paid' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {order.status === 'paid' ? 'ชำระเงินแล้ว' : 'รอตรวจสอบ'}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => setSelectedSlip(order.slip_url)} 
                        className="p-2 text-slate-400 hover:text-blue-600 bg-slate-100 rounded-lg transition-all"
                        title="ดูสลิป"
                      >
                        <Eye size={18} />
                      </button>

                      {order.status !== 'paid' && (
                        <button 
                          onClick={() => updateStatus(order.id, 'paid')}
                          className="p-2 text-white bg-green-500 hover:bg-green-600 rounded-lg transition-all"
                          title="ยืนยันยอด"
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="p-20 text-center text-slate-400">
                    <ClipboardList size={48} className="mx-auto mb-4 opacity-10" />
                    <p>ยังไม่มีรายการสั่งซื้อเข้ามาในขณะนี้</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* ส่วน Modal สำหรับแสดงรูปสลิป (เด้งขึ้นมาทับหน้าจอ) */}
      {selectedSlip && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100]"
          onClick={() => setSelectedSlip(null)} 
        >
          <div className="bg-white p-2 rounded-2xl max-w-sm w-full relative animate-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
            <img src={selectedSlip} alt="Slip" className="w-full rounded-xl shadow-inner" />
            <button 
              onClick={() => setSelectedSlip(null)}
              className="absolute -top-3 -right-3 bg-red-500 text-white w-8 h-8 rounded-full shadow-lg font-bold flex items-center justify-center hover:bg-red-600"
            >✕</button>
            <p className="text-center py-2 text-slate-400 text-xs">คลิกข้างนอกเพื่อปิด</p>
          </div>
        </div>
      )}
    </div>
  );
}