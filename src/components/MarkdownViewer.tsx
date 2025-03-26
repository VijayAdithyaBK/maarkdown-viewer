
import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useTheme, backgroundColorMap, fontFamilyMap } from "./ThemeProvider";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Copy, ArrowLeft, Download, Maximize, Minimize, Upload } from "lucide-react";
import { toast } from "sonner";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

interface MarkdownViewerProps {
  initialMarkdown?: string;
}

const defaultMarkdown = `# Welcome to the Markdown Viewer

This is a simple markdown viewer that supports all the common markdown syntax.

## Features

- **Bold** and *italic* text
- Lists (ordered and unordered)
- [Links](https://example.com)
- Code blocks
- And more!

### Code Example

\`\`\`js
function greeting() {
  console.log("Hello, world!");
}
\`\`\`

> This is a blockquote. It can span multiple lines and can contain other markdown elements.

#### Table Example

| Name | Description |
| ---- | ----------- |
| Item 1 | Description of item 1 |
| Item 2 | Description of item 2 |

Try editing this markdown to see the changes in real-time!
`;

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ 
  initialMarkdown = defaultMarkdown 
}) => {
  const [markdown, setMarkdown] = useState(initialMarkdown);
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { 
    fontSize, 
    fontFamily, 
    backgroundColor, 
    blueLightFilter,
    fontWeight,
    letterSpacing,
    lineHeight
  } = useTheme();
  const previewRef = useRef<HTMLDivElement>(null);
  const markdownContainerRef = useRef<HTMLDivElement>(null);
  const fullScreenRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Apply theme to markdown container
  useEffect(() => {
    if (markdownContainerRef.current) {
      markdownContainerRef.current.style.fontSize = `${fontSize}px`;
      markdownContainerRef.current.style.fontWeight = fontWeight.toString();
      markdownContainerRef.current.style.letterSpacing = `${letterSpacing}px`;
      markdownContainerRef.current.style.lineHeight = lineHeight.toString();
    }
  }, [fontSize, fontWeight, letterSpacing, lineHeight]);

  // Fullscreen functionality
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      if (fullScreenRef.current?.requestFullscreen) {
        fullScreenRef.current.requestFullscreen()
          .then(() => {
            setIsFullScreen(true);
            setViewMode("preview"); // Switch to preview mode when entering fullscreen
          })
          .catch(err => {
            toast.error("Error attempting to enable full-screen mode:", err.message);
          });
      }
    } else {
      document.exitFullscreen()
        .then(() => {
          setIsFullScreen(false);
        })
        .catch(err => {
          toast.error("Error attempting to exit full-screen mode:", err.message);
        });
    }
  };

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(markdown);
    toast.success("Markdown copied to clipboard");
  };

  const copyPreviewToClipboard = () => {
    if (previewRef.current) {
      const previewText = previewRef.current.innerText;
      navigator.clipboard.writeText(previewText);
      toast.success("Preview content copied to clipboard");
    }
  };

  const downloadAsTxt = () => {
    const element = document.createElement("a");
    const file = new Blob([markdown], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "markdown.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Downloaded as TXT");
  };

  const downloadAsDoc = () => {
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML to Word Document with JavaScript</title></head><body>";
    const footer = "</body></html>";
    
    if (previewRef.current) {
      const sourceHTML = header + previewRef.current.innerHTML + footer;
      
      const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
      const fileDownload = document.createElement("a");
      document.body.appendChild(fileDownload);
      fileDownload.href = source;
      fileDownload.download = 'document.doc';
      fileDownload.click();
      document.body.removeChild(fileDownload);
      toast.success("Downloaded as DOC");
    }
  };

  // Completely revised PDF generation for better reliability
  const downloadAsPdf = async () => {
    if (!previewRef.current) return;
    
    try {
      toast.info("Generating PDF...", { duration: 2000 });
      
      // Create a temporary container to hold a clone of the content
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '-9999px';
      tempContainer.style.width = '210mm'; // A4 width
      document.body.appendChild(tempContainer);
      
      // Clone the content
      const clone = previewRef.current.cloneNode(true) as HTMLElement;
      
      // Apply styles to the clone
      clone.style.width = '100%';
      clone.style.overflow = 'visible';
      clone.style.height = 'auto';
      clone.style.padding = '20px';
      clone.style.fontSize = `${fontSize}px`;
      clone.style.fontWeight = fontWeight.toString();
      clone.style.letterSpacing = `${letterSpacing}px`;
      clone.style.lineHeight = lineHeight.toString();
      
      // Background and text color
      const bgColor = backgroundColor === 'dark' ? '#121212' : 
                      backgroundColor === 'cream' ? '#FEF7CD' : '#ffffff';
      const textColor = backgroundColor === 'dark' ? '#ffffff' : '#000000';
      
      clone.style.color = textColor;
      clone.style.backgroundColor = bgColor;
      
      tempContainer.appendChild(clone);
      
      // Create PDF with appropriate dimensions
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });
      
      // Function to add a page of content to the PDF
      const addPageToPdf = async (element: HTMLElement, pdf: jsPDF, isFirstPage = false) => {
        const canvas = await html2canvas(element, {
          scale: 2, // Higher scale for better quality
          useCORS: true,
          logging: false,
          allowTaint: true,
          backgroundColor: bgColor
        });
        
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        
        if (!isFirstPage) {
          pdf.addPage();
        }
        
        // Add image with proper dimensions to fit the page
        pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
      };
      
      // Measure the total height of the content
      const contentHeight = tempContainer.scrollHeight;
      const pageHeight = 297; // A4 height in mm
      const safeContentHeight = pageHeight - 20; // Leave some margin
      const pageCount = Math.ceil(contentHeight / safeContentHeight);
      
      // If content fits on one page
      if (pageCount <= 1) {
        await addPageToPdf(tempContainer, pdf, true);
      } else {
        // For multi-page content, split it into pages
        for (let i = 0; i < pageCount; i++) {
          // Create a container for this page's content
          const pageContainer = document.createElement('div');
          pageContainer.style.position = 'absolute';
          pageContainer.style.left = '-9999px';
          pageContainer.style.top = '-9999px';
          pageContainer.style.width = '210mm';
          pageContainer.style.height = '297mm';
          pageContainer.style.overflow = 'hidden';
          pageContainer.style.backgroundColor = bgColor;
          document.body.appendChild(pageContainer);
          
          // Clone the content again for this page
          const pageClone = previewRef.current.cloneNode(true) as HTMLElement;
          pageClone.style.position = 'absolute';
          pageClone.style.top = `-${i * safeContentHeight}mm`;
          pageClone.style.width = '100%';
          pageClone.style.padding = '10mm';
          pageClone.style.color = textColor;
          pageClone.style.backgroundColor = bgColor;
          pageClone.style.fontSize = `${fontSize}px`;
          pageClone.style.fontWeight = fontWeight.toString();
          pageClone.style.letterSpacing = `${letterSpacing}px`;
          pageClone.style.lineHeight = lineHeight.toString();
          
          pageContainer.appendChild(pageClone);
          
          // Add this page to the PDF
          await addPageToPdf(pageContainer, pdf, i === 0);
          
          // Update progress
          toast.info(`Generating PDF... ${Math.round((i+1)/pageCount * 100)}%`, { id: 'pdf-progress' });
          
          // Clean up
          document.body.removeChild(pageContainer);
        }
      }
      
      // Clean up temp container
      document.body.removeChild(tempContainer);
      
      // Save the PDF
      pdf.save('markdown.pdf');
      toast.success("Downloaded as PDF");
      
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Failed to generate PDF. Please try with smaller content.");
    }
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Only accept .md and .txt files
    if (file.type !== 'text/markdown' && file.type !== 'text/plain' && !file.name.endsWith('.md')) {
      toast.error("Please upload a markdown (.md) or text (.txt) file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === 'string') {
        setMarkdown(content);
        toast.success(`File '${file.name}' loaded successfully`);
      }
    };
    reader.onerror = () => {
      toast.error("Error reading file");
    };
    reader.readAsText(file);
    
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const renderEditMode = () => (
    <div className="h-full p-2 md:p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h2 className="text-lg font-medium">Editor</h2>
        <div className="flex gap-1 md:gap-2 flex-wrap">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={copyToClipboard}
            title="Copy markdown"
          >
            <Copy className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Copy</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={triggerFileUpload}
            title="Upload markdown file"
          >
            <Upload className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Upload</span>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileUpload} 
              accept=".md,.txt,text/markdown,text/plain" 
              className="hidden" 
            />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setViewMode("preview")}
            title="Switch to preview"
          >
            <Eye className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Preview</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullScreen}
            title="Enter fullscreen mode"
          >
            <Maximize className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Fullscreen</span>
          </Button>
        </div>
      </div>
      <Textarea 
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
        className={`w-full flex-1 min-h-[calc(100vh-200px)] font-mono text-sm resize-none border-none outline-none focus-visible:ring-0 p-4 ${
          backgroundColorMap[backgroundColor]
        }`}
        placeholder="Enter your markdown here..."
      />
    </div>
  );

  const renderPreviewMode = () => (
    <div className="h-full min-h-screen p-2 md:p-4 flex flex-col">
      {!isFullScreen && (
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setViewMode("edit")}
            className="flex items-center"
            title="Back to editor"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Back to Editor</span>
          </Button>
          <div className="flex items-center gap-1 md:gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={copyPreviewToClipboard}
              title="Copy preview content"
            >
              <Copy className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Copy</span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Download</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={downloadAsTxt}>
                  Download as TXT
                </DropdownMenuItem>
                <DropdownMenuItem onClick={downloadAsDoc}>
                  Download as DOC
                </DropdownMenuItem>
                <DropdownMenuItem onClick={downloadAsPdf}>
                  Download as PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullScreen}
              title="Enter fullscreen mode"
            >
              <Maximize className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Fullscreen</span>
            </Button>
          </div>
        </div>
      )}
      {isFullScreen && (
        <div className="fixed top-4 right-4 z-10">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleFullScreen}
            className="rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-sm"
            title="Exit fullscreen"
          >
            <Minimize className="h-4 w-4" />
          </Button>
        </div>
      )}
      <div 
        className={`flex-1 ${isFullScreen ? 'p-0' : 'p-4 md:p-6'} overflow-auto transition-colors duration-300 rounded-md ${backgroundColorMap[backgroundColor]} ${fontFamilyMap[fontFamily]} w-full max-w-full`}
        ref={previewRef}
      >
        <div className={`w-full mx-auto animate-fade-in ${isFullScreen ? 'max-w-full px-4 sm:px-6 md:px-8' : ''}`} ref={markdownContainerRef}>
          <div className="markdown-body prose max-w-none w-full">
            <ReactMarkdown>
              {markdown}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div 
      className={`flex flex-col h-[calc(100vh-65px)] ${backgroundColorMap[backgroundColor]}`}
      ref={fullScreenRef}
    >
      {viewMode === "edit" ? renderEditMode() : renderPreviewMode()}
    </div>
  );
};
