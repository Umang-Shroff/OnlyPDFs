import './App.css';
import React from 'react';
import { useState} from 'react';
import ModifyPdf from './components/modifyPdf/modifyPdf';
import PdfUploader from './components/uploadPdf/uploadPdf';
import ImageToPdfUploader from './components/ImgToPdf/ImgConverter';

const App = () => {
  const [activeComponent, setActiveComponent] = useState('A');
  const [pdfBytes, setPdfBytes] = useState(null);
  const handleComponentChange = (component) => {
    setActiveComponent(component);
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navv" style={{ position: 'sticky', top: 0, backgroundColor: '#fff', paddingLeft: '0px',width:'100vw',height:'70px',zIndex:'100', boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)' }}>
        <button className="nav-btn" onClick={() => handleComponentChange('A')}>Edit PDF</button>
        <button className="nav-btn" onClick={() => handleComponentChange('B')}>Image to PDF</button>
      </nav>

      {/* Component Rendering */}
      <div style={{ marginTop: '20px' }}>
        {activeComponent === 'A' && <PdfUploader onPdfUpload={setPdfBytes}/> }
        {activeComponent === 'A' && pdfBytes && <ModifyPdf pdfBytes={pdfBytes}/>}
        {/* {pdfBytes && <ModifyPdf pdfBytes={pdfBytes} />} */}
        {activeComponent === 'B' && <ImageToPdfUploader/>}
      </div>
    </div>
  );
};

export default App;
