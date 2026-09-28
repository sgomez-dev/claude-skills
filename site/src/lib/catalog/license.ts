export function detectLicense(text: string): string {
  if (/Permission is hereby granted, free of charge/.test(text)) return 'MIT';
  if (/Apache License[\s\S]{0,200}Version 2\.0/.test(text)) return 'Apache-2.0';
  if (/Creative Commons Attribution 4\.0/i.test(text)) return 'CC-BY-4.0';
  return 'LicenseRef-see-file';
}
