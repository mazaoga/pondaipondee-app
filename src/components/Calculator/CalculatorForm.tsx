import React, { useState } from 'react';
import Input from '../UI/Input';
import Button from '../UI/Button';
import { calculateMonthlyPayment, validateCalculationData, parseNumber } from '../../utils/calculations';
import { saveCalculation } from '../../services/googleSheetsService';
import type { CalculationRecord } from '../../services/googleSheetsService';
import CalculationResult from './CalculationResult';

interface FormData {
  productPrice: string;
  downPayment: string;
  interestRate: string;
  months: string;
}

interface FormErrors {
  productPrice?: string;
  downPayment?: string;
  interestRate?: string;
  months?: string;
  general?: string;
}

const CalculatorForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    productPrice: '',
    downPayment: '',
    interestRate: '',
    months: '12'
  });

  const [result, setResult] = useState<CalculationRecord | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // ล้างข้อผิดพลาดเมื่อผู้ใช้แก้ไข
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleCalculate = async () => {
    setIsCalculating(true);
    
    // แปลงข้อมูลเป็นตัวเลข
    const data = {
      productPrice: parseNumber(formData.productPrice),
      downPayment: parseNumber(formData.downPayment),
      interestRate: parseNumber(formData.interestRate),
      months: parseNumber(formData.months)
    };

    // ตรวจสอบความถูกต้อง
    const validation = validateCalculationData(data);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      setIsCalculating(false);
      return;
    }

    try {
      // คำนวณ
      const calculation = calculateMonthlyPayment(
        data.productPrice,
        data.downPayment,
        data.interestRate,
        data.months
      );

      const resultData: CalculationRecord = {
        ...data,
        ...calculation,
        timestamp: new Date().toISOString()
      };

      setResult(resultData);
      setErrors({});

      // บันทึกข้อมูลลง Google Sheets
      setIsSaving(true);
      const saveResult = await saveCalculation(resultData);
      
      if (!saveResult.success) {
        console.error('ไม่สามารถบันทึกข้อมูลได้:', saveResult.message);
        // แจ้งเตือนผู้ใช้แต่ไม่ต้องหยุดการทำงาน
      }

    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการคำนวณ:', error);
      setErrors({ general: 'เกิดข้อผิดพลาดในการคำนวณ' });
    } finally {
      setIsCalculating(false);
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setFormData({
      productPrice: '',
      downPayment: '',
      interestRate: '',
      months: '12'
    });
    setResult(null);
    setErrors({});
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          คำนวณค่างวดรายเดือน
        </h2>
        
        {errors.general && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
            {errors.general}
          </div>
        )}

        <div className="space-y-6">
          <Input
            label="ราคาสินค้า"
            type="number"
            placeholder="กรอกราคาสินค้า (บาท)"
            value={formData.productPrice}
            onChange={handleInputChange('productPrice')}
            error={errors.productPrice}
            required
            inputMode="numeric"
          />

          <Input
            label="เงินดาวน์"
            type="number"
            placeholder="กรอกจำนวนเงินดาวน์ (บาท)"
            value={formData.downPayment}
            onChange={handleInputChange('downPayment')}
            error={errors.downPayment}
            inputMode="numeric"
          />

          <Input
            label="อัตราดอกเบี้ยต่อปี"
            type="number"
            placeholder="กรอกอัตราดอกเบี้ย (%)"
            value={formData.interestRate}
            onChange={handleInputChange('interestRate')}
            error={errors.interestRate}
            required
            step="0.1"
            inputMode="decimal"
          />

          <Input
            label="จำนวนเดือนที่ผ่อน"
            type="number"
            placeholder="กรอกจำนวนเดือน"
            value={formData.months}
            onChange={handleInputChange('months')}
            error={errors.months}
            required
            min="1"
            max="120"
            inputMode="numeric"
          />
          <br/>
          <div className="flex">
            <Button
              variant="primary"
              onClick={handleCalculate}
              loading={isCalculating}
              disabled={isCalculating || isSaving}
              className="flex-2"
              size="md"
              style={{
                background: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '14px 28px',
                fontSize: '16px',
                fontWeight: '600',
                transition: 'background-color 0.2s ease',
                flex: '2',
                marginRight: '16px'
              }}
            >
              {isCalculating ? 'กำลังคำนวณ...' : 'คำนวณ'}
            </Button>
            
            <Button
              variant="secondary"
              onClick={handleReset}
              disabled={isCalculating || isSaving}
              size="md"
              className="flex-1"
              style={{
                background: '#f3f4f6',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'background-color 0.2s ease',
                flex: '1'
              }}
            >
              ล้างข้อมูล
            </Button>
          </div>
        </div>
      </div>

      {result && (
        <CalculationResult 
          result={result} 
          isSaving={isSaving}
        />
      )}
    </div>
  );
};

export default CalculatorForm;
