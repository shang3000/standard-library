export const MAX_DOCUMENT_FILE_SIZE = 20 * 1024 * 1024;

const ACCEPTED_TYPES: Record<string, string> = {
  'application/pdf': 'PDF',
  'application/msword': 'DOC',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOC',
  'application/vnd.ms-excel': 'XLS',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLS',
  'application/vnd.ms-powerpoint': 'PPT',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PPT',
};

export function validateDocumentFile(file: Pick<File, 'size' | 'type'>, format: string) {
  if (file.size === 0 || file.size > MAX_DOCUMENT_FILE_SIZE) throw new Error('文件大小应在 1B 到 20MB 之间');
  if (ACCEPTED_TYPES[file.type] !== format) throw new Error('文件类型与所选文档格式不匹配');
}
