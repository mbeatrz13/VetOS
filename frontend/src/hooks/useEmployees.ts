import { useState, useEffect, useCallback } from 'react';
import { employeeService, EmployeeAPI } from '../services/employee.service';

export function useEmployees() {
  const [employees, setEmployees] = useState<EmployeeAPI[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = useCallback(async (search?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await employeeService.list(search);
      setEmployees(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const createEmployee = async (data: Partial<EmployeeAPI>) => {
    const created = await employeeService.create(data);
    setEmployees(prev => [...prev, created]);
    return created;
  };

  const updateEmployee = async (id: number, data: Partial<EmployeeAPI>) => {
    const updated = await employeeService.update(id, data);
    setEmployees(prev => prev.map(e => (e.id === id ? updated : e)));
    return updated;
  };

  const deleteEmployee = async (id: number) => {
    await employeeService.delete(id);
    setEmployees(prev => prev.filter(e => e.id !== id));
  };

  return { employees, loading, error, fetchEmployees, createEmployee, updateEmployee, deleteEmployee };
}
