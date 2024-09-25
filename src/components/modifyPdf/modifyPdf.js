import React from 'react';
import { useState } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
// import fontkit from '@pdf-lib/fontkit';
import './modifyPdf.css'

const ModifyPdf = ({ pdfBytes }) => {

    const [xdist, setXdist] = useState(0);
    const [ydist, setYdist] = useState(0);
    const [textChange, setTextChange] = useState('');
    const [fontChange, setFontChange] = useState(0);

  const handleModifyPdf = async () => {
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();

    const text = textChange;
    const fontSize = parseInt(fontChange);

    const textWidth = helveticaFont.widthOfTextAtSize(text, fontSize);
    const textHeight = fontSize; 

    firstPage.drawRectangle({
      x: parseInt(xdist),   //x: 450
      y: 770-parseInt(ydist),   //y: 660
      width: textWidth+5,
      height: textHeight + 5, 
      color: rgb(1, 1, 1), 
      // borderColor: rgb(0, 0, 0), 
      // borderWidth: 1,
    });

    const timesNewRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    firstPage.drawText(text, {
      x: parseInt(xdist)+5,     //x:450 + 5
      y: 770-parseInt(ydist)+5,     //y:660 + 5
      size: fontSize,
      font: timesNewRomanFont,
      color: rgb(0,0,0),
    });

    firstPage.drawText(text, {
      x: parseInt(xdist)+5.5,     //x:450 + 5
      y: 770-parseInt(ydist)+5,     //y:660 + 5
      size: fontSize,
      font: timesNewRomanFont,
      color: rgb(0,0,0),
    });
    
    const modifiedPdfBytes = await pdfDoc.save();

    const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
    const urlBlob = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = urlBlob;
    link.download = 'modified_pdf.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(urlBlob); 
    setTextChange('');
    setXdist(0);
    setYdist(0);
    setFontChange(0);
  };

  return (
    <div className="inp-div">
      <h2 className="input-head">Enter values for Text overlay</h2>
      <h4>Enter Text to be added: <input className="inps" value={textChange} type='text' onChange={(e)=>setTextChange(e.target.value)}/></h4>
      <h4>Enter x: <input className="inps" type='number' value={xdist} onChange={(e)=>setXdist(e.target.value)} /></h4>
      <h4>Enter y: <input className="inps" type='number' value={ydist} onChange={(e)=>setYdist(e.target.value)}/></h4>
      <p>For eg: x = 300 , y = 100 for Top-Center</p>
      <h4>Enter Font size: <input value={fontChange} className="inps" type='number' onChange={(e)=>setFontChange(e.target.value)}/></h4>
      <span className="span-note">By default font : Times New Roman Bold</span>
      <button className='modify-btn' onClick={handleModifyPdf}>UPDATE PDF</button>
    </div>
  );
};

export default ModifyPdf;



// SECONDARY CODE TEST


// import React from 'react';
// import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// const ModifyPdf = () => {
//   const handleModifyPdf = async () => {
//     const url = 'https://pdf-lib.js.org/assets/with_update_sections.pdf';
//     // const url = 'pdfLoad/pdfone.pdf';
//     const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer());

//     const pdfDoc = await PDFDocument.load(existingPdfBytes);
//     const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

//     const pages = pdfDoc.getPages();
//     const firstPage = pages[0];
//     const { width, height } = firstPage.getSize();

//     // Set text properties
//     const text = 'This text was added with JavaScript!';
//     const fontSize = 25;

//     // Calculate width and height for the rectangle
//     const textWidth = helveticaFont.widthOfTextAtSize(text, fontSize);
//     const textHeight = fontSize; // Approximate height for the rectangle

//     // Draw a white rectangle below the text
//     firstPage.drawRectangle({
//       x: 5,
//       y: height / 2 + 300 - textHeight - 10, // Position it below the text
//       width: textWidth,
//       height: textHeight + 10, // Add some padding
//       color: rgb(1, 1, 1), // White color
//       borderColor: rgb(0, 0, 0), // Optional: black border
//       borderWidth: 1, // Optional: border width
//     });

//     // Draw text on top of the rectangle
//     firstPage.drawText(text, {
//       x: 5,
//       y: height / 2 + 250,
//       size: fontSize,
//       font: helveticaFont,
//       color: rgb(0.95, 0.1, 0.1),
//     //   rotate: degrees(-45),
//     });

//     // Serialize the PDFDocument to bytes (a Uint8Array)
//     const pdfBytes = await pdfDoc.save();

//     // Create a Blob from the PDF bytes and generate a download link
//     const blob = new Blob([pdfBytes], { type: 'application/pdf' });
//     const urlBlob = URL.createObjectURL(blob);

//     // Create a link element for downloading
//     const link = document.createElement('a');
//     link.href = urlBlob;
//     link.download = 'modified_pdf.pdf';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(urlBlob); // Cleanup
//   };

//   return (
//     <div>
//       <h2>Modify PDF Example</h2>
//       <button onClick={handleModifyPdf}>Modify PDF</button>
//     </div>
//   );
// };

// export default ModifyPdf;
