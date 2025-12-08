export function checkMessageSafety(text: string): { safe: boolean; reason?: string } {
  const content = text.toLowerCase();

  // 1. Phone Numbers (Detects 10-digit patterns)
  const phoneRegex = /\b[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}\b/;
  if (phoneRegex.test(content)) {
    return { safe: false, reason: "Sharing phone numbers is strictly prohibited. Keep communication on SkillBridge." };
  }

  // 2. Email Addresses
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  if (emailRegex.test(content)) {
    return { safe: false, reason: "Sharing email addresses is blocked for your safety." };
  }

  // 3. Forbidden Keywords (Leaking platform)
  const badWords = ['whatsapp', 'telegram', 'signal', 'pay outside', 'bank transfer', 'upwork', 'fiverr', 'contact me at'];
  for (const word of badWords) {
    if (content.includes(word)) {
      return { safe: false, reason: `The term "${word}" is flagged. Please adhere to professional guidelines.` };
    }
  }

  return { safe: true };
}