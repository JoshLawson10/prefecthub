export function validateEmail(email: string): boolean {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailRegex.test(email);
}

export function validateEventDates(start: Date, end: Date): void {
  if (end <= start) {
    throw new Error("End date must be after start date");
  }

  const now = new Date();
  if (start < now) {
    throw new Error("Start date cannot be in the past");
  }
}

export function validateFileSize(bytes: number, maxMB: number): boolean {
  const maxBytes = maxMB * 1024 * 1024;
  return bytes <= maxBytes;
}

export function validateFileType(
  mimeType: string,
  allowedTypes: string[],
): boolean {
  return allowedTypes.includes(mimeType);
}

export function validatePhoneNumber(phone: string): boolean {
  const phoneRegex =
    /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,5}[-\s\.]?[0-9]{1,5}$/;
  return phoneRegex.test(phone);
}

export function validateRequiredFields(
  data: Record<string, unknown>,
  requiredFields: string[],
): void {
  const missingFields = requiredFields.filter((field) => !data[field]);

  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
  }
}

export function validateMaxCapacity(
  capacity: number,
  max?: number | null,
): void {
  if (max && capacity > max) {
    throw new Error(`Capacity cannot exceed ${max}`);
  }
}

export function validateYear(year: number): void {
  const currentYear = new Date().getFullYear();
  if (year < 2000 || year > currentYear + 5) {
    throw new Error(`Year must be between 2000 and ${currentYear + 5}`);
  }
}
