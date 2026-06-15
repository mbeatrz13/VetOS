import { useState, useEffect, useCallback } from 'react';
import { examService, ExamAPI, ExamPayload } from '../services/exam.service';

export function useExams() {
  const [exams, setExams] = useState<ExamAPI[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExams = useCallback(async (search?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await examService.list(search);
      setExams(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  const createExam = async (data: ExamPayload) => {
    const created = await examService.create(data);
    setExams(prev => [...prev, created]);
    return created;
  };

  const updateExam = async (id: number, data: Partial<ExamPayload>) => {
    const updated = await examService.update(id, data);
    setExams(prev => prev.map(e => (e.id === id ? updated : e)));
    return updated;
  };

  return { exams, loading, error, fetchExams, createExam, updateExam };
}
