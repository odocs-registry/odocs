// Version comparison utility
export function compareVersions(a: string, b: string): number {
  const aParts = a.split('.').map(Number);
  const bParts = b.split('.').map(Number);
  
  for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
    const aPart = aParts[i] || 0;
    const bPart = bParts[i] || 0;
    
    if (aPart !== bPart) {
      return aPart - bPart;
    }
  }
  
  return 0;
}

// Check if version satisfies version range
export function satisfiesVersion(version: string, range: string): boolean {
  // Simplified version for prototype
  if (range === '*' || range === 'latest') {
    return true;
  }
  
  // Handle exact match
  if (range.startsWith('=')) {
    return version === range.substring(1);
  }
  
  // Handle >= version
  if (range.startsWith('>=')) {
    return compareVersions(version, range.substring(2)) >= 0;
  }
  
  // Handle > version
  if (range.startsWith('>')) {
    return compareVersions(version, range.substring(1)) > 0;
  }
  
  // Handle <= version
  if (range.startsWith('<=')) {
    return compareVersions(version, range.substring(2)) <= 0;
  }
  
  // Handle < version
  if (range.startsWith('<')) {
    return compareVersions(version, range.substring(1)) < 0;
  }
  
  // Default to exact match
  return version === range;
}
