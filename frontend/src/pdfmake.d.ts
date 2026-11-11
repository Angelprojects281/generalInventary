// pdfmake 0.3.x no publica tipos propios: se declara el módulo que se usa
// (mismo criterio que frontend/src/vanta.d.ts para "vanta").

interface PdfMakeFontFamily {
  normal: string;
  bold: string;
  italics: string;
  bolditalics: string;
}

// Mapa de ficheros del sistema de archivos virtual: nombre -> base64 o
// { data, encoding }.
interface PdfMakeVirtualFileSystem {
  [fileName: string]: string | { data: string; encoding?: string };
}

interface PdfMakeDocument {
  info?: {
    title?: string;
    author?: string;
    subject?: string;
    creator?: string;
  };
  pageSize?: string;
  pageMargins?: [number, number, number, number];
  defaultStyle?: {
    font?: string;
    fontSize?: number;
  };
  header?: (
    currentPage: number,
    pageCount: number,
    pageSize: { width: number; height: number },
  ) => unknown;
  content?: unknown[];
  footer?: (currentPage: number, pageCount: number) => unknown;
}

interface PdfMakeInstance {
  fonts: Record<string, PdfMakeFontFamily>;
  vfs: PdfMakeVirtualFileSystem;
  setFonts(fonts: Record<string, PdfMakeFontFamily>): void;
  addVirtualFileSystem(vfs: PdfMakeVirtualFileSystem): void;
  createPdf(documentDefinition: PdfMakeDocument): {
    download(fileName?: string): void;
  };
}

declare module "pdfmake/build/pdfmake" {
  const pdfMake: PdfMakeInstance;
  export default pdfMake;
}

declare module "pdfmake/build/vfs_fonts" {
  const pdfFonts: PdfMakeVirtualFileSystem;
  export default pdfFonts;
}
