import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Sidebar from '../components/Sidebar';
import { Plus, Trash2, Edit3, CheckCircle2 } from 'lucide-react';

export default function Product() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', price: '', unit: '', is_active: true });

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setProducts(data);
  };

  useEffect(() => { fetchProducts(); }, []);

  const openEditModal = (product) => {
    setEditingId(product.id);
    setFormData({ name: product.name, price: product.price, unit: product.unit, is_active: product.is_active });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: '', price: '', unit: '', is_active: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Number(formData.price) < 0) {
      alert("❌ ราคาสินค้าต้องไม่ติดลบ");
      return; 
    }

    if (editingId) {
      const { error } = await supabase.from('products').update(formData).eq('id', editingId);
      if (!error) fetchProducts();
    } else {
      const { error } = await supabase.from('products').insert([formData]);
      if (!error) fetchProducts();
    }
    handleCloseModal();
  };

  const handleDelete = async (id) => {
    if (window.confirm('⚠️ ยืนยันการลบสินค้า?')) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (!error) fetchProducts();
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar activePage="products" />
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-800">📦 จัดการสินค้า</h1>
            <p className="text-slate-500 text-sm">เพิ่มและแก้ไขข้อมูลสินค้าให้เป็นปัจจุบัน</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-lg font-bold">
            <Plus size={20}/> เพิ่มสินค้าใหม่
          </button>
        </header>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-200">
              <tr>
                <th className="p-5 font-bold text-slate-600 text-sm uppercase">รายการ</th>
                <th className="p-5 font-bold text-slate-600 text-sm uppercase">ราคา</th>
                <th className="p-5 font-bold text-slate-600 text-sm uppercase text-center">สถานะ</th>
                <th className="p-5 font-bold text-slate-600 text-sm uppercase text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="p-5 font-semibold text-slate-800">{p.name}</td>
                  <td className="p-5"><span className="text-blue-600 font-bold">฿{p.price}</span> / {p.unit}</td>
                  <td className="p-5 text-center">
                    <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1">
                      <CheckCircle2 size={12} /> พร้อมขาย
                    </span>
                  </td>
                  <td className="p-5 text-right flex justify-end gap-2">
                    {/* ปุ่มแก้ไข: เรียกฟังก์ชัน openEditModal */}
                    <button onClick={() => openEditModal(p)} className="p-2 text-slate-400 hover:text-blue-600 bg-slate-50 rounded-lg transition-all" title="แก้ไข">
                      <Edit3 size={18}/>
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="p-2 text-slate-400 hover:text-red-600 bg-slate-50 rounded-lg transition-all" title="ลบ">
                      <Trash2 size={18}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal - ใช้ร่วมกันทั้งเพิ่มและแก้ไข */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold mb-6">{editingId ? '📝 แก้ไขสินค้า' : '✨ เพิ่มสินค้าใหม่'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                type="text" placeholder="ชื่อสินค้า" required value={formData.name}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="number" 
                  placeholder="ราคา" 
                  required 
                  min="0" 
                  value={formData.price}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={e => setFormData({...formData, price: e.target.value})}
                />
                <input 
                  type="text" placeholder="หน่วย" required value={formData.unit}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={e => setFormData({...formData, unit: e.target.value})}
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={handleCloseModal} className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl">ยกเลิก</button>
                <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200">บันทึก</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}