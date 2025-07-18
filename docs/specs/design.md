# Design Document - PonDaiPonDee Calculator

## Overview

PonDaiPonDee is a React-based installment payment calculator that provides a simple, mobile-friendly interface for calculating monthly payment amounts. The application features integration with Google Sheets for data persistence and follows a minimal design philosophy with warm color tones.

## Architecture

### Technology Stack
- **Frontend Framework:** React 18+ with functional components and hooks
- **Styling:** Tailwind CSS for responsive design and utility-first styling
- **Data Storage:** Google Sheets API for persistent storage
- **Build Tool:** Vite for fast development and optimized builds
- **State Management:** React useState and useEffect hooks
- **HTTP Client:** Fetch API or Axios for Google Sheets integration

### Application Structure
```
src/
├── components/
│   ├── Calculator/
│   │   ├── CalculatorForm.jsx
│   │   └── CalculationResult.jsx
│   ├── History/
│   │   ├── HistoryPage.jsx
│   │   └── HistoryItem.jsx
│   ├── UI/
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   └── Layout.jsx
│   └── Icons/
│       └── HistoryIcon.jsx
├── services/
│   └── googleSheetsService.js
├── utils/
│   └── calculations.js
├── hooks/
│   └── useGoogleSheets.js
└── App.jsx
```

## Components and Interfaces

### Main Calculator Component (CalculatorForm)
**Props:** None
**State:**
- `productPrice`: number - ราคาสินค้า
- `downPayment`: number - เงินดาวน์
- `interestRate`: number - ดอกเบี้ยต่อปี (%)
- `months`: number - จำนวนเดือน (default: 12)
- `monthlyPayment`: number - ค่างวดรายเดือน
- `isCalculating`: boolean - สถานะการคำนวณ
- `errors`: object - ข้อผิดพลาดในการกรอกข้อมูล

**Methods:**
- `handleCalculate()`: คำนวณค่างวดและบันทึกข้อมูล
- `validateInputs()`: ตรวจสอบความถูกต้องของข้อมูล
- `resetForm()`: รีเซ็ตฟอร์ม

### History Component (HistoryPage)
**Props:** None
**State:**
- `historyData`: array - ข้อมูลประวัติการคำนวณ
- `isLoading`: boolean - สถานะการโหลดข้อมูล
- `error`: string - ข้อผิดพลาดในการโหลด

**Methods:**
- `fetchHistory()`: ดึงข้อมูลจาก Google Sheets
- `formatDate()`: จัดรูปแบบวันที่

### Google Sheets Service
**Functions:**
- `saveCalculation(data)`: บันทึกข้อมูลการคำนวณ
- `getCalculationHistory()`: ดึงข้อมูลประวัติ
- `initializeSheet()`: ตั้งค่าเริ่มต้น Google Sheets

## Data Models

### Calculation Data Model
```javascript
{
  id: string,           // Unique identifier
  timestamp: Date,      // วันที่และเวลาที่คำนวณ
  productPrice: number, // ราคาสินค้า (บาท)
  downPayment: number,  // เงินดาวน์ (บาท)
  interestRate: number, // ดอกเบี้ยต่อปี (%)
  months: number,       // จำนวนเดือน
  totalInterest: number,    // ดอกเบี้ยรวม (บาท)
  totalAmount: number,      // ยอดรวมที่ต้องผ่อน (บาท)
  monthlyPayment: number    // ค่างวดรายเดือน (บาท)
}
```

### Google Sheets Schema
**Sheet Name:** "PonDaiPonDee_Calculations"
**Columns:**
- A: Timestamp (วันที่เวลา)
- B: Product Price (ราคาสินค้า)
- C: Down Payment (เงินดาวน์)
- D: Interest Rate (ดอกเบี้ย %)
- E: Months (จำนวนเดือน)
- F: Total Interest (ดอกเบี้ยรวม)
- G: Total Amount (ยอดรวม)
- H: Monthly Payment (ค่างวดรายเดือน)

## Calculation Logic

### Interest Calculation Formula
```javascript
const calculateMonthlyPayment = (productPrice, downPayment, interestRate, months) => {
  // คำนวณยอดเงินต้น
  const principal = productPrice - downPayment;
  
  // คำนวณดอกเบี้ยรวม
  const totalInterest = principal * (interestRate / 100);
  
  // คำนวณยอดรวมที่ต้องผ่อน
  const totalAmount = totalInterest + principal;
  
  // คำนวณค่างวดรายเดือน (ปัดขึ้น)
  const monthlyPayment = Math.ceil(totalAmount / months);
  
  return {
    totalInterest,
    totalAmount,
    monthlyPayment
  };
};
```

## UI/UX Design

### Color Palette (Tailwind CSS Classes)
- **Primary Background:** `bg-blue-50` (ฟ้าอ่อน)
- **Secondary Background:** `bg-green-50` (เขียวมินต์อ่อน)
- **Accent:** `bg-amber-50` (ครีม)
- **Text Primary:** `text-gray-800` (เทาเข้ม)
- **Text Secondary:** `text-gray-600` (เทาอ่อน)
- **Borders:** `border-gray-200` (เทาอ่อน)
- **Buttons:** `bg-blue-500 hover:bg-blue-600` (ฟ้า)

### Typography
- **Headings:** `font-semibold text-lg md:text-xl`
- **Body Text:** `text-base`
- **Labels:** `text-sm font-medium text-gray-700`
- **Numbers:** `font-mono` for better readability

### Layout Structure

#### Main Page Layout
```
┌─────────────────────────────────┐
│  PonDaiPonDee        [History]  │ <- Header
├─────────────────────────────────┤
│                                 │
│  [ราคาสินค้า Input]              │
│  [เงินดาวน์ Input]               │
│  [ดอกเบี้ย% Input]               │
│  [จำนวนเดือน Input]             │
│                                 │
│  [คำนวณ Button]                 │
│                                 │
│  [ผลลัพธ์การคำนวณ]               │
│                                 │
└─────────────────────────────────┘
```

#### History Page Layout
```
┌─────────────────────────────────┐
│  [← Back] ประวัติการคำนวณ        │ <- Header
├─────────────────────────────────┤
│                                 │
│  ┌─────────────────────────────┐ │
│  │ 18/07/2025 14:30           │ │
│  │ ราคา: 100,000 บาท          │ │
│  │ ดาวน์: 20,000 บาท          │ │
│  │ ดอกเบี้ย: 5% | 12 เดือน    │ │
│  │ ค่างวด: 7,000 บาท/เดือน    │ │
│  └─────────────────────────────┘ │
│                                 │
│  [รายการอื่นๆ...]                │
│                                 │
└─────────────────────────────────┘
```

### Responsive Design Breakpoints
- **Mobile:** `sm:` (640px+) - Single column layout
- **Tablet:** `md:` (768px+) - Optimized spacing
- **Desktop:** `lg:` (1024px+) - Maximum width container

## Error Handling

### Input Validation
- **Required Fields:** ตรวจสอบว่าทุกช่องมีข้อมูล
- **Numeric Validation:** ตรวจสอบว่าเป็นตัวเลขที่ถูกต้อง
- **Range Validation:** 
  - ราคาสินค้า > 0
  - เงินดาวน์ >= 0 และ < ราคาสินค้า
  - ดอกเบี้ย >= 0 และ <= 100
  - จำนวนเดือน >= 1 และ <= 120

### Google Sheets Integration Errors
- **Network Errors:** แสดงข้อความ "ไม่สามารถเชื่อมต่ออินเทอร์เน็ตได้"
- **API Errors:** แสดงข้อความ "เกิดข้อผิดพลาดในการบันทึกข้อมูล"
- **Authentication Errors:** แสดงข้อความ "ไม่สามารถเข้าถึง Google Sheets ได้"

### Error Display Strategy
- **Inline Validation:** แสดงข้อผิดพลาดใต้ช่องกรอกข้อมูล
- **Toast Notifications:** สำหรับข้อผิดพลาดของระบบ
- **Loading States:** แสดงสถานะการโหลดขณะบันทึกข้อมูล

## Testing Strategy

### Unit Testing
- **Calculation Logic:** ทดสอบสูตรการคำนวณด้วย Jest
- **Input Validation:** ทดสอบการตรวจสอบข้อมูล
- **Utility Functions:** ทดสอบฟังก์ชันช่วยต่างๆ

### Integration Testing
- **Google Sheets API:** ทดสอบการบันทึกและดึงข้อมูล
- **Component Integration:** ทดสอบการทำงานร่วมกันของ components

### User Acceptance Testing
- **Mobile Responsiveness:** ทดสอบบนอุปกรณ์มือถือจริง
- **Calculation Accuracy:** ทดสอบความถูกต้องของการคำนวณ
- **User Flow:** ทดสอบการใช้งานจริงตั้งแต่เริ่มต้นจนจบ

### Performance Testing
- **Load Time:** ทดสอบเวลาโหลดหน้าเว็บ
- **Google Sheets Response:** ทดสอบเวลาตอบสนองของ API
- **Mobile Performance:** ทดสอบประสิทธิภาพบนมือถือ