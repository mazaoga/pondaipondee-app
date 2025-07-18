/**
 * Google Apps Script สำหรับ PonDaiPonDee Calculator
 * เวอร์ชัน 2.0 - แก้ไขปัญหา CORS และการเชื่อมต่อ
 */

function doGet(e) {
  try {
    // อนุญาตให้เรียกจาก domain ภายนอก
    const output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.JSON);
    
    const action = e.parameter.action;
    console.log('GET Request - Action:', action);
    
    if (action === 'test') {
      const result = {
        success: true,
        message: 'Connection successful',
        timestamp: new Date().toISOString(),
        version: '2.0'
      };
      return output.setContent(JSON.stringify(result));
    }
    
    if (action === 'get') {
      const data = getCalculationHistory();
      return output.setContent(JSON.stringify(data));
    }
    
    const errorResult = {
      success: false,
      error: 'Invalid action for GET request'
    };
    return output.setContent(JSON.stringify(errorResult));
    
  } catch (error) {
    console.error('doGet Error:', error);
    const errorResult = {
      success: false,
      error: error.toString()
    };
    return ContentService
      .createTextOutput(JSON.stringify(errorResult))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    // อนุญาตให้เรียกจาก domain ภายนอก
    const output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.JSON);
    
    console.log('POST Request received');
    console.log('POST Data:', e.postData.contents);
    
    const data = JSON.parse(e.postData.contents);
    
    if (data.action === 'save') {
      const result = saveCalculation(data);
      return output.setContent(JSON.stringify(result));
    }
    
    const errorResult = {
      success: false,
      error: 'Invalid action for POST request'
    };
    return output.setContent(JSON.stringify(errorResult));
    
  } catch (error) {
    console.error('doPost Error:', error);
    const errorResult = {
      success: false,
      error: error.toString()
    };
    return ContentService
      .createTextOutput(JSON.stringify(errorResult))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function saveCalculation(data) {
  try {
    console.log('Saving calculation:', data);
    
    // ดึง Google Sheet
    const sheet = SpreadsheetApp.getActiveSheet();
    
    // ตรวจสอบว่ามี header หรือยัง
    if (sheet.getLastRow() === 0) {
      const headers = [
        'Timestamp', 'Product Price', 'Down Payment', 'Principal', 
        'Interest Rate', 'Months', 'Total Interest', 'Total Amount', 'Monthly Payment'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    }
    
    // เพิ่มข้อมูลใหม่
    const newRow = [
      new Date(data.timestamp),
      data.productPrice,
      data.downPayment,
      data.principal,
      data.interestRate,
      data.months,
      data.totalInterest,
      data.totalAmount,
      data.monthlyPayment
    ];
    
    const nextRow = sheet.getLastRow() + 1;
    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);
    
    console.log('Data saved successfully to row:', nextRow);
    
    return {
      success: true,
      message: 'Data saved successfully',
      data: {
        id: nextRow.toString(),
        ...data
      }
    };
    
  } catch (error) {
    console.error('Save Error:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

function getCalculationHistory() {
  try {
    console.log('Getting calculation history');
    
    const sheet = SpreadsheetApp.getActiveSheet();
    const lastRow = sheet.getLastRow();
    
    if (lastRow <= 1) {
      return { success: true, data: [] };
    }
    
    // ดึงข้อมูลทั้งหมดยกเว้นหัวตาราง
    const range = sheet.getRange(2, 1, lastRow - 1, 9);
    const values = range.getValues();
    
    // แปลงข้อมูลเป็น JSON
    const data = values.map((row, index) => ({
      id: (index + 2).toString(),
      timestamp: row[0],
      productPrice: row[1],
      downPayment: row[2],
      principal: row[3],
      interestRate: row[4],
      months: row[5],
      totalInterest: row[6],
      totalAmount: row[7],
      monthlyPayment: row[8]
    })).reverse(); // เรียงจากใหม่ไปเก่า
    
    console.log('Retrieved', data.length, 'records');
    
    return { success: true, data: data };
    
  } catch (error) {
    console.error('Get History Error:', error);
    return {
      success: false,
      error: error.toString(),
      data: []
    };
  }
}

// ฟังก์ชันทดสอบ
function testFunction() {
  console.log('Test function called');
  
  // ทดสอบบันทึกข้อมูล
  const testData = {
    action: 'save',
    timestamp: new Date().toISOString(),
    productPrice: 100000,
    downPayment: 20000,
    principal: 80000,
    interestRate: 5,
    months: 12,
    totalInterest: 4000,
    totalAmount: 84000,
    monthlyPayment: 7000
  };
  
  const saveResult = saveCalculation(testData);
  console.log('Save test result:', saveResult);
  
  // ทดสอบดึงข้อมูล
  const historyResult = getCalculationHistory();
  console.log('History test result:', historyResult);
  
  return {
    save: saveResult,
    history: historyResult
  };
}
