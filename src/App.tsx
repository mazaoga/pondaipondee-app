import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import HistoryPage from './components/History/HistoryPage';
import DebugPage from './pages/DebugPage';
import SummaryPage from './pages/SummaryPage';

function App() {
  // Get base name for GitHub Pages deployment
  const basename = import.meta.env.BASE_URL;
  
  return (
    <Router basename={basename}>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/debug" element={<DebugPage />} />
          <Route path="/summary" element={<SummaryPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
