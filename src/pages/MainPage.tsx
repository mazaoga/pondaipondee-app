import { useNavigate } from 'react-router-dom';
import Layout from '../components/UI/Layout';
import Button from '../components/UI/Button';
import CalculatorForm from '../components/Calculator/CalculatorForm';
import HistoryIcon from '../components/Icons/HistoryIcon';

const MainPage = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 text-center sm:text-left">
          PonDaiPonDee
        </h1>
        
        <div className="flex gap-3 justify-center sm:justify-end">
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate('/history')}
            className="flex items-center justify-center gap-2 min-w-[120px]"
          >
            <HistoryIcon className="w-5 h-5" />
            ประวัติ
          </Button>
        </div>
      </div>

      {/* Calculator Form */}
      <CalculatorForm />
      
      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>แอปคำนวณค่างวดรายเดือน</p>
        <p>ใช้งานง่าย รวดเร็ว แม่นยำ</p>
      </div>
    </Layout>
  );
};

export default MainPage;
