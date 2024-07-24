import React, { useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { logToFirebase } from './components/firebase';
import htmlToPdfmake from 'html-to-pdfmake';
import './App.css';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts  from 'pdfmake/build/vfs_fonts';
import remarkBreaks from 'remark-breaks';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

function App() {
  const [markdown, setMarkdown] = useState('');
  const previewRef = useRef(null);

  function copyToClipboard() {
    const element = previewRef.current;
    if (element) {
      // Create a temporary HTML element to hold the HTML content
      const tempElement = document.createElement('div');
      tempElement.innerHTML = element.innerHTML;

      tempElement.style.backgroundColor = 'white';
      document.body.appendChild(tempElement);

      // Select the HTML content
      const range = document.createRange();
      range.selectNode(tempElement);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);

      // Copy the selected content to the clipboard
      try {
        document.execCommand('copy');
        console.log('Copied to clipboard');
        logToFirebase(markdown);
      } catch (err) {
        console.error('Failed to copy: ', err);
      }

      // Clean up
      selection.removeAllRanges();
      document.body.removeChild(tempElement);
    }
  }


function downloadAsPDF() {
  const element = previewRef.current;
  if (element) {
    const html = element.innerHTML;
    const documentDefinition = {
      content: htmlToPdfmake(html),
    };
    pdfMake.createPdf(documentDefinition).download('markdown-preview.pdf');
  }
}

  return (
    <>
        <div className='intro-div'>
      <div className='text'>Welcome to Markdown Viewer!.md</div>
        <button onClick={downloadAsPDF}>Download as PDF</button>
        <button onClick={copyToClipboard}>Copy to Clipboard</button>
        </div>
    <div className="container">
      <div className="input-pane">
        <textarea
          style={{ width: '100%', height: '100%' }}
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          placeholder="Enter Markdown text here..."
        />
      </div>
      <div className="preview-pane" ref={previewRef}>
        <ReactMarkdown remarkPlugins={[remarkGfm,remarkBreaks]}>{markdown.replace(/!\[.*?\]\(.*?\)/g, '')}</ReactMarkdown>
      </div>
    </div>
    </>
  );
}

export default App;
