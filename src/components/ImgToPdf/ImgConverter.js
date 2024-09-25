import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './imgconvert.css';

const ImageItem = ({ index, image, onMove }) => {
  const [, drag] = useDrag({
    type: 'image',
    item: { index },
  });

  const [, drop] = useDrop({
    accept: 'image',
    hover(item, monitor) {
      if (item.index === index) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      onMove(dragIndex, hoverIndex);
    },
  });

  return (
    <div ref={(node) => drag(drop(node))} className="image-container">
      <img src={image} alt={`Image ${index}`} />
    </div>
  );
};

function ImageUploader() {
  const [images, setImages] = useState([]);
  const [imageOrder, setImageOrder] = useState([]);
  const [imageDimensions, setImageDimensions] = useState([]);

  useEffect(() => {
    const fetchImageDimensions = async () => {
      const dimensions = await Promise.all(
        images.map((image) =>
          new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve({ width: img.width, height: img.height });
            img.src = image;
          })
        )
      );
      setImageDimensions(dimensions);
    };
    fetchImageDimensions();
  }, [images]);

  const handleFileSelect = (e) => {
    const selectedFiles = e.target.files;

    const selectedImageUrls = [];
    for (let i = 0; i < selectedFiles.length; i++) {
      selectedImageUrls.push(URL.createObjectURL(selectedFiles[i]));
    }

    setImages((prevImages) => [...prevImages, ...selectedImageUrls]);
    setImageOrder((prevOrder) => [...prevOrder, ...selectedImageUrls.map((_, i) => i)]);
  };

  const handleMove = (dragIndex, hoverIndex) => {
    const newOrder = Array.from(imageOrder);
    [newOrder[dragIndex], newOrder[hoverIndex]] = [newOrder[hoverIndex], newOrder[dragIndex]];
    setImageOrder(newOrder);
  };

  const downloadPDF = () => {
    const pdfDoc = new jsPDF();

    imageOrder.forEach((index) => {
      const { width: imgWidth, height: imgHeight } = imageDimensions[index];

      const pageWidth = pdfDoc.internal.pageSize.getWidth();
      const pageHeight = pdfDoc.internal.pageSize.getHeight();
      const widthScale = pageWidth / imgWidth;
      const heightScale = pageHeight / imgHeight;
      const scale = Math.min(widthScale, heightScale);

      const centerX = pageWidth / 2;
      const centerY = pageHeight / 2;
      const x = centerX - (imgWidth * scale) / 2;
      const y = centerY - (imgHeight * scale) / 2;

      pdfDoc.addImage(images[index], 'JPEG', x, y, imgWidth * scale, imgHeight * scale);

      if (index !== imageOrder[imageOrder.length - 1]) {
        pdfDoc.addPage();
      }
    });

    pdfDoc.save('images.pdf');
  };

  return (
    <div>
      <DndProvider backend={HTML5Backend}>
        <div className="image-list">
          {imageOrder.map((index, i) => (
            <ImageItem key={index} index={i} image={images[index]} onMove={handleMove} />
          ))}
        </div>
      </DndProvider>
      <input type="file" className="img-inp" multiple onChange={handleFileSelect} />
      <button className="download-img-btn" onClick={downloadPDF}>Download PDF</button>
      <style jsx>{`
        .image-list {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 1rem;
        }

        .image-container {
          background-color: #ffd390;
          padding: 1rem;
          border-radius: 0.5rem;
        }

        .image-container img {
          max-width: 200px;
          height: auto;
        }
      `}</style>
    </div>
  );
}

export default ImageUploader;