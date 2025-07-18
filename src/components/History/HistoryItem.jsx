import { formatCurrency, formatNumber } from '../../utils/calculations';

const HistoryItem = ({ data, formatDate }) => {
  const {
    timestamp,
    productPrice,
    downPayment,
    interestRate,
    months,
    monthlyPayment
  } = data;

  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      {/* Header with Date */}
      <div className="flex justify-between items-start mb-4">
        <div className="text-sm text-gray-500">
          {formatDate(timestamp)}
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">ค่างวด/เดือน</div>
          <div className="text-lg font-bold text-blue-600">
            {formatCurrency(monthlyPayment)}
          </div>
        </div>
      </div>

      {/* Calculation Details */}
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
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">ดอกเบี้ย:</span>
            <span className="font-medium">{formatNumber(interestRate)}%</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">ระยะเวลา:</span>
            <span className="font-medium">{formatNumber(months)} เดือน</span>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="text-center text-sm text-gray-600">
          ผ่อน <span className="font-semibold text-blue-600">{formatCurrency(monthlyPayment)}</span> 
          × {formatNumber(months)} เดือน
        </div>
      </div>
    </div>
  );
};

export default HistoryItem;
