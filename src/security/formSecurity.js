export const sanitizeText = (value, { maxLength = 500, preserveNewLines = false } = {}) => {
  if (typeof value !== "string") return "";

  let sanitized = value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");

  if (preserveNewLines) {
    sanitized = sanitized.replace(/[\t\r]/g, " ");
    sanitized = sanitized.replace(/\n{3,}/g, "\n\n");
  } else {
    sanitized = sanitized.replace(/\s+/g, " ");
  }

  sanitized = sanitized.replace(/[<>]/g, "").trim();
  return sanitized.slice(0, maxLength);
};

export const sanitizePhone = (value) => {
  if (typeof value !== "string") return "";
  return value.replace(/[^\d+\s()-]/g, "").trim();
};

export const sanitizeSafeUrl = (value) => {
  if (typeof value !== "string") return null;

  const raw = value.trim();
  if (!raw) return null;

  try {
    const parsed = new URL(raw);
    const protocol = parsed.protocol.toLowerCase();
    if (protocol !== "http:" && protocol !== "https:") {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
};
