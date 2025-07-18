// Google Sheets API configuration
// แทนที่ URL นี้ด้วย URL ที่ได้จาก Google Apps Script deployment
const GOOGLE_SCRIPTS_API_URL = 'https://script.google.com/macros/s/AKfycbyeGnXxiN0iX4SeAo2e5fld_rMsJpJBW7nZYA_YTkjVmNBLQrCyoTFSAIuHZ2Aa8NjX/exec';

/**
 * บันทึกข้อมูลการคำนวณลง Google Sheets
 * @param {object} calculationData - ข้อมูลการคำนวณ
 * @returns {Promise<object>} ผลการบันทึก
 */
export const saveCalculation = async (calculationData) => {
  try {
    // สร้างข้อมูลที่จะส่ง
    const data = {
      action: 'save',
      timestamp: new Date().toISOString(),
      productPrice: calculationData.productPrice,
      downPayment: calculationData.downPayment,
      interestRate: calculationData.interestRate,
      months: calculationData.months,
      totalInterest: calculationData.totalInterest,
      totalAmount: calculationData.totalAmount,
      monthlyPayment: calculationData.monthlyPayment
    };

    // สำหรับ development - จำลองการบันทึกข้อมูล
    if (import.meta.env.DEV) {
      console.log('จำลองการบันทึกข้อมูลลง Google Sheets:', data);
      
      // เก็บข้อมูลใน localStorage สำหรับการทดสอบ
      const existingData = JSON.parse(localStorage.getItem('calculationHistory') || '[]');
      const newData = {
        ...data,
        id: Date.now().toString(),
        timestamp: new Date().toISOString()
      };
      existingData.unshift(newData);
      localStorage.setItem('calculationHistory', JSON.stringify(existingData));
      
      return {
        success: true,
        message: 'บันทึกข้อมูลเรียบร้อยแล้ว',
        data: newData
      };
    }

    // สำหรับ production - เรียก Google Scripts API
    const response = await fetch(GOOGLE_SCRIPTS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      mode: 'cors'
    });

    if (!response.ok) {
      throw new Error('ไม่สามารถเชื่อมต่อ Google Sheets ได้');
    }

    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error);
    }

    return {
      success: true,
      message: 'บันทึกข้อมูลเรียบร้อยแล้ว',
      data: result.data
    };

  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล:', error);
    
    return {
      success: false,
      message: error.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล',
      error: error
    };
  }
};

/**
 * ดึงข้อมูลประวัติการคำนวณจาก Google Sheets
 * @returns {Promise<object>} ข้อมูลประวัติ
 */
export const getCalculationHistory = async () => {
  try {
    // สำหรับ development - ใช้ข้อมูลจาก localStorage
    if (import.meta.env.DEV) {
      console.log('ดึงข้อมูลจาก localStorage');
      const data = JSON.parse(localStorage.getItem('calculationHistory') || '[]');
      
      return {
        success: true,
        data: data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      };
    }

    // สำหรับ production - เรียก Google Scripts API
    const response = await fetch(`${GOOGLE_SCRIPTS_API_URL}?action=get`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors'
    });

    if (!response.ok) {
      throw new Error('ไม่สามารถเชื่อมต่อ Google Sheets ได้');
    }

    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error);
    }

    return {
      success: true,
      data: result.data || []
    };

  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
    
    return {
      success: false,
      message: error.message || 'เกิดข้อผิดพลาดในการดึงข้อมูล',
      error: error,
      data: []
    };
  }
};

/**
 * ตรวจสอบการเชื่อมต่อ Google Sheets
 * @returns {Promise<boolean>} สถานะการเชื่อมต่อ
 */
export const testConnection = async () => {
  try {
    if (import.meta.env.DEV) {
      return true;
    }

    const response = await fetch(`${GOOGLE_SCRIPTS_API_URL}?action=test`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors'
    });

    return response.ok;
  } catch (error) {
    console.error('ไม่สามารถเชื่อมต่อ Google Sheets ได้:', error);
    return false;
  }
};
