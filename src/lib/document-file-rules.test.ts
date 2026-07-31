import { describe, expect, it } from 'vitest';
import { MAX_DOCUMENT_FILE_SIZE, validateDocumentFile } from './document-file-rules';

describe('document file validation', () => {
  it('accepts a PDF that matches the selected format', () => {
    expect(() => validateDocumentFile({ size: 1024, type: 'application/pdf' }, 'PDF')).not.toThrow();
  });

  it('rejects a file whose MIME type does not match the selected format', () => {
    expect(() => validateDocumentFile({ size: 1024, type: 'application/pdf' }, 'DOC')).toThrow('文件类型与所选文档格式不匹配');
  });

  it('rejects empty and oversized files', () => {
    expect(() => validateDocumentFile({ size: 0, type: 'application/pdf' }, 'PDF')).toThrow('文件大小应在 1B 到 20MB 之间');
    expect(() => validateDocumentFile({ size: MAX_DOCUMENT_FILE_SIZE + 1, type: 'application/pdf' }, 'PDF')).toThrow('文件大小应在 1B 到 20MB 之间');
  });
});
