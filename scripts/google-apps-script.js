/**
 * Google Apps Script สำหรับ PonDaiPonDee Calculator
 * ใช้สำหรับเก็บข้อมูลการคำนวณใน Google Sheets
 * 
 * การติดตั้ง:
 * 1. เปิด https://script.google.com
 * 2. สร้าง New Project
 * 3. Copy โค้ดนี้ไปใส่
 * 4. Deploy as Web App
 * 5. Copy URL มาใส่ใน googleSheetsService.ts
 */

// ชื่อ Google Sheets และ Worksheet
const SPREADSHEET_NAME = 'PonDaiPonDee_Calculator';
const WORKSHEET_NAME = 'Calculations';

// Headers สำหรับ Google Sheets
const HEADERS = [
  'Timestamp',
  'Product Price',
  'Down Payment',
  'Principal',
  'Interest Rate',
  'Months',
  'Total Interest',
  'Total Amount',
  'Monthly Payment'
];

/**
 * สร้าง Spreadsheet และ Worksheet ใหม่ถ้ายังไม่มี
 */
function initializeSheet() {
  try {
    let spreadsheet = getOrCreateSpreadsheet();
    let worksheet = getOrCreateWorksheet(spreadsheet);
    
    // ตรวจสอบว่ามี header หรือยัง
    if (worksheet.getLastRow() === 0) {
      worksheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
      worksheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    }
    
    return { success: true, message: 'Sheet initialized successfully' };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * ดึง Spreadsheet หรือสร้างใหม่ถ้าไม่มี
 */
function getOrCreateSpreadsheet() {
  const files = DriveApp.getFilesByName(SPREADSHEET_NAME);
  
  if (files.hasNext()) {
    const file = files.next();
    return SpreadsheetApp.openById(file.getId());
  } else {
    return SpreadsheetApp.create(SPREADSHEET_NAME);
  }
}

/**
 * ดึง Worksheet หรือสร้างใหม่ถ้าไม่มี
 */
function getOrCreateWorksheet(spreadsheet) {
  try {
    return spreadsheet.getSheetByName(WORKSHEET_NAME);
  } catch (error) {
    return spreadsheet.insertSheet(WORKSHEET_NAME);
  }
}

/**
 * ฟังก์ชันหลักสำหรับจัดการ HTTP requests
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    if (data.action === 'save') {
      return ContentService
        .createTextOutput(JSON.stringify(saveCalculation(data)))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: 'Invalid action' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * ฟังก์ชันสำหรับจัดการ HTTP GET requests
 */
function doGet(e) {
  try {
    const action = e.parameter.action;
    
    if (action === 'get') {
      return ContentService
        .createTextOutput(JSON.stringify(getCalculationHistory()))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    if (action === 'test') {
      return ContentService
        .createTextOutput(JSON.stringify({ success: true, message: 'Connection successful' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: 'Invalid action' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * บันทึกข้อมูลการคำนวณ
 */
function saveCalculation(data) {
  try {
    const spreadsheet = getOrCreateSpreadsheet();
    const worksheet = getOrCreateWorksheet(spreadsheet);
    
    // ตรวจสอบ header
    if (worksheet.getLastRow() === 0) {
      worksheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
      worksheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
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
    
    const nextRow = worksheet.getLastRow() + 1;
    worksheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);
    
    return {
      success: true,
      message: 'Data saved successfully',
      data: {
        id: nextRow.toString(),
        ...data
      }
    };
    
  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * ดึงข้อมูลประวัติการคำนวณ
 */
function getCalculationHistory() {
  try {
    const spreadsheet = getOrCreateSpreadsheet();
    const worksheet = getOrCreateWorksheet(spreadsheet);
    
    const lastRow = worksheet.getLastRow();
    
    if (lastRow <= 1) {
      return { success: true, data: [] };
    }
    
    // ดึงข้อมูลทั้งหมดยกเว้นหัวตาราง
    const range = worksheet.getRange(2, 1, lastRow - 1, HEADERS.length);
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
    
    return { success: true, data: data };
    
  } catch (error) {
    return {
      success: false,
      error: error.toString(),
      data: []
    };
  }
}

/**
 * ฟังก์ชันทดสอบสำหรับ development
 */
function testSaveCalculation() {
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
  
  const result = saveCalculation(testData);
  console.log('Test save result:', result);
  
  const historyResult = getCalculationHistory();
  console.log('Test history result:', historyResult);
}
