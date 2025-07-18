# PonDaiPonDee - เครื่องคำนวณค่างวดรายเดือน

แอปพลิเคชันคำนวณค่างวดรายเดือนสำหรับสินค้าต่างๆ ที่ใช้งานง่าย รวดเร็ว และแม่นยำ

## คุณสมบัติ

- 📱 **Responsive Design** - ใช้งานได้ดีบนมือถือและคอมพิวเตอร์
- 💰 **คำนวณแม่นยำ** - ใช้สูตรคำนวณมาตรฐานพร้อมการปัดเศษที่เหมาะสม
- 📊 **ประวัติการคำนวณ** - เก็บบันทึกการคำนวณทั้งหมด
- 🎨 **ธีมสีอบอุ่น** - ออกแบบด้วยสีโทนอบอุ่นที่ใช้งานง่าย
- ☁️ **Google Sheets Integration** - เก็บข้อมูลในคลาวด์ (สำหรับโปรดักชัน)

## วิธีการใช้งาน

### คำนวณค่างวด
1. กรอกราคาสินค้า
2. กรอกจำนวนเงินดาวน์ (ถ้ามี)
3. กรอกอัตราดอกเบี้ยต่อปี (%)
4. กรอกจำนวนเดือนที่ต้องการผ่อน
5. กดปุ่ม "คำนวณ"

### ดูประวัติ
- กดไอคอนประวัติที่มุมขวาบน
- ดูรายการการคำนวณที่ผ่านมาทั้งหมด

## เทคโนโลยีที่ใช้

- **React 18+** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Google Sheets API** - Data Storage

## การติดตั้งและรัน

```bash
# Clone repository
git clone https://github.com/your-username/pondaipondee-app.git

# เข้าไปในโฟลเดอร์
cd pondaipondee-app

# ติดตั้ง dependencies
npm install

# รันในโหมด development
npm run dev

# Build สำหรับ production
npm run build
```

## การ Deploy

### GitHub Pages
```bash
# Build และ deploy ไป GitHub Pages
npm run deploy
```

### Manual Deploy
```bash
# Build project
npm run build

# Upload โฟลเดอร์ dist ไปยัง hosting service
```

## Configuration

### Google Sheets API (สำหรับ Production)
1. สร้าง Google Apps Script
2. แทนที่ `YOUR_SCRIPT_ID` ใน `googleSheetsService.ts`
3. Deploy Apps Script และเปิดการเข้าถึงสาธารณะ

## สูตรการคำนวณ

```
ยอดเงินต้น = ราคาสินค้า - เงินดาวน์
ดอกเบี้ยรวม = ยอดเงินต้น × อัตราดอกเบี้ย / 100
ยอดรวมที่ต้องผ่อน = ยอดเงินต้น + ดอกเบี้ยรวม
ค่างวดรายเดือน = ยอดรวมที่ต้องผ่อน ÷ จำนวนเดือน (ปัดขึ้น)
```

## การพัฒนา

### Project Structure
```
src/
├── components/          # React Components
│   ├── Calculator/      # หน้าคำนวณ
│   ├── History/         # หน้าประวัติ
│   ├── UI/             # UI Components
│   └── Icons/          # Icon Components
├── pages/              # Page Components
├── services/           # API Services
├── utils/              # Utility Functions
└── hooks/              # Custom Hooks
```

### Scripts
- `npm run dev` - รัน development server
- `npm run build` - build สำหรับ production
- `npm run preview` - preview build version
- `npm run deploy` - deploy ไป GitHub Pages

## License

MIT License - ใช้งานได้อย่างอิสระ

## ติดต่อ

หากมีปัญหาหรือข้อเสนอแนะ กรุณาสร้าง Issue ใน GitHub Repository
