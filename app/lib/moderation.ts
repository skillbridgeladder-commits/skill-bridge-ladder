export function checkMessageSafety(text: string): { safe: boolean; reason?: string } {
  // If text is empty, it's safe (but won't send anyway)
  if (!text) return { safe: true };

  const content = text.toLowerCase();

  // 1. Block Emails
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  if (emailRegex.test(content)) {
    return { safe: false, reason: "Sharing email addresses is blocked." };
  }

  // 2. Block Phone Numbers (approximate)
  const phoneRegex = /\b\d{10}\b/;
  if (phoneRegex.test(content)) {
    return { safe: false, reason: "Sharing phone numbers is blocked." };
  }

  // 3. Block Keywords
  const badWords = ['whatsapp', 'telegram', 'signal', 'pay outside', 'bank transfer'];
  for (const word of badWords) {
    if (content.includes(word)) {
      return { safe: false, reason: `The word "${word}" is flagged for security.` };
    }
  }

  return { safe: true };
}