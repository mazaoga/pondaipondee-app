export interface CalculationData {
  productPrice: number;
  downPayment: number;
  interestRate: number;
  months: number;
}

export interface CalculationResult {
  principal: number;
  totalInterest: number;
  totalAmount: number;
  monthlyPayment: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * คำนวณค่างวดรายเดือน
 * @param productPrice - ราคาสินค้า (บาท)
 * @param downPayment - เงินดาวน์ (บาท)
 * @param interestRate - ดอกเบี้ยต่อปี (เปอร์เซ็นต์)
 * @param months - จำนวนเดือน
 * @returns ผลการคำนวณ
 */
export const calculateMonthlyPayment = (
  productPrice: number, 
  downPayment: number, 
  interestRate: number, 
  months: number
): CalculationResult => {
  // คำนวณยอดเงินต้น
  const principal = productPrice - downPayment;
  
  // คำนวณดอกเบี้ยรวม
  const totalInterest = principal * (interestRate / 100);
  
  // คำนวณยอดรวมที่ต้องผ่อน
  const totalAmount = totalInterest + principal;
  
  // คำนวณค่างวดรายเดือน (ปัดขึ้น)
  const monthlyPayment = Math.ceil(totalAmount / months);
  
  return {
    principal,
    totalInterest,
    totalAmount,
    monthlyPayment
  };
};

/**
 * ตรวจสอบความถูกต้องของข้อมูลที่กรอก
 * @param data - ข้อมูลที่ต้องตรวจสอบ
 * @returns ผลการตรวจสอบ
 */
export const validateCalculationData = (data: CalculationData): ValidationResult => {
  const errors: Record<string, string> = {};
  const { productPrice, downPayment, interestRate, months } = data;

  // ตรวจสอบราคาสินค้า
  if (!productPrice || productPrice <= 0) {
    errors.productPrice = 'กรุณากรอกราคาสินค้าให้ถูกต้อง';
  }

  // ตรวจสอบเงินดาวน์
  if (downPayment < 0) {
    errors.downPayment = 'เงินดาวน์ต้องมากกว่าหรือเท่ากับ 0';
  }
  if (downPayment >= productPrice && productPrice > 0) {
    errors.downPayment = 'เงินดาวน์ต้องน้อยกว่าราคาสินค้า';
  }

  // ตรวจสอบดอกเบี้ย
  if (!interestRate || interestRate < 0 || interestRate > 100) {
    errors.interestRate = 'กรุณากรอกอัตราดอกเบี้ย 0-100%';
  }

  // ตรวจสอบจำนวนเดือน
  if (!months || months < 1 || months > 120) {
    errors.months = 'จำนวนเดือนต้องอยู่ระหว่าง 1-120 เดือน';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * จัดรูปแบบตัวเลขเป็นสกุลเงินไทย
 * @param amount - จำนวนเงิน
 * @returns จำนวนเงินที่จัดรูปแบบแล้ว
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * จัดรูปแบบตัวเลขด้วยคอมมา
 * @param number - ตัวเลข
 * @returns ตัวเลขที่จัดรูปแบบแล้ว
 */
export const formatNumber = (number: number): string => {
  return new Intl.NumberFormat('th-TH').format(number);
};

/**
 * แปลงสตริงเป็นตัวเลข
 * @param value - ค่าที่ต้องแปลง
 * @returns ตัวเลขที่แปลงแล้ว
 */
export const parseNumber = (value: string): number => {
  const number = parseFloat(value);
  return isNaN(number) ? 0 : number;
};
