import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ShoppingBag, CheckCircle2, Upload } from 'lucide-react';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [slipFile, setSlipFile] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*');
    if (data) setProducts(data);
  };

  // ปรับในไฟล์ shop.jsx 
  const handleOrder = async (e) => {
  e.preventDefault();

  if (!selectedProduct || !slipFile) {
    return alert('กรุณาเลือกสินค้าและแนบสลิป');
  }

  setLoading(true);

  try {
    //สร้างชื่อไฟล์จาก timestamp
    const fileExt = slipFile.name.split('.').pop();
    const fileName = `order-${Date.now()}.${fileExt}`;

    //Upload ไฟล์ไปที่ Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('slips')
      .upload(fileName, slipFile, {
        upsert: true,
      });

    if (uploadError) throw uploadError;

    //ดึง public URL ของไฟล์
    const { data: urlData } = supabase.storage
      .from('slips')
      .getPublicUrl(fileName);

    const publicUrl = urlData.publicUrl;

    //บันทึกข้อมูลลงตาราง orders
    const { error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          customer_name: customerName,
          customer_email: customerEmail,
          total_amount: selectedProduct.price,
          status: 'pending',
          slip_url: publicUrl,
        },
      ]);

    if (orderError) throw orderError;

    setSuccess(true);
  } catch (error) {
    alert('เกิดข้อผิดพลาด: ' + error.message);
  } finally {
    setLoading(false);
  }
};

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
        <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full">
          <CheckCircle2 size={80} className="text-green-500 mx-auto mb-6" />
          <h2 className="text-2xl font-black text-slate-800 mb-2">สั่งซื้อสำเร็จ!</h2>
          <p className="text-slate-500">ขอบคุณที่คุณอุดหนุน เราจะรีบตรวจสอบยอดเงินและส่งอีเมลยืนยันให้คุณโดยเร็ว</p>
          <button onClick={() => window.location.reload()} className="mt-8 text-blue-600 font-bold">กลับหน้าหลัก</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <header className="max-w-4xl mx-auto mb-10 text-center">
        <h1 className="text-3xl font-black text-slate-800 flex items-center justify-center gap-2">
          <ShoppingBag className="text-blue-600" /> ร้านค้าออนไลน์
        </h1>
        <p className="text-slate-500">เลือกสินค้าที่คุณต้องการสั่งซื้อ</p>
      </header>

      <main className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        {/* ฝั่งเลือกสินค้า */}
        <div className="grid gap-4">
          {products.map(product => (
            <div 
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                selectedProduct?.id === product.id ? 'border-blue-500 bg-blue-50' : 'border-white bg-white'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-slate-800">{product.name}</h3>
                  <p className="text-sm text-slate-500">{product.unit}</p>
                </div>
                <div className="text-xl font-black text-blue-600">฿{product.price}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ฝั่งแบบฟอร์มสั่งซื้อ */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <form onSubmit={handleOrder} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">ชื่อ-นามสกุล</label>
              <input required type="text" className="w-full p-3 rounded-xl border border-slate-200" 
                value={customerName} onChange={e => setCustomerName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">อีเมล (สำหรับรับใบเสร็จ)</label>
              <input required type="email" className="w-full p-3 rounded-xl border border-slate-200" 
                value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} />
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-center relative">
              <Upload className="mx-auto text-slate-400 mb-2" />
              <p className="text-xs text-slate-500">แนบรูปสลิปโอนเงินที่นี่</p>
              <input required type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={e => setSlipFile(e.target.files[0])} />
              {slipFile && <p className="mt-2 text-xs font-bold text-green-600">เลือกไฟล์แล้ว: {slipFile.name}</p>}
            </div>
            <button 
              disabled={loading}
              className="w-full bg-blue-600 text-white p-4 rounded-2xl font-black text-lg shadow-lg hover:bg-blue-700 disabled:bg-slate-300"
            >
              {loading ? 'กำลังสั่งซื้อ...' : 'ยืนยันการสั่งซื้อ'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}