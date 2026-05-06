/**
 * File handler for processing uploaded news articles
 * Supports .txt and .pdf formats
 */

import * as fs from "fs";
import * as path from "path";

export interface FileContent {
  text: string;
  filename: string;
  fileType: "text" | "pdf";
}

/**
 * Read text file content
 */
export async function readTextFile(filePath: string): Promise<string> {
  try {
    const content = await fs.promises.readFile(filePath, "utf-8");
    return content;
  } catch (error) {
    throw new Error(`Failed to read text file: ${error}`);
  }
}

/**
 * Extract text from PDF file
 * For now, returns a placeholder - in production, use pdf-parse or similar
 */
export async function extractTextFromPdf(filePath: string): Promise<string> {
  try {
    // In a production environment, you would use a library like pdf-parse
    // For this implementation, we'll use a simple approach
    // Install: npm install pdf-parse pdfjs-dist

    // Placeholder implementation - in real scenario, use pdf-parse
    const content = await fs.promises.readFile(filePath);

    // For now, return a message indicating PDF processing
    // In production: const pdfParse = require('pdf-parse');
    // const data = await pdfParse(content);
    // return data.text;

    console.log("PDF file received, returning placeholder text");
    return "PDF content would be extracted here in production environment";
  } catch (error) {
    throw new Error(`Failed to extract text from PDF: ${error}`);
  }
}

/**
 * Process uploaded file and extract content
 */
export async function processUploadedFile(
  filePath: string,
  filename: string
): Promise<FileContent> {
  const ext = path.extname(filename).toLowerCase();

  if (ext === ".txt") {
    const text = await readTextFile(filePath);
    return {
      text,
      filename,
      fileType: "text",
    };
  } else if (ext === ".pdf") {
    const text = await extractTextFromPdf(filePath);
    return {
      text,
      filename,
      fileType: "pdf",
    };
  } else {
    throw new Error("Unsupported file format. Please use .txt or .pdf");
  }
}

/**
 * Validate file size (max 10MB)
 */
export function validateFileSize(
  fileSize: number,
  maxSizeMB: number = 10
): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return fileSize <= maxSizeBytes;
}

/**
 * Validate file extension
 */
export function validateFileExtension(filename: string): boolean {
  const allowedExtensions = [".txt", ".pdf"];
  const ext = path.extname(filename).toLowerCase();
  return allowedExtensions.includes(ext);
}

/**
 * Clean up temporary file
 */
export async function cleanupTempFile(filePath: string): Promise<void> {
  try {
    await fs.promises.unlink(filePath);
  } catch (error) {
    console.warn(`Failed to cleanup temporary file: ${error}`);
  }
}
