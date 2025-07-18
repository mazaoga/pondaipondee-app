# Deployment Guide - PonDaiPonDee Calculator

## เตรียมโปรเจคสำหรับ GitHub

### 1. Initialize Git Repository
```bash
git init
git add .
git commit -m "Initial commit: PonDaiPonDee Calculator"
```

### 2. Create GitHub Repository
1. ไปที่ https://github.com
2. Click "New repository"
3. ตั้งชื่อ: `pondaipondee-app`
4. เลือก Public
5. ไม่ต้องเพิ่ม README, .gitignore หรือ license
6. Click "Create repository"

### 3. Connect to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/pondaipondee-app.git
git branch -M main
git push -u origin main
```

## การ Deploy ไป GitHub Pages

### วิธีที่ 1: ใช้ GitHub Actions (แนะนำ)
1. Push โค้ดขึ้น GitHub
2. ไปที่ Settings > Pages ใน GitHub repository
3. เลือก Source: "GitHub Actions"
4. GitHub Actions จะ deploy อัตโนมัติเมื่อมีการ push ไป main branch

### วิธีที่ 2: ใช้ Command Line
```bash
# แก้ไข package.json ให้ homepage ถูกต้อง
# "homepage": "https://YOUR_USERNAME.github.io/pondaipondee-app"

# Build และ deploy
npm run deploy
```

## Configuration สำหรับ Production

### 1. อัพเดท Homepage URL
แก้ไข `package.json`:
```json
{
  "homepage": "https://YOUR_USERNAME.github.io/pondaipondee-app"
}
```

### 2. Google Sheets Integration
1. ไปที่ https://script.google.com
2. สร้าง New Project
3. Copy โค้ดจาก `scripts/google-apps-script.js`
4. Deploy as Web App:
   - Execute as: Me
   - Who has access: Anyone
5. Copy Web App URL
6. แทนที่ `YOUR_SCRIPT_ID` ใน `src/services/googleSheetsService.ts`

### 3. Enable GitHub Pages
1. ไปที่ Repository Settings
2. เลื่อนลงไปหา "Pages"
3. เลือก Source: "Deploy from a branch" หรือ "GitHub Actions"
4. เลือก Branch: "gh-pages" (สำหรับ manual deploy)

## การใช้งาน Google Sheets API

### ขั้นตอนการตั้งค่า:
1. สร้าง Google Spreadsheet ใหม่
2. เปิด Google Apps Script
3. Paste โค้ดจาก `scripts/google-apps-script.js`
4. บันทึกและ Deploy
5. อนุญาตการเข้าถึง Google Sheets
6. Copy URL มาใส่ในโค้ด

### การทดสอบ:
```javascript
// ใน Google Apps Script Editor
function testSaveCalculation() {
  // ทดสอบการบันทึกข้อมูล
}
```

## Environment Variables

สำหรับ Development:
```
NODE_ENV=development
```

สำหรับ Production:
```
NODE_ENV=production
```

## Commands ที่ใช้บ่อย

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to GitHub Pages
npm run deploy

# Lint code
npm run lint
```

## Troubleshooting

### ปัญหา: ไม่สามารถ deploy ได้
- ตรวจสอบว่า repository เป็น public
- ตรวจสอบ GitHub Pages settings
- ตรวจสอบ branch ที่ใช้ deploy

### ปัญหา: Google Sheets ไม่ทำงาน
- ตรวจสอบ CORS settings
- ตรวจสอบ permissions ของ Apps Script
- ตรวจสอบ URL ใน googleSheetsService.ts

### ปัญหา: Build error
```bash
# ลบ node_modules และติดตั้งใหม่
rm -rf node_modules
npm install
npm run build
```

## Performance Optimization

- รูปภาพจะถูก optimize อัตโนมัติ
- CSS จะถูก minify
- JavaScript จะถูก bundle และ compress
- Static files จะถูก cache

## Security Notes

- Google Sheets API key ไม่ควรเปิดเผยใน client-side code
- ใช้ Apps Script เป็น proxy สำหรับการเข้าถึงข้อมูล
- ตั้งค่า CORS ให้ถูกต้อง

## Next Steps

หลังจาก deploy แล้ว:
1. ทดสอบการใช้งานบนมือถือ
2. ทดสอบ Google Sheets integration
3. เพิ่ม Analytics (Google Analytics, etc.)
4. เพิ่ม PWA features
5. เพิ่ม error tracking (Sentry, etc.)
