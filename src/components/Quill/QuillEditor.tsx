import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // Quill default theme
import MarkdownShortcuts from 'quilljs-markdown';
import TurndownService from 'turndown';

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  isHTML?: boolean;
}

const QuillEditor: React.FC<QuillEditorProps> = ({ value, onChange, isHTML = false }) => {
  const quillRef = useRef<HTMLDivElement | null>(null);

  const turndownService = new TurndownService();

  useEffect(() => {
    if (quillRef.current) {
      const quill = new Quill(quillRef.current, {
        theme: 'snow', // Quill theme
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'], // Text formatting
            ['blockquote', 'code-block'], // Block types
            [{ list: 'ordered' }, { list: 'bullet' }], // Lists
            [{ header: [1, 2, 3, false] }], // Header styles
            ['link'], // Links
          ],
        },
      });

      // Add markdown shortcuts
      new MarkdownShortcuts(quill); // Initialize the markdown shortcuts module

      // Capture content change
      quill.on('text-change', () => {
          const markdown = isHTML ? quill.getSemanticHTML() : turndownService.turndown(quill.getSemanticHTML());
          onChange(markdown);
        //onChange(quill.root.innerHTML); // Update the parent with the new editor content (HTML)
      });

      // Set initial value (in case the value prop changes)
      //quill.root.innerHTML = value;
    }
  }, []);

  return <div ref={quillRef} style={{ height: '400px' }} />;
};

export default QuillEditor;

