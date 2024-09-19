
import React from 'react'
import { Document,Page } from 'react-pdf'
function pdf() {
    const [file,setFile] = useState(null)
    const [pdf, setPdf] = useState(null);
    const [pages, setPages] = useState([]);
    const [selectedPages, setSelectedPages] = useState([]);
    const [numPages, setNumPages] = useState(null);
    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
      };
    
      const handlePageSelection = (pageNumber) => {
        setSelectedPages(prev => 
          prev.includes(pageNumber) 
            ? prev.filter(p => p !== pageNumber) 
            : [...prev, pageNumber]
        );
      };

  return (
    <Document
    file={file}
    onLoadSuccess={onDocumentLoadSuccess}
  >
    {pages.map(pageNumber => (
      <div key={pageNumber}>
        <Page
          pageNumber={pageNumber + 1}
          renderMode="canvas"
        />
        <button onClick={() => handlePageSelection(pageNumber + 1)}>
          {selectedPages.includes(pageNumber + 1) ? "Deselect" : "Select"} Page {pageNumber + 1}
        </button>
      </div>
    ))}
  </Document>
  )
}

export default pdf