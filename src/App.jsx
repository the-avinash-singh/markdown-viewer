import React, { useRef, useState } from 'react';
import { logToFirebase } from './components/firebase';
import './App.css';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow as syntaxStyle } from 'react-syntax-highlighter/dist/esm/styles/prism';

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
        logToFirebase(markdown.replace(/!\[.*?\]\(.*?\)/g, ''));
      } catch (err) {
        console.error('Failed to copy: ', err);
      }

      // Clean up
      selection.removeAllRanges();
      document.body.removeChild(tempElement);
    }
  }

  return (
    <>
        <div className='intro-div'>
      <div className='text'>Welcome to Markdown Viewer!.md</div>
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
        <ReactMarkdown  remarkPlugins={[remarkBreaks, remarkGfm]}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <SyntaxHighlighter style={syntaxStyle} language={match[1]} PreTag="div" {...props}>
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }
          }}>
            {markdown.replace(/!\[.*?\]\(.*?\)/g, '')}
            </ReactMarkdown>
      </div>
    </div>
    </>
  );
}

export default App;
