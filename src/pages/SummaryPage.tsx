const SummaryPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-red-600 mb-4">
              🚨 สถานการณ์ปัจจุบัน: CORS Error
            </h1>
            <p className="text-lg text-gray-700">
              Google Sheets Integration ยังไม่ทำงาน - ต้องอัพเดท Google Apps Script
            </p>
          </div>

          {/* Current Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            
            {/* Working Components */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
                <span className="w-6 h-6 mr-2">✅</span>
                ✅ ส่วนที่ทำงานแล้ว
              </h2>
              <ul className="space-y-2 text-green-700">
                <li>• ✅ React App สร้างเสร็จ 100%</li>
                <li>• ✅ Calculator ทำงานถูกต้อง</li>
                <li>• ✅ Deploy บน GitHub Pages แล้ว</li>
                <li>• ✅ Debug Page สร้างแล้ว</li>
                <li>• ✅ Google Apps Script โค้ดใหม่เตรียมแล้ว</li>
              </ul>
            </div>

            {/* Problem Components */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-red-800 mb-4 flex items-center">
                <span className="w-6 h-6 mr-2">⚠️</span>
                ❌ ปัญหาที่เหลือ
              </h2>
              <ul className="space-y-2 text-red-700">
                <li>• ❌ CORS Policy Error</li>
                <li>• ❌ Google Sheets ไม่บันทึกข้อมูล</li>
                <li>• ❌ Google Apps Script ยังไม่อัพเดท</li>
                <li>• ❌ setHeaders error ใน script เก่า</li>
              </ul>
            </div>
          </div>

          {/* Solution */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
            <div className="flex items-center mb-4">
              <span className="w-8 h-8 text-yellow-600 mr-3 text-2xl">⚡</span>
              <h2 className="text-2xl font-bold text-yellow-800">
                🔥 วิธีแก้ไขด่วน (5 นาที)
              </h2>
            </div>
            
            <div className="bg-white p-4 rounded border mb-4">
              <h3 className="font-bold text-gray-800 mb-3">ขั้นตอนที่ต้องทำ:</h3>
              <ol className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">1</span>
                  <div>
                    <strong>เปิดไฟล์:</strong> <code className="bg-gray-100 px-2 py-1 rounded">WORKING_GOOGLE_APPS_SCRIPT_v4.js</code>
                    <br/><small className="text-gray-500">Copy โค้ดทั้งหมด (Ctrl+A, Ctrl+C)</small>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">2</span>
                  <div>
                    <strong>ไปที่:</strong> 
                    <a href="https://script.google.com" target="_blank" rel="noopener noreferrer" 
                       className="text-blue-600 hover:underline ml-1 inline-flex items-center">
                      https://script.google.com 🔗
                    </a>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">3</span>
                  <div>
                    <strong>เปิดโปรเจกต์:</strong> ที่มี URL ท้าย <code className="bg-gray-100 px-1 rounded">...STRSvNRE</code>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">4</span>
                  <div>
                    <strong>ลบโค้ดเก่า:</strong> (Ctrl+A → Delete)
                    <br/><strong>วางโค้ดใหม่:</strong> (Ctrl+V)
                    <br/><strong>บันทึก:</strong> (Ctrl+S)
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">5</span>
                  <div>
                    <strong>ทดสอบ:</strong> เลือก <code className="bg-gray-100 px-1 rounded">testFunction</code> → กด Run
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">6</span>
                  <div>
                    <strong>ทดสอบในเว็บ:</strong> 
                    <a href="https://mazaoga.github.io/pondaipondee-app/debug" target="_blank" rel="noopener noreferrer"
                       className="text-blue-600 hover:underline ml-1 inline-flex items-center">
                      Debug Page 🔗
                    </a>
                  </div>
                </li>
              </ol>
            </div>
          </div>

          {/* Files Reference */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-bold text-blue-800 mb-2 flex items-center">
                <span className="w-5 h-5 mr-2">📄</span>
                ไฟล์ที่ต้องใช้
              </h3>
              <p className="text-sm text-blue-700">
                <code className="bg-white px-2 py-1 rounded block">
                  WORKING_GOOGLE_APPS_SCRIPT_v4.js
                </code>
                <small className="mt-1 block">✅ ไม่มี setHeaders error</small>
              </p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-bold text-purple-800 mb-2 flex items-center">
                <span className="w-5 h-5 mr-2">💻</span>
                คำแนะนำละเอียด
              </h3>
              <p className="text-sm text-purple-700">
                <code className="bg-white px-2 py-1 rounded block">
                  URGENT_CORS_FIX.md
                </code>
                <small className="mt-1 block">📋 ขั้นตอนแก้ไขทั้งหมด</small>
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-bold text-green-800 mb-2 flex items-center">
                <span className="w-5 h-5 mr-2">✅</span>
                หน้าทดสอบ
              </h3>
              <p className="text-sm text-green-700">
                <a href="https://mazaoga.github.io/pondaipondee-app/debug" 
                   target="_blank" rel="noopener noreferrer"
                   className="bg-white px-2 py-1 rounded block hover:bg-gray-50">
                  Debug Page 🔗
                </a>
                <small className="mt-1 block">🧪 ทดสอบ API connection</small>
              </p>
            </div>
          </div>

          {/* Expected Result */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-green-800 mb-4">
              🎯 ผลลัพธ์ที่คาดหวัง (หลังแก้ไข)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-green-700 mb-2">ในหน้า Debug จะเห็น:</h4>
                <pre className="bg-white p-3 rounded text-sm border overflow-x-auto">
{`{
  "success": true,
  "message": "Connection successful - CORS working!",
  "version": "4.0"
}`}
                </pre>
              </div>
              <div>
                <h4 className="font-semibold text-green-700 mb-2">เมื่อบันทึกข้อมูล:</h4>
                <pre className="bg-white p-3 rounded text-sm border overflow-x-auto">
{`{
  "success": true,
  "message": "Data saved successfully",
  "rowNumber": 2
}`}
                </pre>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-8 text-center">
            <div className="space-x-4">
              <a href="https://script.google.com" target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <span className="w-5 h-5 mr-2">🔗</span>
                เปิด Google Apps Script
              </a>
              <a href="https://mazaoga.github.io/pondaipondee-app/debug" target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <span className="w-5 h-5 mr-2">🧪</span>
                ไปหน้า Debug
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SummaryPage;
