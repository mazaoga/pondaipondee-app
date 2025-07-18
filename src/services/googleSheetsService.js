// Google Sheets API configuration  
// ⚠️ แทนที่ URL นี้ด้วย URL ใหม่ที่ได้จาก Google Apps Script Deploy
// URL ต้องมีรูปแบบ: https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
const GOOGLE_SCRIPTS_API_URL = 'https://script.google.com/macros/s/AKfycbztwXI_BN4_Zfaqy7ZVr5pL7fovyU-VpJlXINqCTdQjfYUgFsM07zjAPhAI5o8vMCtnuA/exec';

/**
 * บันทึกข้อมูลการคำนวณลง Google Sheets
 * @param {object} calculationData - ข้อมูลการคำนวณ
 * @returns {Promise<object>} ผลการบันทึก
 */
export const saveCalculation = async (calculationData) => {
  try {
    // สร้างข้อมูลที่จะส่ง
    const requestData = {
      action: 'save',
      timestamp: new Date().toISOString(),
      productPrice: calculationData.productPrice,
      downPayment: calculationData.downPayment,
      principal: calculationData.productPrice - calculationData.downPayment, // คำนวณเงินต้น
      interestRate: calculationData.interestRate,
      months: calculationData.months,
      totalInterest: calculationData.totalInterest,
      totalAmount: calculationData.totalAmount,
      monthlyPayment: calculationData.monthlyPayment
    };

    console.log('🔍 กำลังบันทึกข้อมูลไป Google Sheets...', requestData);

    // พยายามบันทึกไป Google Sheets ก่อน (ทั้ง dev และ production)
    try {
      const response = await fetch(GOOGLE_SCRIPTS_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestData),
        mode: 'cors',
        credentials: 'omit'
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Save to Google Sheets Error:', response.status, errorText);
        throw new Error(`ไม่สามารถบันทึกข้อมูลได้ (${response.status}): ${errorText.substring(0, 100)}`);
      }

      const result = await response.json();
      console.log('✅ บันทึกสำเร็จไป Google Sheets:', result);
      
      if (result.error) {
        throw new Error(result.error);
      }

      // บันทึกไป localStorage ด้วยเพื่อ backup (เฉพาะ development)
      if (import.meta.env.DEV) {
        try {
          const existingData = JSON.parse(localStorage.getItem('calculationHistory') || '[]');
          const newLocalData = {
            ...requestData,
            id: Date.now().toString(),
            timestamp: new Date().toISOString()
          };
          existingData.unshift(newLocalData);
          localStorage.setItem('calculationHistory', JSON.stringify(existingData));
          console.log('💾 Backup ไป localStorage เรียบร้อย');
        } catch (localError) {
          console.warn('⚠️ ไม่สามารถ backup ไป localStorage ได้:', localError);
        }
      }

      return {
        success: true,
        message: 'บันทึกข้อมูลเรียบร้อยแล้ว',
        data: result.data,
        source: 'googleSheets'
      };

    } catch (googleSheetsError) {
      console.error('💥 Google Sheets Error:', googleSheetsError);
      
      // ถ้าเป็น development และมีปัญหา ให้ fallback ไปใช้ localStorage
      if (import.meta.env.DEV) {
        console.log('🔄 Fallback: บันทึกไป localStorage แทน');
        
        try {
          const existingData = JSON.parse(localStorage.getItem('calculationHistory') || '[]');
          const newData = {
            ...requestData,
            id: Date.now().toString(),
            timestamp: new Date().toISOString()
          };
          existingData.unshift(newData);
          localStorage.setItem('calculationHistory', JSON.stringify(existingData));
          
          return {
            success: true,
            message: 'บันทึกข้อมูลเรียบร้อยแล้ว (ใช้ localStorage)',
            data: newData,
            source: 'localStorage',
            warning: 'ไม่สามารถเชื่อมต่อ Google Sheets ได้ บันทึกไป localStorage แทน'
          };
        } catch (localError) {
          console.error('❌ ไม่สามารถบันทึกไป localStorage ได้:', localError);
          throw new Error('ไม่สามารถบันทึกข้อมูลได้ทั้ง Google Sheets และ localStorage');
        }
      } else {
        // Production - ไม่มี fallback
        throw googleSheetsError;
      }
    }

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
    console.log('🔍 ดึงข้อมูลประวัติจาก Google Sheets...');

    // เรียก Google Scripts API ทั้ง development และ production
    const response = await fetch(`${GOOGLE_SCRIPTS_API_URL}?action=get&timestamp=${Date.now()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
        'Accept': 'application/json',
      },
      mode: 'cors',
      credentials: 'omit',
      cache: 'no-cache'
    });

    console.log('📨 getHistory Response status:', response.status);
    console.log('✅ getHistory Response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ ไม่สามารถดึงข้อมูลจาก Google Sheets ได้:', response.status, errorText);
      
      // ถ้าเป็น development และมีปัญหา ให้ fallback ไปใช้ localStorage
      if (import.meta.env.DEV) {
        console.log('🔄 Fallback: ใช้ข้อมูลจาก localStorage แทน');
        const localData = JSON.parse(localStorage.getItem('calculationHistory') || '[]');
        return {
          success: true,
          data: localData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
          source: 'localStorage'
        };
      }
      
      throw new Error(`ไม่สามารถดึงข้อมูลได้ (${response.status}): ${errorText.substring(0, 100)}`);
    }

    const result = await response.json();
    console.log('📥 getHistory Response data:', result);
    
    if (result.error) {
      throw new Error(result.error);
    }

    return {
      success: true,
      data: result.data || [],
      source: 'googleSheets'
    };

  } catch (error) {
    console.error('💥 เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
    
    // ถ้าเป็น development และมีปัญหาเครือข่าย ให้ fallback ไปใช้ localStorage
    if (import.meta.env.DEV && (error.name === 'TypeError' || error.message.includes('fetch'))) {
      console.log('🔄 Network error - Fallback ไปใช้ localStorage');
      try {
        const localData = JSON.parse(localStorage.getItem('calculationHistory') || '[]');
        return {
          success: true,
          data: localData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
          source: 'localStorage',
          warning: 'ไม่สามารถเชื่อมต่อ Google Sheets ได้ ใช้ข้อมูลจาก localStorage แทน'
        };
      } catch (localError) {
        console.error('❌ ไม่สามารถอ่าน localStorage ได้:', localError);
      }
    }
    
    return {
      success: false,
      message: error.message || 'เกิดข้อผิดพลาดในการดึงข้อมูล',
      error: error,
      data: []
    };
  }
};
