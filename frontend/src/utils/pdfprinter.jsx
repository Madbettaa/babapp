import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logo from './outhers/logo.png';
import Icon from '@mdi/react';
import { mdiFileExport } from '@mdi/js';

const Pdfprinter = ({ filteredPersons, persons }) => {
    const handleExportPDF = ({ tableData }) => {
        if (!tableData || tableData.length === 0) {
          console.error('No data to export.');
          return;
        }
    
        const doc = new jsPDF();

        doc.addImage(logo, 'PNG', 85, 0, 40, 40); 
    
        let startY = 40;
        const chunkSize = 40; 
        const totalPages = Math.ceil(tableData.length / chunkSize);
    
        for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
          const startIdx = (pageNum - 1) * chunkSize;
          const endIdx = Math.min(startIdx + chunkSize, tableData.length);
          const chunkData = tableData.slice(startIdx, endIdx);
    
          const headers = Object.keys(chunkData[0]);
          const headerRows = headers.map((header) => ({ content: header, styles: { fontWeight: 'bold', fontSize: 10, textColor: [255, 255, 255], fillColor: [0, 0, 0], lineWidth: 0.1 } }));
          const bodyRows = chunkData.map((row) => headers.map((header) => row[header]));
    
          doc.autoTable({
            head: [headerRows],
            body: bodyRows,
            startY,
            styles: { fontSize: 8, cellPadding: 2, valign: 'middle', halign: 'center', textColor: [0, 0, 0], lineWidth: 0.1 },
          });
    
          if (pageNum < totalPages) {
            doc.setFontSize(10);
            doc.text(`Page ${pageNum} of ${totalPages}`, 10, doc.internal.pageSize.height - 10);
          }
    
          doc.setFontSize(8);
          doc.text(`Your small sentence here.`, 10, doc.internal.pageSize.height - 5);
    
          if (pageNum < totalPages) {
            doc.addPage();
          }
        }
        doc.save('list.pdf');
      };
  
  return (
    <button onClick={() => handleExportPDF({ tableData: filteredPersons.length > 0 ? filteredPersons : persons })} className='relative w-[1px] left-[97%] bottom-[5vh]'>
      <Icon path={mdiFileExport} size={1} />
    </button>
  );
};

export default Pdfprinter;
