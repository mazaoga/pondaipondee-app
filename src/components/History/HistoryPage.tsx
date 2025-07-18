import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../UI/Layout';
import Button from '../UI/Button';
import BackIcon from '../Icons/BackIcon';
import HistoryItem from './HistoryItem';
import { getCalculationHistory } from '../../services/googleSheetsService';
import type { CalculationRecord } from '../../services/googleSheetsService';

const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [historyData, setHistoryData] = useState<CalculationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const result = await getCalculationHistory();
      
      if (result.success) {
        setHistoryData(result.data || []);
      } else {
        setError(result.message || 'ไม่สามารถโหลดข้อมูลได้');
        setHistoryData([]);
      }
    } catch (err) {
      console.error('เกิดข้อผิดพลาดในการโหลดประวัติ:', err);
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      setHistoryData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchHistory();
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'ไม่ระบุวันที่';
    }
  };

  return (
    <Layout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/')}
          className="flex items-center gap-2"
        >
          <BackIcon className="w-4 h-4" />
          กลับ
        </Button>
        
        <h1 className="text-xl font-semibold text-gray-800">
          ประวัติการคำนวณ
        </h1>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          {isLoading ? 'โหลด...' : 'รีเฟรช'}
        </Button>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="card text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={handleRefresh} size="sm">
              ลองใหม่
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && historyData.length === 0 && (
          <div className="card text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              ยังไม่มีประวัติการคำนวณ
            </h3>
            <p className="text-gray-500 mb-4">
              เริ่มคำนวณค่างวดเพื่อดูประวัติที่นี่
            </p>
            <Button 
              onClick={() => navigate('/')}
              size="sm"
            >
              ไปคำนวณ
            </Button>
          </div>
        )}

        {/* History List */}
        {!isLoading && !error && historyData.length > 0 && (
          <div className="space-y-3">
            <div className="text-sm text-gray-600 mb-4">
              พบ {historyData.length} รายการ
            </div>
            
            {historyData.map((item, index) => (
              <HistoryItem
                key={item.id || index}
                data={item}
                formatDate={formatDate}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default HistoryPage;
