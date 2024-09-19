
import './App.css';
import { useEffect, useState } from 'react';
import { extractPdf, uploadPdf } from './Api/pdfapis';
import {toast, Toaster} from 'sonner'
import { pdfjs, Document , Page } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;



function App() {
  const [file, setFile] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [selectedPages, setSelectedPages] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      return toast.error('Select a PDF');
    }
    if (file.type !== 'application/pdf') {
      return toast.error('File type must be PDF');
    }

    const formData = new FormData();
    formData.append('pdf', file);

    const response = await uploadPdf(formData);
    if (response.data.success) {
      console.log(URL.createObjectURL(file))
      setPdf(URL.createObjectURL(file));
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handlePageSelection = (pageNumber) => {
    setSelectedPages((prev) =>
      prev.includes(pageNumber)
        ? prev.filter((p) => p !== pageNumber)
        : [...prev, pageNumber]
    );
  };

  const handleExtractPages = async () =>{
    console.log("In here")
    console.log("s",selectedPages)
    if(selectedPages.length == 0){
      toast.error("No pages selected")
    }else{
      const formData = new FormData()
      formData.append('pdf',file)
      formData.append('pages',JSON.stringify(selectedPages))

      console.log("FormData being sent: ", formData.get('pages')); 
      console.log("PDF file in FormData: ", formData.get('pdf'));

      const response = await extractPdf(formData)
      if(response.data){
        const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      window.open(pdfUrl, '_blank');

      }
    }
  }

  return (
    <>
      <div className='h-screen flex items-center justify-center bg-gray-100'>
        <Toaster richColors position='bottom-right' />
        <div className='bg-white p-8 rounded-lg shadow-lg flex flex-col'>
          <label className='text-sm p-2'>Select a file to upload</label>
          <form onSubmit={handleSubmit}>
            <input
              type='file'
              onChange={handleFileChange}
              className='focus:outline-none border text-sm border-gray-400 rounded-md'
              name='pdf'
            />
            <button
              className='ms-2 text-sm bg-black text-white rounded-md w-20 h-8'
              type='submit'
            >
              Submit
            </button>
          </form>
        </div>
      </div>
      
      {pdf && (
          <div className='flex justify-center'>
            <Document
              file={pdf}
              onLoadSuccess={onDocumentLoadSuccess}
            >
              {Array.from(new Array(numPages), (el, index) => (
                <div key={index}>
                  <Page
                    pageNumber={index + 1}
                    renderMode='canvas'
                  />
                  <button className='font-mono'
                    onClick={() => handlePageSelection(index + 1)}
                  >
                    {selectedPages.includes(index + 1)
                      ? 'Deselect'
                      : 'Select'}{' '}
                    Page {index + 1}
                  </button>
                </div>
              ))}
            </Document>
            <div>
            <button
            className='ms-2 mt-24 text-xs  bg-black text-white rounded-md w-24 h-10'
            onClick={handleExtractPages}
          >
            Extract Pages
          </button>
            </div>
         
          </div>
        )}
    </>
    
  );
}

export default App;