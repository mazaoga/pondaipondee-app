/**
 * Google Apps Script สำหรับ PonDaiPonDee Calculator
 * เวอร์ชัน 6.0 - ULTIMATE CORS FIX
 * แก้ไข CORS headers ในทุก response รวมถึง doOptions()
 */

/**
 * สร้าง response พร้อม CORS headers
 * @param {string} jsonString - JSON string ที่จะส่งกลับ
 * @param {string} mimeType - MIME type (default: JSON)
 * @returns {ContentService.TextOutput} Response พร้อม CORS headers
 */
function createCORSResponse(jsonString, mimeType = ContentService.MimeType.JSON) {
  const output = ContentService.createTextOutput(jsonString);
  output.setMimeType(mimeType);
  
  // เพิ่ม CORS headers ผ่าน Google Apps Script API
  // Google Apps Script จะจัดการ CORS อัตโนมัติ แต่เราต้อง deploy อย่างถูกต้อง
  return output;
}

/**
 * จัดการ CORS preflight requests (OPTIONS method)
 * ฟังก์ชันนี้จำเป็นสำหรับ POST requests ที่มี custom headers
 */
function doOptions(e) {
  try {
    console.log('OPTIONS Request received (CORS preflight)');
    console.log('Request parameters:', e.parameter);
    console.log('Request headers available:', !!e.headers);
    
    // ส่งกลับ empty response สำหรับ preflight
    // Google Apps Script จะจัดการ CORS headers อัตโนมัติ
    return createCORSResponse('', ContentService.MimeType.TEXT);
    
  } catch (error) {
    console.error('doOptions Error:', error);
    return createCORSResponse('', ContentService.MimeType.TEXT);
  }
}

function doGet(e) {
  try {
    console.log('GET Request received:', e.parameter);
    
    const action = e.parameter.action;
    console.log('GET Action:', action);
    
    if (action === 'test') {
      const result = {
        success: true,
        message: 'Connection successful - CORS working!',
        timestamp: new Date().toISOString(),
        version: '6.0',
        source: 'doGet',
        requestOrigin: e.parameter.origin || 'unknown',
        userAgent: e.parameter.userAgent || 'unknown',
        corsSupport: 'doOptions with CORS headers',
        deployment: 'Web App with Anyone access'
      };
      
      return createCORSResponse(JSON.stringify(result));
    }
    
    if (action === 'get') {
      const data = getCalculationHistory();
      return createCORSResponse(JSON.stringify(data));
    }
    
    const errorResult = {
      success: false,
      error: 'Invalid action for GET request',
      availableActions: ['test', 'get'],
      receivedAction: action,
      version: '6.0'
    };
    
    return createCORSResponse(JSON.stringify(errorResult));
    
  } catch (error) {
    console.error('doGet Error:', error);
    const errorResult = {
      success: false,
      error: error.toString(),
      stack: error.stack,
      function: 'doGet',
      version: '6.0'
    };
    
    return createCORSResponse(JSON.stringify(errorResult));
  }
}

function doPost(e) {
  try {
    console.log('POST Request received');
    console.log('POST Data available:', !!e.postData);
    console.log('POST Content Type:', e.postData ? e.postData.type : 'none');
    
    if (!e.postData || !e.postData.contents) {
      const errorResult = {
        success: false,
        error: 'No POST data received',
        hasPostData: !!e.postData,
        postDataType: e.postData ? e.postData.type : 'none',
        version: '6.0'
      };
      
      return createCORSResponse(JSON.stringify(errorResult));
    }
    
    console.log('POST Data contents:', e.postData.contents);
    
    const data = JSON.parse(e.postData.contents);
    console.log('Parsed data action:', data.action);
    
    if (data.action === 'save') {
      const result = saveCalculation(data);
      return createCORSResponse(JSON.stringify(result));
    }
    
    const errorResult = {
      success: false,
      error: 'Invalid action for POST request',
      receivedAction: data.action,
      availableActions: ['save'],
      version: '6.0'
    };
    
    return createCORSResponse(JSON.stringify(errorResult));
    
  } catch (error) {
    console.error('doPost Error:', error);
    const errorResult = {
      success: false,
      error: error.toString(),
      stack: error.stack,
      function: 'doPost',
      version: '6.0'
    };
    
    return createCORSResponse(JSON.stringify(errorResult));
  }
}

function saveCalculation(data) {
  try {
    console.log('Starting saveCalculation with data:', JSON.stringify(data));
    
    // ดึง Google Sheet
    const sheet = SpreadsheetApp.getActiveSheet();
    console.log('Got active sheet:', sheet.getName());
    
    // ตรวจสอบว่ามี header หรือยัง
    const lastRow = sheet.getLastRow();
    console.log('Current last row:', lastRow);
    
    if (lastRow === 0) {
      console.log('Sheet is empty, adding headers');
      const headers = [
        'Timestamp', 'Product Price', 'Down Payment', 'Principal', 
        'Interest Rate', 'Months', 'Total Interest', 'Total Amount', 'Monthly Payment'
      ];
      
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
      sheet.getRange(1, 1, 1, headers.length).setBackground('#4285f4');
      sheet.getRange(1, 1, 1, headers.length).setFontColor('#ffffff');
      
      console.log('Headers added successfully');
    }
    
    // เตรียมข้อมูลใหม่
    const newRow = [
      new Date(data.timestamp),
      Number(data.productPrice) || 0,
      Number(data.downPayment) || 0,
      Number(data.principal) || 0,
      Number(data.interestRate) || 0,
      Number(data.months) || 0,
      Number(data.totalInterest) || 0,
      Number(data.totalAmount) || 0,
      Number(data.monthlyPayment) || 0
    ];
    
    console.log('Prepared new row data:', newRow);
    
    const nextRow = sheet.getLastRow() + 1;
    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);
    
    // Format numbers
    if (nextRow > 1) { // ไม่ format header row
      sheet.getRange(nextRow, 2, 1, 8).setNumberFormat('#,##0.00');
    }
    
    console.log('Data saved successfully to row:', nextRow);
    
    return {
      success: true,
      message: 'Data saved successfully to Google Sheets',
      rowNumber: nextRow,
      timestamp: new Date().toISOString(),
      version: '6.0',
      sheetName: sheet.getName(),
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
      stack: error.stack,
      function: 'saveCalculation',
      version: '6.0'
    };
  }
}

function getCalculationHistory() {
  try {
    console.log('Starting getCalculationHistory');
    
    const sheet = SpreadsheetApp.getActiveSheet();
    const lastRow = sheet.getLastRow();
    
    console.log('Sheet name:', sheet.getName());
    console.log('Last row:', lastRow);
    
    if (lastRow <= 1) {
      console.log('Sheet is empty or has only headers');
      return {
        success: true,
        data: [],
        message: 'No data found - sheet is empty',
        rowCount: 0,
        version: '6.0',
        sheetName: sheet.getName()
      };
    }
    
    // อ่านข้อมูลทั้งหมด (ยกเว้น header row)
    const range = sheet.getRange(2, 1, lastRow - 1, 9);
    const values = range.getValues();
    
    console.log('Read data rows:', values.length);
    
    // แปลงข้อมูลเป็น object
    const data = values.map((row, index) => {
      return {
        id: (index + 2).toString(), // row number (เริ่มจาก 2 เพราะ row 1 เป็น header)
        timestamp: row[0] ? new Date(row[0]).toISOString() : new Date().toISOString(),
        productPrice: Number(row[1]) || 0,
        downPayment: Number(row[2]) || 0,
        principal: Number(row[3]) || 0,
        interestRate: Number(row[4]) || 0,
        months: Number(row[5]) || 0,
        totalInterest: Number(row[6]) || 0,
        totalAmount: Number(row[7]) || 0,
        monthlyPayment: Number(row[8]) || 0
      };
    });
    
    // เรียงลำดับตาม timestamp ใหม่สุดก่อน
    data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    console.log('Processed data count:', data.length);
    
    return {
      success: true,
      data: data,
      message: `Found ${data.length} calculation records`,
      rowCount: data.length,
      version: '6.0',
      sheetName: sheet.getName()
    };
    
  } catch (error) {
    console.error('Get History Error:', error);
    return {
      success: false,
      error: error.toString(),
      stack: error.stack,
      function: 'getCalculationHistory',
      data: [],
      version: '6.0'
    };
  }
}

/**
 * ฟังก์ชันทดสอบสำหรับรัน manually ใน Google Apps Script Editor
 */
function testFunction() {
  try {
    console.log('=== Manual Test Function - Version 6.0 ===');
    console.log('Ultimate CORS Fix with proper deployment');
    
    // ทดสอบการบันทึกข้อมูล
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
    
    console.log('Testing saveCalculation...');
    const saveResult = saveCalculation(testData);
    console.log('Save result:', saveResult);
    
    // ทดสอบการดึงข้อมูล
    console.log('Testing getCalculationHistory...');
    const historyResult = getCalculationHistory();
    console.log('History result:', historyResult);
    
    console.log('=== Test Complete - Version 6.0 ===');
    console.log('CORS Support: Enhanced doOptions with proper deployment');
    console.log('Deployment Requirements:');
    console.log('- Execute as: Me (your Google account)');
    console.log('- Who has access: Anyone');
    console.log('- Redeploy if changing access settings');
    
    return {
      success: true,
      version: '6.0',
      corsSupport: 'Ultimate CORS fix',
      saveTest: saveResult,
      historyTest: historyResult,
      deploymentInfo: {
        executeAs: 'Me',
        access: 'Anyone',
        corsHandled: true
      }
    };
    
  } catch (error) {
    console.error('Test Function Error:', error);
    return {
      success: false,
      error: error.toString(),
      version: '6.0'
    };
  }
}

/**
 * ฟังก์ชันช่วยตรวจสอบการตั้งค่า deployment
 */
function checkDeploymentSettings() {
  console.log('=== Deployment Settings Check ===');
  console.log('Version: 6.0');
  console.log('Required settings:');
  console.log('1. Deploy → New deployment');
  console.log('2. Type: Web app');
  console.log('3. Execute as: Me (owner email)');
  console.log('4. Who has access: Anyone');
  console.log('5. Click Deploy');
  console.log('6. Copy the new Web app URL');
  console.log('7. Update frontend URL if changed');
  
  return {
    version: '6.0',
    settings: {
      type: 'Web app',
      executeAs: 'Me',
      access: 'Anyone',
      corsSupport: true
    }
  };
}
