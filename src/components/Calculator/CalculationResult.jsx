import { formatCurrency, formatNumber } from '../../utils/calculations';

const CalculationResult = ({ result, isSaving }) => {
  if (!result) return null;

  const {
    productPrice,
    downPayment,
    principal,
    interestRate,
    months,
    totalInterest,
    totalAmount,
    monthlyPayment
  } = result;

  return (
    <div className="card bg-gradient-to-br from-green-50 to-blue-50">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          ผลการคำนวณ
        </h3>
        {isSaving && (
          <p className="text-sm text-blue-600">กำลังบันทึกข้อมูล...</p>
        )}
      </div>

      {/* ผลลัพธ์หลัก */}
      <div className="text-center mb-6 p-6 rounded-xl shadow-lg" style={{
        background: 'linear-gradient(135deg, #FFF8DC 0%, #FFFACD 50%, #FFEBCD 100%)',
        border: '2px solid #DAA520',
        boxShadow: '0 8px 25px rgba(218, 165, 32, 0.2)'
      }}>
        <p className="text-base text-gray-700 mb-3 font-medium">ค่างวดรายเดือน</p>
        <p style={{
          fontSize: '3rem',
          fontWeight: '900',
          background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: '2px 2px 4px rgba(255, 140, 0, 0.3)',
          letterSpacing: '-0.02em',
          marginBottom: '0.5rem',
          lineHeight: '1'
        }}>
          {formatCurrency(monthlyPayment)}
        </p>
        <p className="text-base text-gray-600 mt-3 font-medium">
          เป็นเวลา {formatNumber(months)} เดือน
        </p>
      </div>

      {/* รายละเอียดการคำนวณ */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-700 mb-3">รายละเอียดการคำนวณ:</h4>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">ราคาสินค้า:</span>
              <span className="font-medium">{formatCurrency(productPrice)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">เงินดาวน์:</span>
              <span className="font-medium">{formatCurrency(downPayment)}</span>
            </div>
            
            <div className="flex justify-between border-t pt-2">
              <span className="text-gray-600">ยอดเงินต้น:</span>
              <span className="font-medium text-blue-600">{formatCurrency(principal)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">อัตราดอกเบี้ย:</span>
              <span className="font-medium">{formatNumber(interestRate)}%</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">ดอกเบี้ยรวม:</span>
              <span className="font-medium">{formatCurrency(totalInterest)}</span>
            </div>
            
            <div className="flex justify-between border-t pt-2">
              <span className="text-gray-600">ยอดรวมทั้งหมด:</span>
              <span className="font-medium text-green-600">{formatCurrency(totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* สรุปการผ่อน */}
        <div className="mt-4 p-4 rounded-xl" style={{
          border: '2px solid #999999'
        }}>
          <div className="text-center">
            <p className="text-base text-gray-700 mb-2 font-medium">สรุป: ผ่อนชำระ</p>
            <p style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #B8860B 0%, #DAA520 50%, #FFD700 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '0.25rem'
            }}>
              {formatCurrency(monthlyPayment)} × {formatNumber(months)} เดือน
            </p>
            <p className="text-sm text-gray-600 mt-2 font-medium">
              (ยอดรวม {formatCurrency(totalAmount)})
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculationResult;
