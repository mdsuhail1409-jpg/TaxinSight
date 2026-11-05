import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ExecutiveOverviewPage from './pages/ExecutiveOverviewPage';
import RevenueAnalyticsPage from './pages/RevenueAnalyticsPage';
import RegionalAnalyticsPage from './pages/RegionalAnalyticsPage';
import ITRAnalyticsPage from './pages/ITRAnalyticsPage';
import StatisticalAnalysisPage from './pages/StatisticalAnalysisPage';
import DataQualityPage from './pages/DataQualityPage';
import DatasetManagementPage from './pages/DatasetManagementPage';
import ReportsPage from './pages/ReportsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<ExecutiveOverviewPage />} />
          <Route path="/overview" element={<Navigate to="/" replace />} />
          <Route path="/revenue" element={<RevenueAnalyticsPage />} />
          <Route path="/regional" element={<RegionalAnalyticsPage />} />
          <Route path="/itr" element={<ITRAnalyticsPage />} />
          <Route path="/statistics" element={<StatisticalAnalysisPage />} />
          <Route path="/data-quality" element={<DataQualityPage />} />
          <Route path="/datasets" element={<DatasetManagementPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
