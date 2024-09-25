import React, { useRef, useState } from 'react';
import { getDocument } from 'pdfjs-dist/build/pdf';
import './uploadPdf.css'

const PdfUploader = ({ onPdfUpload }) => {
  const [pageCount, setPageCount] = useState(0);
  const canvasRefs = useRef([]);
  console.log(pageCount)
  const handlePdfUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onload = async (e) => {
      const pdfBytes = new Uint8Array(e.target.result);
      onPdfUpload(pdfBytes); 

      const pdf = await getDocument(pdfBytes).promise;
      setPageCount(pdf.numPages);

      canvasRefs.current = []; 

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1 });
        
        const desiredWidth = 600; 
        const scale = desiredWidth / viewport.width;
        const canvas = document.createElement('canvas');
        canvas.width = desiredWidth;
        canvas.height = viewport.height * scale;

        const context = canvas.getContext('2d');
        const renderContext = {
          canvasContext: context,
          viewport: page.getViewport({ scale }), 
        };
        await page.render(renderContext).promise;

        canvasRefs.current.push(canvas); 
      }

      setTimeout(() => {
        const container = document.getElementById('pdf-container');
        container.innerHTML = ''; 
        canvasRefs.current.forEach((canvas) => container.appendChild(canvas)); 
      }, 0);
    };

    fileReader.readAsArrayBuffer(file);
  };

  const renderGridMarkers = () => {
    const markers = [];
    for (let i = 0; i <= 700; i += 100) { 
    //   markers.push(
    //     <div
    //       key={`marker-${i}`}
    //       style={{
    //         position: 'absolute',
    //         top: '0',
    //         left: `${i}px`,
    //         height: '10px',
    //         width: '2px', // Make the marker slightly wider for visibility
    //         backgroundColor: 'lightgray',
    //         pointerEvents: 'none',
    //         marginTop:'50px',
            
    //       }}
    //     />
    //   );

      // Adding Labels
      markers.push(
        <div
          key={`label-${i}`}
          style={{
            position: 'absolute',
            top: '-20px', 
            left: `${i}px`,
            transform: 'translateX(-50%)',
            fontSize: '10px',
            color: 'black',
            pointerEvents: 'none',
            marginTop:'-50px',
            paddingLeft:'8rem'
          }}
        >
          {i}
        </div>
      );
    }
    return markers;
  };

  return (
    <div className="topdiv">
      <div className="upload-space">
      <h2 className='upload-head'>Upload and View PDF</h2>
      <input className='upload-inp' type="file" accept="application/pdf" onChange={handlePdfUpload} />
        </div>
    <div className="middiv">
    <div style={{ position: 'relative', width: '800px', margin: '20px auto' }}>
      <div
        id="pdf-container"
        style={{
          border: '1px solid black',
          marginTop: '150px',
          width: '80%',
          maxHeight: '500px',
          overflowY: 'scroll',
          position: 'relative',
          left:'4rem',
          zIndex:10,
        }}
      />
      {/* Grid overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          // left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          backgroundImage: 'linear-gradient(to right, lightgray 1px, transparent 1px)',
          backgroundSize: '100px 100px',
          backgroundPosition: '0 0',
          marginTop:'-50px',
          left:'4rem',
          zIndex:1,
        }}
      />
      {/* Grid markers */}
      <div style={{ position: 'absolute', top: 0, left: 0, height: '500px', width: '800px' }}>
        {renderGridMarkers()}
      </div>
    </div>
    </div>
    </div>
  );
};

export default PdfUploader;





// SECONDARY CODE TEST

// import React, { useRef } from 'react';
// import { getDocument } from 'pdfjs-dist/build/pdf';

// const PdfUploader = () => {
//   const canvasRef = useRef(null);

//   const handlePdfUpload = async (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     const fileReader = new FileReader();
//     fileReader.onload = async (e) => {
//       const pdfBytes = new Uint8Array(e.target.result);

//       // Load the PDF document
//       const pdf = await getDocument(pdfBytes).promise;
//       const page = await pdf.getPage(1);
//       const viewport = page.getViewport({ scale: 1 });

//       const canvas = canvasRef.current;
//       const context = canvas.getContext('2d');
//       canvas.width = viewport.width;
//       canvas.height = viewport.height;

//       // Render the PDF page into the canvas context
//       const renderContext = {
//         canvasContext: context,
//         viewport: viewport,
//       };
//       await page.render(renderContext).promise;
//     };

//     fileReader.readAsArrayBuffer(file);
//   };

//   return (
//     <div>
//       <h2>Upload and View PDF</h2>
//       <input type="file" accept="application/pdf" onChange={handlePdfUpload} />
//       <canvas ref={canvasRef} style={{ border: '1px solid black', marginTop: '20px' }} />
//     </div>
//   );
// };

// export default PdfUploader;