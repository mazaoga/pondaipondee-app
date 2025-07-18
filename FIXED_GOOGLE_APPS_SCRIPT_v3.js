/**
 * Google Apps Script สำหรับ PonDaiPonDee Calculator
 * เวอร์ชัน 3.0 - แก้ไขปัญหา CORS สำหรับ GitHub Pages
 */

function doOptions(e) {
  // Handle CORS preflight requests
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept',
      'Access-Control-Max-Age': '86400'
    });
}

function doGet(e) {
  try {
    console.log('GET Request received from:', e.parameter);
    
    const output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.JSON);
    
    // เพิ่ม CORS headers
    output.setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept'
    });
    
    const action = e.parameter.action;
    console.log('GET Action:', action);
    
    if (action === 'test') {
      const result = {
        success: true,
        message: 'Connection successful',
        timestamp: new Date().toISOString(),
        version: '3.0',
        source: 'doGet',
        requestOrigin: e.parameter.origin || 'unknown'
      };
      return output.setContent(JSON.stringify(result));
    }
    
    if (action === 'get') {
      const data = getCalculationHistory();
      return output.setContent(JSON.stringify(data));
    }
    
    const errorResult = {
      success: false,
      error: 'Invalid action for GET request',
      availableActions: ['test', 'get']
    };
    return output.setContent(JSON.stringify(errorResult));
    
  } catch (error) {
    console.error('doGet Error:', error);
    const errorResult = {
      success: false,
      error: error.toString(),
      stack: error.stack
    };
    
    return ContentService
      .createTextOutput(JSON.stringify(errorResult))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Accept'
      });
  }
}

function doPost(e) {
  try {
    console.log('POST Request received');
    console.log('POST Data:', e.postData ? e.postData.contents : 'No data');
    
    const output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.JSON);
    
    // เพิ่ม CORS headers
    output.setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept'
    });
    
    if (!e.postData || !e.postData.contents) {
      const errorResult = {
        success: false,
        error: 'No POST data received'
      };
      return output.setContent(JSON.stringify(errorResult));
    }
    
    const data = JSON.parse(e.postData.contents);
    console.log('Parsed data:', data);
    
    if (data.action === 'save') {
      const result = saveCalculation(data);
      return output.setContent(JSON.stringify(result));
    }
    
    const errorResult = {
      success: false,
      error: 'Invalid action for POST request',
      receivedAction: data.action,
      availableActions: ['save']
    };
    return output.setContent(JSON.stringify(errorResult));
    
  } catch (error) {
    console.error('doPost Error:', error);
    const errorResult = {
      success: false,
      error: error.toString(),
      stack: error.stack
    };
    
    return ContentService
      .createTextOutput(JSON.stringify(errorResult))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Accept'
      });
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
      
      // เพิ่มสีให้ header
      sheet.getRange(1, 1, 1, headers.length).setBackground('#4285f4');
      sheet.getRange(1, 1, 1, headers.length).setFontColor('#ffffff');
    }
    
    // เพิ่มข้อมูลใหม่
    const newRow = [
      new Date(data.timestamp),
      Number(data.productPrice),
      Number(data.downPayment),
      Number(data.principal),
      Number(data.interestRate),
      Number(data.months),
      Number(data.totalInterest),
      Number(data.totalAmount),
      Number(data.monthlyPayment)
    ];
    
    const nextRow = sheet.getLastRow() + 1;
    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);
    
    // Format numbers
    sheet.getRange(nextRow, 2, 1, 8).setNumberFormat('#,##0.00');
    
    console.log('Data saved successfully to row:', nextRow);
    
    return {
      success: true,
      message: 'Data saved successfully',
      rowNumber: nextRow,
      data: {
        id: nextRow.toString(),
        ...data
      }
    };
    
  } catch (error) {
    console.error('Save Error:', error);
    return {
      success: false,
      error: error.toString(),
      stack: error.stack
    };
  }
}

function getCalculationHistory() {
  try {
    console.log('Getting calculation history');
    
    const sheet = SpreadsheetApp.getActiveSheet();
    const lastRow = sheet.getLastRow();
    
    if (lastRow <= 1) {
      return { 
        success: true, 
        data: [],
        message: 'No data found',
        rowCount: lastRow
      };
    }
    
    // ดึงข้อมูลทั้งหมดยกเว้นหัวตาราง
    const range = sheet.getRange(2, 1, lastRow - 1, 9);
    const values = range.getValues();
    
    // แปลงข้อมูลเป็น JSON
    const data = values.map((row, index) => ({
      id: (index + 2).toString(),
      timestamp: row[0],
      productPrice: Number(row[1]),
      downPayment: Number(row[2]),
      principal: Number(row[3]),
      interestRate: Number(row[4]),
      months: Number(row[5]),
      totalInterest: Number(row[6]),
      totalAmount: Number(row[7]),
      monthlyPayment: Number(row[8])
    })).reverse(); // เรียงจากใหม่ไปเก่า
    
    console.log('Retrieved', data.length, 'records');
    
    return { 
      success: true, 
      data: data,
      message: `Retrieved ${data.length} records`,
      rowCount: lastRow
    };
    
  } catch (error) {
    console.error('Get History Error:', error);
    return {
      success: false,
      error: error.toString(),
      stack: error.stack,
      data: []
    };
  }
}

// ฟังก์ชันทดสอบ
function testFunction() {
  console.log('Test function called');
  
  // ทดสอบ doGet
  const getTest = doGet({ parameter: { action: 'test' } });
  console.log('GET test result:', getTest.getContent());
  
  // ทดสอบ doPost
  const testData = {
    postData: {
      contents: JSON.stringify({
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
      })
    }
  };
  
  const postTest = doPost(testData);
  console.log('POST test result:', postTest.getContent());
  
  // ทดสอบ getHistory
  const historyTest = doGet({ parameter: { action: 'get' } });
  console.log('History test result:', historyTest.getContent());
  
  return {
    get: getTest.getContent(),
    post: postTest.getContent(),
    history: historyTest.getContent()
  };
}

// ฟังก์ชันล้างข้อมูลทั้งหมด (ใช้เฉพาะเวลาทดสอบ)
function clearAllData() {
  const sheet = SpreadsheetApp.getActiveSheet();
  sheet.clear();
  console.log('All data cleared');
  return { success: true, message: 'All data cleared' };
}
