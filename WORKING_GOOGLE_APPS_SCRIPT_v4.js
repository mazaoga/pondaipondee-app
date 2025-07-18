/**
 * Google Apps Script สำหรับ PonDaiPonDee Calculator
 * เวอร์ชัน 4.0 - แก้ไข error setHeaders() ที่ไม่รองรับ
 * CORS จะถูกจัดการโดย Google Apps Script โดยอัตโนมัติเมื่อ deploy เป็น Web App
 */

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
        version: '4.0',
        source: 'doGet',
        requestOrigin: e.parameter.origin || 'unknown',
        userAgent: e.parameter.userAgent || 'unknown'
      };
      
      return ContentService
        .createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    if (action === 'get') {
      const data = getCalculationHistory();
      return ContentService
        .createTextOutput(JSON.stringify(data))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const errorResult = {
      success: false,
      error: 'Invalid action for GET request',
      availableActions: ['test', 'get'],
      receivedAction: action
    };
    
    return ContentService
      .createTextOutput(JSON.stringify(errorResult))
      .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    console.error('doGet Error:', error);
    const errorResult = {
      success: false,
      error: error.toString(),
      stack: error.stack,
      function: 'doGet'
    };
    
    return ContentService
      .createTextOutput(JSON.stringify(errorResult))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    console.log('POST Request received');
    console.log('POST Data available:', !!e.postData);
    
    if (!e.postData || !e.postData.contents) {
      const errorResult = {
        success: false,
        error: 'No POST data received',
        hasPostData: !!e.postData,
        postDataType: e.postData ? e.postData.type : 'none'
      };
      
      return ContentService
        .createTextOutput(JSON.stringify(errorResult))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    console.log('POST Data contents:', e.postData.contents);
    
    const data = JSON.parse(e.postData.contents);
    console.log('Parsed data action:', data.action);
    
    if (data.action === 'save') {
      const result = saveCalculation(data);
      return ContentService
        .createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const errorResult = {
      success: false,
      error: 'Invalid action for POST request',
      receivedAction: data.action,
      availableActions: ['save']
    };
    
    return ContentService
      .createTextOutput(JSON.stringify(errorResult))
      .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    console.error('doPost Error:', error);
    const errorResult = {
      success: false,
      error: error.toString(),
      stack: error.stack,
      function: 'doPost'
    };
    
    return ContentService
      .createTextOutput(JSON.stringify(errorResult))
      .setMimeType(ContentService.MimeType.JSON);
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
      message: 'Data saved successfully',
      rowNumber: nextRow,
      timestamp: new Date().toISOString(),
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
      function: 'saveCalculation'
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
      return { 
        success: true, 
        data: [],
        message: 'No data found - sheet has only headers or is empty',
        rowCount: lastRow
      };
    }
    
    // ดึงข้อมูลทั้งหมดยกเว้นหัวตาราง
    const range = sheet.getRange(2, 1, lastRow - 1, 9);
    const values = range.getValues();
    
    console.log('Retrieved', values.length, 'rows of data');
    
    // แปลงข้อมูลเป็น JSON
    const data = values.map((row, index) => {
      try {
        return {
          id: (index + 2).toString(),
          timestamp: row[0],
          productPrice: Number(row[1]) || 0,
          downPayment: Number(row[2]) || 0,
          principal: Number(row[3]) || 0,
          interestRate: Number(row[4]) || 0,
          months: Number(row[5]) || 0,
          totalInterest: Number(row[6]) || 0,
          totalAmount: Number(row[7]) || 0,
          monthlyPayment: Number(row[8]) || 0
        };
      } catch (rowError) {
        console.error('Error processing row', index + 2, ':', rowError);
        return null;
      }
    }).filter(item => item !== null) // กรองข้อมูลที่ error ออก
      .reverse(); // เรียงจากใหม่ไปเก่า
    
    console.log('Processed', data.length, 'valid records');
    
    return { 
      success: true, 
      data: data,
      message: `Retrieved ${data.length} records successfully`,
      totalRows: lastRow,
      dataRows: data.length
    };
    
  } catch (error) {
    console.error('Get History Error:', error);
    return {
      success: false,
      error: error.toString(),
      stack: error.stack,
      function: 'getCalculationHistory',
      data: []
    };
  }
}

// ฟังก์ชันทดสอบ - รันได้ใน Apps Script Editor
function testFunction() {
  console.log('=== Starting Test Function ===');
  
  try {
    // ทดสอบ doGet
    console.log('Testing doGet...');
    const getTest = doGet({ parameter: { action: 'test', origin: 'test-function' } });
    console.log('GET test result:', getTest.getContent());
    
    // ทดสอบ doPost
    console.log('Testing doPost...');
    const testPostData = {
      postData: {
        contents: JSON.stringify({
          action: 'save',
          timestamp: new Date().toISOString(),
          productPrice: 150000,
          downPayment: 30000,
          principal: 120000,
          interestRate: 6,
          months: 24,
          totalInterest: 7200,
          totalAmount: 127200,
          monthlyPayment: 5300
        }),
        type: 'application/json'
      }
    };
    
    const postTest = doPost(testPostData);
    console.log('POST test result:', postTest.getContent());
    
    // ทดสอบ getHistory
    console.log('Testing getHistory...');
    const historyTest = doGet({ parameter: { action: 'get' } });
    console.log('History test result:', historyTest.getContent());
    
    console.log('=== Test Function Completed Successfully ===');
    
    return {
      success: true,
      results: {
        get: JSON.parse(getTest.getContent()),
        post: JSON.parse(postTest.getContent()),
        history: JSON.parse(historyTest.getContent())
      }
    };
    
  } catch (error) {
    console.error('Test Function Error:', error);
    return {
      success: false,
      error: error.toString(),
      stack: error.stack
    };
  }
}

// ฟังก์ชันล้างข้อมูลทั้งหมด (ใช้เฉพาะเวลาทดสอบ)
function clearAllData() {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    sheet.clear();
    console.log('All data cleared from sheet:', sheet.getName());
    return { 
      success: true, 
      message: 'All data cleared successfully',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Clear Data Error:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

// ฟังก์ชันดูข้อมูลใน Sheet
function inspectSheet() {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const lastRow = sheet.getLastRow();
    const lastCol = sheet.getLastColumn();
    
    const info = {
      sheetName: sheet.getName(),
      lastRow: lastRow,
      lastColumn: lastCol,
      hasData: lastRow > 0
    };
    
    if (lastRow > 0) {
      const headerRange = sheet.getRange(1, 1, 1, Math.min(lastCol, 9));
      info.headers = headerRange.getValues()[0];
      
      if (lastRow > 1) {
        const dataRange = sheet.getRange(2, 1, Math.min(lastRow - 1, 5), Math.min(lastCol, 9));
        info.sampleData = dataRange.getValues();
      }
    }
    
    console.log('Sheet inspection:', JSON.stringify(info, null, 2));
    return info;
    
  } catch (error) {
    console.error('Inspect Sheet Error:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}
