import path from 'node:path';
import fs from 'fs/promises';
import { UPLOAD_DIR } from '../constants/index.js';

export const saveFileToUploadDir = async (file) => {
  const targetPath = path.join(UPLOAD_DIR, file.filename);
  await fs.rename(file.path, targetPath);
  return targetPath;
};
