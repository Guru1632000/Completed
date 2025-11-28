import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { FileInfo } from '../types';

declare global {
  interface Window {
    pdfjsLib: any;
  }
}

const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
    const base64Data = base64.split(',')[1];
    if (!base64Data) {
        throw new Error("Invalid base64 string for PDF");
    }
    const binaryString = window.atob(base64Data);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
};

interface PdfScanningViewProps {
    files: FileInfo[];
    onClose: () => void;
}

const PdfScanningView: React.FC<PdfScanningViewProps> = ({ files, onClose }) => {
    const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);
    const [isClosing, setIsClosing] = useState(false);
    const [pdfDoc, setPdfDoc] = useState<any>(null);
    const [currentPageNum, setCurrentPageNum] = useState(1);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const closeTimerRef = useRef<number | null>(null);

    useEffect(() => {
        setModalRoot(document.getElementById('modal-root'));
    }, []);

    const handleClose = () => {
        if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
        setIsClosing(true);
        closeTimerRef.current = window.setTimeout(onClose, 500); // Animation duration
    };

    // Load PDF
    useEffect(() => {
        const pdfFile = files.find(f => f.mimeType === 'application/pdf' && f.fileContentBase64);
        if (pdfFile) {
            try {
                const loadingTask = window.pdfjsLib.getDocument({ data: base64ToArrayBuffer(pdfFile.fileContentBase64) });
                loadingTask.promise.then((doc: any) => {
                    setPdfDoc(doc);
                }).catch((err: any) => {
                    console.error("Error loading PDF for scanning view:", err);
                    handleClose();
                });
            } catch (error) {
                console.error("Error decoding base64 PDF:", error);
                handleClose();
            }
        } else {
            handleClose();
        }
    }, [files]);

    // Render current page
    useEffect(() => {
        if (pdfDoc && canvasRef.current) {
            pdfDoc.getPage(currentPageNum).then((page: any) => {
                const canvas = canvasRef.current!;
                const context = canvas.getContext('2d');
                if (!context) return;
                
                const desiredWidth = 320;
                const viewport = page.getViewport({ scale: 1 });
                const scale = desiredWidth / viewport.width;
                const scaledViewport = page.getViewport({ scale: scale });

                canvas.height = scaledViewport.height;
                canvas.width = scaledViewport.width;

                const renderContext = {
                    canvasContext: context,
                    viewport: scaledViewport
                };
                page.render(renderContext);
            });
        }
    }, [pdfDoc, currentPageNum]);
    
    // Animate page turning
    useEffect(() => {
        if (pdfDoc) {
            const interval = setInterval(() => {
                setCurrentPageNum(prev => (prev % pdfDoc.numPages) + 1);
            }, 3000); // Match CSS animation time
            return () => clearInterval(interval);
        }
    }, [pdfDoc]);

    if (!modalRoot) return null;

    const modalJsx = (
        <div className={`pdf-page-scanner-overlay ${isClosing ? 'modal-backdrop-animate-exit' : 'modal-backdrop-animate'}`}>
            <div className={`pdf-page-scanner-container ${isClosing ? 'scan-modal-slide-exit' : 'scan-modal-slide-enter'}`}>
                <div className="pdf-page-scanner-content">
                    <canvas ref={canvasRef}></canvas>
                    <div className="pdf-page-scanner-line"></div>
                </div>
                <div className="pdf-page-scanner-info">
                    Scanning Document... Page {currentPageNum} of {pdfDoc?.numPages || 1}
                </div>
            </div>
        </div>
    );
    
    return ReactDOM.createPortal(modalJsx, modalRoot);
};

export default PdfScanningView;