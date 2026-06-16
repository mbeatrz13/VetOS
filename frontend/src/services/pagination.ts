export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export function getPaginatedResults<T>(response: PaginatedResponse<T> | T[]): T[] {
  if (Array.isArray(response)) {
    return response;
  }
  return (response as PaginatedResponse<T>).results || [];
}
