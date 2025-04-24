import { validationMessages } from '@/constants/message.constant';

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

const ALLOWED_MIME_TYPES = [
  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
  'audio/webm',
  'audio/aac',
  'audio/x-m4a',
];

const ALLOWED_EXTENSIONS = ['mp3', 'wav', 'ogg', 'm4a', 'aac'];

const formatSize = (bytes: number) => {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(2)} MB`;
};

export async function validateAudioFile(
  file: File,
  maxSize: number = 10 * 1024 * 1024
): Promise<ValidationResult> {
  if (file.size > maxSize) {
    return {
      valid: false,
      error: validationMessages.lengthMax(formatSize(maxSize)),
    };
  }

  if (file.size === 0) {
    return { valid: false, error: validationMessages.emty };
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { valid: false, error: validationMessages.unsupportedFormat };
  }

  const extension = file.name.split('.').pop()?.toLowerCase();
  if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
    return { valid: false, error: validationMessages.fileExtension };
  }

  return { valid: true };
}
