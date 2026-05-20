export function isNetworkError(error: unknown): boolean {
  if (!error) return false;
  const msg = (error as Error).message ?? '';
  return (
    msg.includes('No internet') ||
    msg.includes('timed out') ||
    msg.toLowerCase().includes('connection')
  );
}
