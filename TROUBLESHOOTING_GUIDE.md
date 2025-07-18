# 🚨 แก้ปัญหา "ไม่สามารถเชื่อมต่อได้" - คู่มือฉบับสมบูรณ์

## ❗ ปัญหาที่พบ
- ข้อผิดพลาด: "ไม่สามารถเชื่อมต่อได้ - ตรวจสอบ Internet หรือ URL ของ Google Apps Script"
- สาเหตุ: Google Apps Script URL ไม่ถูกต้อง หรือยังไม่ได้ตั้งค่า

## ✅ วิธีแก้ไขแบบสมบูรณ์

### ขั้นตอนที่ 1: สร้าง Google Sheet ใหม่

1. ไปที่ https://sheets.google.com
2. คลิก "+ สร้าง" → "Spreadsheet ว่าง"
3. ตั้งชื่อ: **PonDaiPonDee_Calculator**
4. ใส่ Headers ในแถวแรก (A1 ถึง I1):

```
A1: Timestamp
B1: Product Price  
C1: Down Payment
D1: Principal
E1: Interest Rate
F1: Months
G1: Total Interest
H1: Total Amount
I1: Monthly Payment
```

### ขั้นตอนที่ 2: สร้าง Google Apps Script

1. ใน Google Sheet ไปที่ **Extensions** → **Apps Script**
2. ลบโค้ดเดิมทั้งหมด
3. Copy โค้ดจากไฟล์ `UPDATED_GOOGLE_APPS_SCRIPT.js` ในโปรเจกต์นี้
4. วางลงใน Apps Script Editor
5. บันทึก (Ctrl+S) และตั้งชื่อโปรเจกต์: **PonDaiPonDee API**

### ขั้นตอนที่ 3: ทดสอบและอนุญาต Permissions

1. ใน Apps Script Editor เลือกฟังก์ชัน `testFunction` จาก dropdown
2. กดปุ่ม **Run** (▶️)
3. **ระบบจะขออนุญาต permissions - ต้องอนุญาตทั้งหมด!**
   - คลิก "Review permissions"
   - เลือก Google Account ของคุณ
   - คลิก "Advanced"
   - คลิก "Go to PonDaiPonDee API (unsafe)" 
   - คลิก "Allow"
4. ดู **Execution log** ว่าไม่มี error

### ขั้นตอนที่ 4: Deploy เป็น Web App

1. กดปุ่ม **Deploy** → **New deployment**
2. คลิกไอคอน ⚙️ และเลือก **Web app**
3. ตั้งค่าดังนี้:
   - **Description**: PonDaiPonDee Calculator API v2
   - **Execute as**: Me (ตัวคุณเอง)
   - **Who has access**: **Anyone** ⚠️ (สำคัญมาก!)
4. กดปุ่ม **Deploy**
5. **Copy Web app URL** ที่ได้

### ขั้นตอนที่ 5: อัพเดท URL ในแอป

1. เปิดไฟล์ `src/services/googleSheetsService.js`
2. แทนที่ `'PASTE_NEW_URL_HERE'` ด้วย URL ที่ได้จากขั้นตอนที่ 4
3. บันทึกไฟล์

### ขั้นตอนที่ 6: ทดสอบ

1. รันแอป: `npm run dev`
2. ไปที่หน้า Debug: http://localhost:5174/debug
3. กดปุ่ม "ทดสอบ URL" → ต้องได้ ✅
4. กดปุ่ม "ทดสอบบันทึกข้อมูล" → ต้องสำเร็จ
5. เช็คใน Google Sheet ว่ามีข้อมูลใหม่

## 🔍 การแก้ปัญหาเพิ่มเติม

### หาก "ทดสอบ URL" ยัง Failed:

1. **ตรวจสอบ Deploy Settings**:
   - ไปที่ Apps Script → Deploy → Manage deployments
   - เช็คว่า "Who has access" เป็น "Anyone"
   - หากไม่ใช่ให้แก้ไขและ Deploy ใหม่

2. **ตรวจสอบ Permissions**:
   - ไปที่ Apps Script → Settings → Executions
   - ตรวจสอบว่าไม่มี Error

3. **ลอง Deploy ใหม่**:
   - Deploy → New deployment
   - เปลี่ยน Version เป็น "New"
   - Copy URL ใหม่

### หาก "ทดสอบบันทึกข้อมูล" Failed:

1. **ตรวจสอบ Google Sheet Headers**:
   - ต้องมี Headers ครบ 9 คอลัมน์ตามที่ระบุ
   - ไม่ควรมีข้อมูลอื่นในแถวแรก

2. **ตรวจสอบ Script Logs**:
   - ใน Apps Script ไปที่ View → Logs
   - ดู Error messages

3. **ลองรัน testFunction อีกครั้ง**:
   - เลือก `testFunction` และกด Run
   - ดู Execution log

## 📋 Checklist สำหรับการแก้ปัญหา

- [ ] สร้าง Google Sheet ใหม่พร้อม Headers ครบ
- [ ] Copy โค้ด Apps Script ใหม่ทั้งหมด
- [ ] รัน testFunction และอนุญาต permissions
- [ ] Deploy เป็น Web app กับ "Anyone" access
- [ ] Copy URL ใหม่ไปใส่ในโค้ด
- [ ] ทดสอบใน Debug page
- [ ] เช็คข้อมูลใน Google Sheet

## 🆘 หากยังไม่ได้ผล

ส่งข้อมูลเหล่านี้มา:
1. Screenshot ของ Deploy settings
2. Error message จาก Debug page
3. Execution logs จาก Apps Script
4. Screenshot ของ Google Sheet Headers
