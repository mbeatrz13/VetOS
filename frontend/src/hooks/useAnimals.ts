import { useState, useEffect, useCallback } from 'react';
import { animalService, AnimalAPI, AnimalPayload } from '../services/animal.service';

export function useAnimals() {
  const [animals, setAnimals] = useState<AnimalAPI[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnimals = useCallback(async (search?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await animalService.list(search);
      setAnimals(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnimals();
  }, [fetchAnimals]);

  const createAnimal = async (data: AnimalPayload) => {
    const created = await animalService.create(data);
    setAnimals(prev => [...prev, created]);
    return created;
  };

  const updateAnimal = async (id: number, data: AnimalPayload) => {
    const updated = await animalService.update(id, data);
    setAnimals(prev => prev.map(a => (a.id === id ? updated : a)));
    return updated;
  };

  const deleteAnimal = async (id: number) => {
    await animalService.delete(id);
    setAnimals(prev => prev.filter(a => a.id !== id));
  };

  return { animals, loading, error, fetchAnimals, createAnimal, updateAnimal, deleteAnimal };
}
