import React, { useEffect, useRef } from 'react';
import { getDocument } from 'pdfjs-dist/build/pdf';
import './modifyPdfViewer.css'

const ModifyPdfViewer = ({ modifiedPdfBytes }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const renderPdf = async (pdfBytes) => {
      const pdf = await getDocument(pdfBytes).promise;
      const container = containerRef.current;
      container.innerHTML = ''; // Clear previous canvases

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1 });
        
        const desiredWidth = 600;
        const scale = desiredWidth / viewport.width;
        const canvas = document.createElement('canvas');

        // Set canvas dimensions
        canvas.width = desiredWidth;
        canvas.height = viewport.height * scale;

        const context = canvas.getContext('2d');
        const renderContext = {
          canvasContext: context,
          viewport: page.getViewport({ scale }),
        };
        await page.render(renderContext).promise;

        // Append the canvas to the container
        container.appendChild(canvas);
      }
    };

    // Only render if modifiedPdfBytes has changed
    if (modifiedPdfBytes) {
      renderPdf(modifiedPdfBytes);
    }

    // Clean up the canvas on component unmount
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [modifiedPdfBytes]);

  return (
    <div className="second-render-body" style={{ marginTop: '20px' }}>
      <h2>Modified PDF Preview</h2>
      <div ref={containerRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} />
    </div>
  );
};

export default ModifyPdfViewer;
