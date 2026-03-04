import { useReactToPrint } from 'react-to-print';

export function useExportPdf(contentRef: React.RefObject<HTMLElement>, documentTitle: string) {
  const handlePrint = useReactToPrint({
    contentRef: contentRef,
    documentTitle: documentTitle,
  });

  return handlePrint;
}
