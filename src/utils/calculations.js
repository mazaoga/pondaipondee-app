/**
 * คำนวณค่างวดรายเดือน
 * @param {number} productPrice - ราคาสินค้า (บาท)
 * @param {number} downPayment - เงินดาวน์ (บาท)
 * @param {number} interestRate - ดอกเบี้ยต่อปี (เปอร์เซ็นต์)
 * @param {number} months - จำนวนเดือน
 * @returns {object} ผลการคำนวณ
 */
export const calculateMonthlyPayment = (productPrice, downPayment, interestRate, months) => {
  // คำนวณยอดเงินต้น
  const principal = productPrice - downPayment;
  
  // คำนวณระยะเวลาเป็นปี
  const years = months / 12;
  
  // คำนวณดอกเบี้ยรวม (Simple Interest: P * R * T)
  const totalInterest = principal * (interestRate / 100) * years;
  
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
 * @param {object} data - ข้อมูลที่ต้องตรวจสอบ
 * @returns {object} ผลการตรวจสอบ
 */
export const validateCalculationData = (data) => {
  const errors = {};
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
 * @param {number} amount - จำนวนเงิน
 * @returns {string} จำนวนเงินที่จัดรูปแบบแล้ว
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * จัดรูปแบบตัวเลขด้วยคอมมา
 * @param {number} number - ตัวเลข
 * @returns {string} ตัวเลขที่จัดรูปแบบแล้ว
 */
export const formatNumber = (number) => {
  return new Intl.NumberFormat('th-TH').format(number);
};

/**
 * แปลงสตริงเป็นตัวเลข
 * @param {string} value - ค่าที่ต้องแปลง
 * @returns {number} ตัวเลขที่แปลงแล้ว
 */
export const parseNumber = (value) => {
  const number = parseFloat(value);
  return isNaN(number) ? 0 : number;
};
