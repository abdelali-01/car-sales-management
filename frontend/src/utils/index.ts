export function formatDateToISO(date: string | Date): string {
  if (date instanceof Date) {
    return date.toISOString().split('T')[0]
  }

  return date.split('T')[0];
}

export function formatDateToISOWithTime(date: string | Date): string {
  if (date instanceof Date) {
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

// WhatsApp and phone utilities
export function getWhatsAppLink(phone: string, message?: string): string {
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');

  // Add country code if not present (assuming Algeria +213)
  const phoneWithCode = cleanPhone.startsWith('213') ? cleanPhone : `213${cleanPhone}`;

  if (message) {
    return `https://wa.me/${phoneWithCode}?text=${encodeURIComponent(message)}`;
  }

  return `https://wa.me/${phoneWithCode}`;
}

export function shareOfferViaWhatsApp(
  visitorPhone: string,
  offer: {
    brand: string;
    model: string;
    year: number;
    price: number;
    location: string;
    imageUrl?: string;
    offerUrl?: string;
    km: number;
    remarks?: string;
  }
): string {

  const message = `
 - ${offer.brand} ${offer.model} (${offer.year})
 - ${offer.km} km
 ${offer.remarks ? '- ' + offer.remarks : ''}
 - ${formatPrice(offer.price)}
 - ${offer.location}
`;

  return getWhatsAppLink(visitorPhone, message);
}

export function getCallLink(phone: string): string {
  return `tel:${phone}`;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'DZD',
    minimumFractionDigits: 0
  }).format(price).replace('DZD', 'DA');
}

