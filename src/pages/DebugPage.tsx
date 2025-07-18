import { useState } from 'react';
import Button from '../components/UI/Button';
import { testConnection, getCalculationHistory } from '../services/googleSheetsService';

// สร้างฟังก์ชันทดสอบใหม่ที่ใช้งานได้
const GOOGLE_SCRIPTS_API_URL = 'https://script.google.com/macros/s/AKfycbw8Q4K4aaJ4aDJToXlWuhPeDcRWV8vKz3S8qDkQFBvVQkUNcCyeniTpibwHp6RQJRPPhQ/exec';

const testGoogleSheetsURL = async () => {
  try {
    console.log('🔍 ทดสอบ URL:', GOOGLE_SCRIPTS_API_URL);
    
    // ลองใช้ GET request แบบง่ายก่อน (ไม่ใช้ preflight)
    const response = await fetch(`${GOOGLE_SCRIPTS_API_URL}?action=test&timestamp=${Date.now()}&origin=${encodeURIComponent(window.location.origin)}`, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      redirect: 'follow'
    });

    console.log('📨 Status:', response.status);
    console.log('✅ OK:', response.ok);
    console.log('🏷️ Content-Type:', response.headers.get('content-type'));
    console.log('🌐 CORS Headers:', {
      'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
      'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods')
    });

    if (response.ok) {
      const text = await response.text();
      console.log('📥 Response text:', text);
      
      try {
        const json = JSON.parse(text);
        console.log('📄 Response JSON:', json);
        return { success: true, data: json };
      } catch (e) {
        console.warn('⚠️ Response is not JSON:', text);
        return { success: true, data: text, warning: 'Response is not JSON' };
      }
    } else {
      const errorText = await response.text();
      console.error('❌ Error response:', errorText);
      return { success: false, error: `HTTP ${response.status}: ${errorText}` };
    }
  } catch (error) {
    console.error('💥 Network error:', error);
    
    // ตรวจสอบประเภท error
    if ((error as Error).name === 'TypeError' && (error as Error).message.includes('CORS')) {
      return { 
        success: false, 
        error: 'CORS Policy Error - ต้องอัพเดท Google Apps Script',
        type: 'CORS_ERROR',
        solution: 'ใช้โค้ด FIXED_GOOGLE_APPS_SCRIPT_v3.js'
      };
    }
    
    return { 
      success: false, 
      error: (error as Error).message,
      type: (error as Error).name === 'TypeError' ? 'NETWORK_ERROR' : 'UNKNOWN_ERROR'
    };
  }
};

const testSaveToGoogleSheets = async () => {
  const testData = {
    productPrice: 100000,
    downPayment: 20000,
    interestRate: 5,
    months: 12,
    totalInterest: 4000,
    totalAmount: 84000,
    monthlyPayment: 7000
  };

  console.log('🔍 กำลังทดสอบส่งข้อมูลไป Google Sheets...');
  
  try {
    const data = {
      action: 'save',
      timestamp: new Date().toISOString(),
      productPrice: testData.productPrice,
      downPayment: testData.downPayment,
      principal: testData.productPrice - testData.downPayment,
      interestRate: testData.interestRate,
      months: testData.months,
      totalInterest: testData.totalInterest,
      totalAmount: testData.totalAmount,
      monthlyPayment: testData.monthlyPayment
    };

    console.log('📤 ข้อมูลที่จะส่ง:', data);

    const response = await fetch(GOOGLE_SCRIPTS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      mode: 'cors',
      cache: 'no-cache',
      redirect: 'follow'
    });

    console.log('📨 Response status:', response.status);
    console.log('✅ Response ok:', response.ok);
    console.log('🏷️ Response headers:', {
      'Content-Type': response.headers.get('content-type'),
      'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin')
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Response error text:', errorText);
      throw new Error(`HTTP Error ${response.status}: ${errorText.substring(0, 200)}`);
    }

    const result = await response.json();
    console.log('📥 Response data:', result);

    return result;
  } catch (error) {
    console.error('💥 ข้อผิดพลาดในการทดสอบ:', error);
    
    if ((error as Error).name === 'TypeError' && (error as Error).message.includes('fetch')) {
      throw new Error('CORS Error - ต้องอัพเดท Google Apps Script ด้วยโค้ดใหม่');
    }
    
    throw error;
  }
};

interface DebugResult {
  timestamp: string;
  message: string;
  data?: any;
}

const DebugPage = () => {
  const [results, setResults] = useState<DebugResult[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (message: string, data?: any) => {
    const timestamp = new Date().toLocaleTimeString();
    setResults(prev => [...prev, { timestamp, message, data }]);
  };

  const testUrlHandler = async () => {
    setLoading(true);
    addResult('กำลังทดสอบ URL Google Sheets...');
    
    try {
      const result = await testGoogleSheetsURL();
      if (result.success) {
        addResult('✅ URL ใช้งานได้', result);
      } else {
        addResult(`❌ URL ไม่สามารถใช้งานได้: ${result.error}`, result);
      }
    } catch (error) {
      addResult(`❌ ข้อผิดพลาด: ${(error as Error).message}`, error);
    }
    
    setLoading(false);
  };

  const testConnectionHandler = async () => {
    setLoading(true);
    addResult('กำลังทดสอบการเชื่อมต่อ...');
    
    try {
      const result = await testConnection();
      addResult(`การเชื่อมต่อ: ${result ? '✅ สำเร็จ' : '❌ ล้มเหลว'}`);
    } catch (error) {
      addResult(`❌ ข้อผิดพลาด: ${(error as Error).message}`);
    }
    
    setLoading(false);
  };

  const testSaveHandler = async () => {
    setLoading(true);
    addResult('กำลังทดสอบการบันทึกข้อมูล...');
    
    try {
      const result = await testSaveToGoogleSheets();
      addResult('✅ บันทึกสำเร็จ', result);
    } catch (error) {
      addResult(`❌ ข้อผิดพลาด: ${(error as Error).message}`, error);
    }
    
    setLoading(false);
  };

  const testGetHistoryHandler = async () => {
    setLoading(true);
    addResult('กำลังทดสอบการดึงข้อมูลประวัติ...');
    
    try {
      const result = await getCalculationHistory();
      addResult(`✅ ดึงข้อมูลสำเร็จ (${result.data?.length || 0} รายการ)`, result);
    } catch (error) {
      addResult(`❌ ข้อผิดพลาด: ${(error as Error).message}`, error);
    }
    
    setLoading(false);
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            🔧 Google Sheets Debug Center
          </h1>

          {/* Control Panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <Button
              onClick={testUrlHandler}
              disabled={loading}
              className="bg-yellow-500 hover:bg-yellow-600"
            >
              ทดสอบ URL
            </Button>

            <Button
              onClick={testConnectionHandler}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600"
            >
              ทดสอบการเชื่อมต่อ
            </Button>

            <Button
              onClick={testSaveHandler}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600"
            >
              ทดสอบบันทึกข้อมูล
            </Button>

            <Button
              onClick={testGetHistoryHandler}
              disabled={loading}
              className="bg-purple-500 hover:bg-purple-600"
            >
              ทดสอบดึงประวัติ
            </Button>

            <Button
              onClick={clearResults}
              disabled={loading}
              className="bg-red-500 hover:bg-red-600"
            >
              ล้างผลลัพธ์
            </Button>
          </div>

          {/* Results Panel */}
          <div className="bg-gray-50 rounded-lg p-6 min-h-96 max-h-96 overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              📊 ผลลัพธ์การทดสอบ
            </h2>

            {results.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                กดปุ่มเพื่อเริ่มทดสอบ...
              </p>
            ) : (
              <div className="space-y-3">
                {results.map((result, index) => (
                  <div key={index} className="bg-white p-3 rounded border-l-4 border-blue-400">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm text-gray-600">{result.timestamp}</span>
                    </div>
                    <p className="text-gray-800 mb-2">{result.message}</p>
                    {result.data && (
                      <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Current Config Info */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">
              ⚙️ การตั้งค่าปัจจุบัน
            </h3>
            <div className="text-sm text-blue-700 space-y-2">
              <p><strong>Environment:</strong> {import.meta.env.DEV ? 'Development' : 'Production'}</p>
              <p><strong>Origin:</strong> {window.location.origin}</p>
              <p><strong>Google Apps Script URL:</strong></p>
              <code className="bg-white px-2 py-1 rounded text-xs break-all block">
                {GOOGLE_SCRIPTS_API_URL}
              </code>
              
            <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded mt-3">
              <strong>✅ URL อัพเดทแล้ว!</strong><br/>
              ใช้ URL ใหม่: <code className="text-xs break-all">...{GOOGLE_SCRIPTS_API_URL.slice(-20)}</code><br/>
              <strong>ขั้นตอนต่อไป:</strong> อัพเดท Google Apps Script ด้วยโค้ดใหม่
            </div>
            
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mt-2">
              <strong>🚨 CORS Error ที่คุณเจอ = Google Apps Script ยังไม่อัพเดท!</strong><br/>
              <strong>วิธีแก้ที่แน่นอน:</strong> ใช้โค้ด <code>WORKING_GOOGLE_APPS_SCRIPT_v4.js</code><br/>
              <strong>⚠️ สำคัญ:</strong> ต้องไป Copy โค้ดใหม่ในไฟล์นี้ไปวางใน Google Apps Script ของคุณ!
            </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-6 bg-red-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-3">
              � วิธีแก้ไข CORS Error
            </h3>
            <ol className="text-sm text-red-700 space-y-3 list-decimal list-inside">
              <li><strong>ไปที่ Google Apps Script</strong> - เปิด URL ของคุณ</li>
              <li><strong>แทนที่โค้ดทั้งหมด</strong> ด้วยโค้ดจากไฟล์ <code>FIXED_GOOGLE_APPS_SCRIPT_v3.js</code></li>
              <li><strong>บันทึก</strong> (Ctrl+S)</li>
              <li><strong>Deploy ใหม่</strong>:
                <ul className="ml-4 mt-1 space-y-1 list-disc list-inside">
                  <li>Deploy → New deployment</li>
                  <li>Type: Web app</li>
                  <li>Execute as: Me</li>
                  <li>Who has access: <strong>Anyone</strong></li>
                </ul>
              </li>
              <li><strong>Copy URL ใหม่</strong> (หาก Deploy ให้ URL ใหม่)</li>
              <li><strong>ทดสอบอีกครั้ง</strong> ในหน้านี้</li>
            </ol>
            
            <div className="mt-4 p-3 bg-white rounded border">
              <strong>📄 ไฟล์ที่ต้องใช้:</strong> <code>FIXED_GOOGLE_APPS_SCRIPT_v3.js</code><br/>
              <small>โค้ดนี้มี CORS headers และ doOptions() function สำหรับแก้ไข preflight requests</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugPage;
