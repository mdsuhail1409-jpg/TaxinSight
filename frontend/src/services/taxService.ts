import apiClient from './api';
import {
  DashboardSummaryData,
  RevenueAnalyticsData,
  RegionalAnalyticsData,
  ITRAnalyticsData,
  StatisticalAnalyticsData,
  DataQualityAnalyticsData,
  DatasetItem,
  DatasetPreviewData,
} from '../types';

export const taxService = {
  async getDashboardSummary(financialYear?: string): Promise<DashboardSummaryData> {
    const params = financialYear ? { financial_year: financialYear } : {};
    const res = await apiClient.get('/api/dashboard/summary', { params });
    return res.data.data;
  },

  async getRevenueAnalytics(startYear?: string, endYear?: string): Promise<RevenueAnalyticsData> {
    const params: Record<string, string> = {};
    if (startYear) params.start_year = startYear;
    if (endYear) params.end_year = endYear;
    const res = await apiClient.get('/api/analytics/revenue', { params });
    return res.data.data;
  },

  async getRegionalAnalytics(financialYear?: string, zone?: string): Promise<RegionalAnalyticsData> {
    const params: Record<string, string> = {};
    if (financialYear) params.financial_year = financialYear;
    if (zone && zone !== 'All') params.zone = zone;
    const res = await apiClient.get('/api/analytics/regional', { params });
    return res.data.data;
  },

  async getITRAnalytics(assessmentYear?: string): Promise<ITRAnalyticsData> {
    const params = assessmentYear ? { assessment_year: assessmentYear } : {};
    const res = await apiClient.get('/api/analytics/itr', { params });
    return res.data.data;
  },

  async getStatisticalAnalytics(assessmentYear?: string): Promise<StatisticalAnalyticsData> {
    const params = assessmentYear ? { assessment_year: assessmentYear } : {};
    const res = await apiClient.get('/api/analytics/statistics', { params });
    return res.data.data;
  },

  async getDataQualityAnalytics(): Promise<DataQualityAnalyticsData> {
    const res = await apiClient.get('/api/analytics/data-quality');
    return res.data.data;
  },

  async getDatasets(): Promise<DatasetItem[]> {
    const res = await apiClient.get('/api/datasets');
    return res.data.data;
  },

  async getDatasetPreview(datasetId: string): Promise<DatasetPreviewData> {
    const res = await apiClient.get(`/api/datasets/${datasetId}/preview`);
    return res.data.data;
  },

  async uploadDataset(file: File, description?: string): Promise<DatasetItem> {
    const formData = new FormData();
    formData.append('file', file);
    if (description) formData.append('description', description);
    const res = await apiClient.post('/api/datasets/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },

  async processDataset(datasetId: string) {
    const res = await apiClient.post(`/api/datasets/${datasetId}/process`);
    return res.data.data;
  },

  getPDFReportUrl(financialYear?: string): string {
    const base = apiClient.defaults.baseURL || 'http://127.0.0.1:8000';
    return `${base}/api/reports/pdf${financialYear ? `?financial_year=${financialYear}` : ''}`;
  },

  getExcelReportUrl(financialYear?: string): string {
    const base = apiClient.defaults.baseURL || 'http://127.0.0.1:8000';
    return `${base}/api/reports/excel${financialYear ? `?financial_year=${financialYear}` : ''}`;
  },
};
