
import React, { useState, useRef } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft, Download, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import * as mammoth from "mammoth";

const ConvertDocument = () => {
  const [documentText, setDocumentText] = useState("");
  const [markdownText, setMarkdownText] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [isConverted, setIsConverted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      setIsConverting(true);
      
      if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const arrayBuffer = await file.arrayBuffer();
        
        const result = await mammoth.extractRawText({ arrayBuffer });
        const textContent = result.value;
        
        setDocumentText(textContent);
        convertToMarkdown(textContent);
      } else if (file.type === 'application/pdf') {
        toast.info("PDF conversion requires copy-pasting content. Please copy the text from your PDF and paste it in the editor.");
      } else {
        toast.error("Unsupported file type. Please upload a Word document (.docx) or PDF file.");
      }
    } catch (error) {
      console.error("Error processing file:", error);
      toast.error("Error processing file. Please try again.");
    } finally {
      setIsConverting(false);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const convertToMarkdown = (content?: string) => {
    const textToConvert = content || documentText;
    
    if (!textToConvert.trim()) {
      toast.error("Please enter document content first");
      return;
    }

    setIsConverting(true);
    
    try {
      let converted = textToConvert;
      
      converted = converted.replace(/^(?!#)(.+)\n=+$/gm, '# $1');  // H1
      converted = converted.replace(/^(?!#)(.+)\n-+$/gm, '## $1'); // H2
      
      converted = converted.replace(/^(.*?)\r?\n/gm, (match, p1) => {
        if (p1.length < 80 && p1.trim().length > 0) {
          if (/^[A-Z]/.test(p1) && p1.trim().match(/[.!?]$/) === null) {
            return `# ${p1}\n`;
          }
        }
        return match;
      });
      
      converted = converted.replace(/\*\*(.+?)\*\*/g, '**$1**');  // Already bold
      converted = converted.replace(/\b_(.+?)_\b/g, '*$1*');      // Italic with underscores
      converted = converted.replace(/\b__(.+?)__\b/g, '**$1**');  // Bold with double underscores
      
      converted = converted.replace(/^(\d+)\.\s+(.+)$/gm, '$1. $2');     // Numbered lists
      converted = converted.replace(/^\s*[\*\-•]\s+(.+)$/gm, '- $1');   // Bullet lists (with some common bullet characters)
      
      converted = converted.replace(/(https?:\/\/[^\s]+)/g, '[$1]($1)');
      
      converted = converted.replace(/^([^|\n]+\|[^|\n]+\|[^|\n]+)$/gm, (match) => {
        return match + '\n' + '-'.repeat(match.length);
      });
      
      converted = converted.replace(/^>\s+(.+)$/gm, '> $1');
      
      converted = converted.replace(/^( {4}|\t)(.+)$/gm, '    $2');
      
      converted = converted.replace(/\n{3,}/g, '\n\n');
      
      setMarkdownText(converted);
      setIsConverted(true);
      toast.success("Document converted to Markdown format");
    } catch (error) {
      console.error("Error converting to markdown:", error);
      toast.error("Error converting document. Please try again.");
    } finally {
      setIsConverting(false);
    }
  };

  // Create a wrapper function for the button click event
  const handleConvertButtonClick = () => {
    convertToMarkdown();
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const downloadMarkdown = () => {
    if (!markdownText) {
      toast.error("No markdown content to download");
      return;
    }
    
    const element = document.createElement("a");
    const file = new Blob([markdownText], {type: 'text/markdown'});
    element.href = URL.createObjectURL(file);
    element.download = "converted-document.md";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Markdown file downloaded");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <ThemeProvider>
        <Header />
        <main className="flex-1 flex flex-col p-4">
          <div className="mb-4">
            <Link to="/" className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Home
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Document Content</h2>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={triggerFileUpload}
                  className="flex items-center"
                >
                  <Upload className="h-4 w-4 mr-1" />
                  Upload Document
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileUpload} 
                    accept=".docx,.pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf" 
                    className="hidden" 
                  />
                </Button>
              </div>
              
              <Textarea 
                value={documentText}
                onChange={(e) => setDocumentText(e.target.value)}
                className="flex-1 min-h-[300px] p-4 resize-none"
                placeholder="Paste your document content here or upload a file..."
              />
              
              <Button 
                className="mt-4"
                onClick={handleConvertButtonClick}
                disabled={isConverting || !documentText.trim()}
              >
                {isConverting ? "Converting..." : "Convert to Markdown"}
              </Button>
            </div>
            
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Markdown Result</h2>
                {isConverted && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={downloadMarkdown}
                    className="flex items-center"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download Markdown
                  </Button>
                )}
              </div>
              
              <Textarea 
                value={markdownText}
                onChange={(e) => setMarkdownText(e.target.value)}
                className="flex-1 min-h-[300px] p-4 resize-none font-mono text-sm"
                placeholder="Converted markdown will appear here..."
                readOnly={!isConverted}
              />
              
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                <p>You can edit the markdown text directly if needed. Click the download button to save as a .md file.</p>
              </div>
            </div>
          </div>
        </main>
      </ThemeProvider>
    </div>
  );
};

export default ConvertDocument;
