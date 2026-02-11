export function formatDateToISO(date: string | Date): string {
  if(date instanceof Date){
    return date.toISOString().split('T')[0]
  }

  return date.split('T')[0];
}

export function formatDateToISOWithTime(date: string | Date): string {
  if(date instanceof Date){
    return date.toISOString();
  }

  return date.split('T')[0] + ' at ' + date.split('T')[1].split(':').slice(0, 2).join(':');
}

export function getNotebookStatus(total: number, prePayment: number) {
  if (total === 0 && prePayment === 0) {
    return { label: "still", color: "light" };
  }

  if (prePayment >= total) {
    return { label: "paid", color: "success" };
  }

  return { label: "not paid", color: "warning" };
}


function deepSearchMatch(value: any, search: string): boolean {
  if (value == null) return false;

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value).toLowerCase().includes(search);
  }

  if (Array.isArray(value)) {
    return value.some((item) => deepSearchMatch(item, search));
  }

  if (typeof value === 'object') {
    return Object.values(value).some((val) => deepSearchMatch(val, search));
  }

  return false;
}

export function filterItems<T>(items: T[], search: string): T[] {
  const lowerSearch = search.toLowerCase();
  return items.filter((item) => deepSearchMatch(item, lowerSearch));
}
