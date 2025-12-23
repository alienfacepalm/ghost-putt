const CODE_LENGTH = 6;
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing chars (0, O, I, 1)

export function generateRoomCode(): string {
  let code = '';
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return code;
}

export function validateRoomCode(code: string): boolean {
  if (code.length !== CODE_LENGTH) return false;
  // Validate against the same character set used for generation (excludes 0, O, I, 1)
  return /^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]+$/.test(code);
}

export function formatRoomCode(code: string): string {
  // Format as XXX-XXX for readability
  if (code.length !== CODE_LENGTH) return code;
  return `${code.slice(0, 3)}-${code.slice(3)}`;
}

