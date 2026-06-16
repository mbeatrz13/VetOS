import { useState, useEffect, useCallback } from 'react';
import { reportService, type ReportSummary } from '../services/report.service';

export function useReports() {
  const [data, setData] = useState<ReportSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async (periodo?: string) => {
    setLoading(true);
    setError(null);
    try {
      const reportsData = await reportService.getSummary(periodo);
      setData(reportsData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return { data, loading, error, fetchReports };
}
