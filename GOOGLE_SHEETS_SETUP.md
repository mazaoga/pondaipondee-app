# การตั้งค่า Google Sheets สำหรับ PonDaiPonDee Calculator

## ขั้นตอนที่ 1: สร้าง Google Sheet

1. ไปที่ [Google Sheets](https://sheets.google.com)
2. คลิก "สร้างสเปรดชีตใหม่"
3. ตั้งชื่อ: "PonDaiPonDee Calculator Data"
4. สร้าง Headers ในแถวแรก:

| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| Timestamp | Product Price | Down Payment | Interest Rate | Months | Total Interest | Total Amount | Monthly Payment |

## ขั้นตอนที่ 2: สร้าง Google Apps Script

1. ใน Google Sheet ไปที่ **Extensions** → **Apps Script**
2. ลบโค้ดเดิมทั้งหมด
3. Copy โค้ดจากไฟล์ `scripts/google-apps-script.js` ในโปรเจกต์นี้
4. วางโค้ดใน Apps Script Editor
5. บันทึกโปรเจกต์ (Ctrl+S)

## ขั้นตอนที่ 3: Deploy Web App

1. คลิค **Deploy** → **New deployment**
2. ตั้งค่าดังนี้:
   - **Type**: Web app
   - **Description**: PonDaiPonDee Calculator API
   - **Execute as**: Me (ตัวคุณเอง)
   - **Who has access**: Anyone
3. คลิค **Deploy**
4. **อนุญาต permissions** เมื่อระบบขอ
5. Copy **Web app URL** ที่ได้

## ขั้นตอนที่ 4: อัพเดท URL ในแอป

1. เปิดไฟล์ `src/services/googleSheetsService.js`
2. แทนที่ `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` ด้วย URL ที่ได้จากขั้นตอนที่ 3
3. บันทึกไฟล์

## ขั้นตอนที่ 5: ทดสอบ

1. รัน `npm run dev` เพื่อเริ่มแอป
2. ลองคำนวณและบันทึกข้อมูล
3. เช็คใน Google Sheet ว่าข้อมูลถูกบันทึกหรือไม่
4. ลองดูประวัติการคำนวณ

## การแก้ปัญหา

### ปัญหา: CORS Error
- ตรวจสอบว่า Deploy แล้วและตั้งค่า "Who has access" เป็น "Anyone"
- ลอง Deploy ใหม่

### ปัญหา: Permission Denied
- ตรวจสอบว่าได้อนุญาต permissions ให้ Apps Script แล้ว
- ลองเรียกใช้ฟังก์ชัน `testSaveCalculation()` ใน Apps Script Editor

### ปัญหา: ข้อมูลไม่ปรากฏใน Sheet
- เช็คว่าชื่อ Sheet และ headers ถูกต้อง
- ดู Logs ใน Apps Script Editor (View → Logs)

## ตัวอย่าง URL ที่ถูกต้อง
```
https://script.google.com/macros/s/AKfycby...YOUR_ID.../exec
```

**หมายเหตุ**: URL นี้จะไม่เหมือนกับตัวอย่าง ให้ใช้ URL ที่ได้จาก Deploy ของคุณเอง
