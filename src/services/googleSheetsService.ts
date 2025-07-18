// Google Sheets API configuration
const GOOGLE_SCRIPTS_API_URL = 'https://script.google.com/macros/s/AKfycbxowUPHpmOY3K1_UTAcRnNBBKNZXunnVXBCgP1E_RuOwcmAMh-CTrIVlbdOTP-sl4hL/exec';

export interface CalculationRecord {
  id?: string;
  timestamp: string;
  productPrice: number;
  downPayment: number;
  principal: number;
  interestRate: number;
  months: number;
  totalInterest: number;
  totalAmount: number;
  monthlyPayment: number;
}

export interface ServiceResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: any;
}

/**
 * บันทึกข้อมูลการคำนวณลง Google Sheets
 * @param calculationData - ข้อมูลการคำนวณ
 * @returns ผลการบันทึก
 */
export const saveCalculation = async (calculationData: CalculationRecord): Promise<ServiceResponse<CalculationRecord>> => {
  try {
    // สร้างข้อมูลที่จะส่ง
    const data = {
      action: 'save',
      timestamp: new Date().toISOString(),
      productPrice: calculationData.productPrice,
      downPayment: calculationData.downPayment,
      principal: calculationData.principal,
      interestRate: calculationData.interestRate,
      months: calculationData.months,
      totalInterest: calculationData.totalInterest,
      totalAmount: calculationData.totalAmount,
      monthlyPayment: calculationData.monthlyPayment
    };

    // สำหรับ development - จำลองการบันทึกข้อมูล
    if (process.env.NODE_ENV === 'development') {
      console.log('จำลองการบันทึกข้อมูลลง Google Sheets:', data);
      
      // เก็บข้อมูลใน localStorage สำหรับการทดสอบ
      const existingData = JSON.parse(localStorage.getItem('calculationHistory') || '[]');
      const newData: CalculationRecord = {
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
      message: (error as Error).message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล',
      error: error
    };
  }
};

/**
 * ดึงข้อมูลประวัติการคำนวณจาก Google Sheets
 * @returns ข้อมูลประวัติ
 */
export const getCalculationHistory = async (): Promise<ServiceResponse<CalculationRecord[]>> => {
  try {
    // สำหรับ development - ใช้ข้อมูลจาก localStorage
    if (process.env.NODE_ENV === 'development') {
      console.log('ดึงข้อมูลจาก localStorage');
      const data = JSON.parse(localStorage.getItem('calculationHistory') || '[]');
      
      return {
        success: true,
        data: data.sort((a: CalculationRecord, b: CalculationRecord) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
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
      message: (error as Error).message || 'เกิดข้อผิดพลาดในการดึงข้อมูล',
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
    if (process.env.NODE_ENV === 'development') {
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
