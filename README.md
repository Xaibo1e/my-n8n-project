# Order Automation Project (n8n + Supabase)

โปรเจกต์ระบบจัดการออเดอร์อัตโนมัติ เชื่อมต่อฐานข้อมูล Supabase และใช้ n8n ในการทำ Automation

### ส่วนประกอบของโปรเจกต์:
- **n8n Workflow**: ไฟล์ `workflow.json` สำหรับนำเข้าสู่ระบบ n8n
- **Frontend**: พัฒนาด้วย React (เชื่อมต่อ Supabase)
- **Database**: ใช้ Supabase ในการเก็บข้อมูลออเดอร์

### วิธีการใช้งาน n8n:
1. Import ไฟล์ `workflow.json` เข้าสู่ n8n
2. ตั้งค่า Credentials สำหรับ Supabase และ Gmail
3. ระบบจะดึงข้อมูลจากตาราง `orders` มาสรุปยอดและส่งอีเมลอัตโนมัติ
