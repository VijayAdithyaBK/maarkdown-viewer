
import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useTheme, backgroundColorMap, fontFamilyMap } from "./ThemeProvider";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Copy, ArrowLeft, Download } from "lucide-react";
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

  // Apply theme to markdown container
  useEffect(() => {
    if (markdownContainerRef.current) {
      markdownContainerRef.current.style.fontSize = `${fontSize}px`;
      markdownContainerRef.current.style.fontWeight = fontWeight.toString();
      markdownContainerRef.current.style.letterSpacing = `${letterSpacing}px`;
      markdownContainerRef.current.style.lineHeight = lineHeight.toString();
    }
  }, [fontSize, fontWeight, letterSpacing, lineHeight]);

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

  // Improved PDF generation for large files
  const downloadAsPdf = async () => {
    if (previewRef.current) {
      try {
        toast.info("Generating PDF...");
        
        // Improved approach for PDF generation
        // Use a more robust PDF generation strategy
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });
        
        // Get the content directly
        const content = previewRef.current;
        
        // Set a maximum height for each capture to handle large documents
        const pageHeight = 287; // A4 height with margins (297-10)
        const contentWidth = content.offsetWidth;
        const contentHeight = content.scrollHeight;
        
        // Calculate how many pages we'll need
        const pageCount = Math.ceil(contentHeight / pageHeight);
        
        // Set up the clone for capturing
        const cloneContainer = document.createElement('div');
        cloneContainer.style.position = 'absolute';
        cloneContainer.style.top = '-9999px';
        cloneContainer.style.left = '-9999px';
        cloneContainer.style.width = contentWidth + 'px';
        
        // Clone the content
        const clone = content.cloneNode(true) as HTMLElement;
        
        // Apply styling
        clone.style.width = contentWidth + 'px';
        clone.style.height = 'auto';
        clone.style.overflow = 'visible';
        clone.style.fontSize = `${fontSize}px`;
        clone.style.fontWeight = fontWeight.toString();
        clone.style.letterSpacing = `${letterSpacing}px`;
        clone.style.lineHeight = lineHeight.toString();
        
        // Background and text color based on theme
        const textColor = backgroundColor === 'dark' ? '#ffffff' : '#000000';
        const bgColor = backgroundColor === 'dark' ? '#121212' : 
                        backgroundColor === 'cream' ? '#FEF7CD' : '#ffffff';
        
        clone.style.color = textColor;
        clone.style.backgroundColor = bgColor;
        
        cloneContainer.appendChild(clone);
        document.body.appendChild(cloneContainer);
        
        // Process page by page
        let currentPage = 0;
        
        // Use a simpler method for PDF generation that's more reliable
        const addPage = async (pageNum: number) => {
          if (pageNum > 0) {
            pdf.addPage();
          }
          
          // Set up temporary div for this page segment
          const pageDiv = document.createElement('div');
          pageDiv.style.position = 'absolute';
          pageDiv.style.top = '-9999px';
          pageDiv.style.left = '-9999px';
          pageDiv.style.width = contentWidth + 'px';
          pageDiv.style.height = pageHeight + 'px';
          pageDiv.style.overflow = 'hidden';
          pageDiv.style.backgroundColor = bgColor;
          pageDiv.style.color = textColor;
          
          // Clone content again for this page segment
          const segmentClone = content.cloneNode(true) as HTMLElement;
          segmentClone.style.position = 'absolute';
          segmentClone.style.top = `-${pageNum * pageHeight}px`;
          segmentClone.style.width = '100%';
          segmentClone.style.fontSize = `${fontSize}px`;
          segmentClone.style.fontWeight = fontWeight.toString();
          segmentClone.style.letterSpacing = `${letterSpacing}px`;
          segmentClone.style.lineHeight = lineHeight.toString();
          
          pageDiv.appendChild(segmentClone);
          document.body.appendChild(pageDiv);
          
          try {
            // Capture this page segment
            const canvas = await html2canvas(pageDiv, {
              scale: 2,
              useCORS: true,
              allowTaint: true,
              backgroundColor: bgColor,
              logging: false
            });
            
            // Add to PDF
            const imgData = canvas.toDataURL('image/jpeg', 0.95); // Use JPEG for better compatibility
            pdf.addImage(imgData, 'JPEG', 10, 10, 190, 277);
            
            // Clean up
            document.body.removeChild(pageDiv);
          } catch (error) {
            console.error("Error capturing page", pageNum, error);
            document.body.removeChild(pageDiv);
          }
        };
        
        // Process all pages
        for (let i = 0; i < pageCount; i++) {
          await addPage(i);
          // Update progress
          toast.info(`Generating PDF... ${Math.round((i+1)/pageCount * 100)}%`);
        }
        
        // Clean up the main clone
        document.body.removeChild(cloneContainer);
        
        // Save the PDF
        pdf.save("markdown.pdf");
        toast.success("Downloaded as PDF");
        
      } catch (error) {
        console.error("Error generating PDF:", error);
        toast.error("Failed to generate PDF. Try with smaller content or different settings.");
      }
    }
  };

  const renderEditMode = () => (
    <div className="h-full p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Editor</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={copyToClipboard}
            title="Copy markdown"
          >
            <Copy className="h-4 w-4 mr-1" />
            Copy
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setViewMode("preview")}
            title="Switch to preview"
          >
            <Eye className="h-4 w-4 mr-1" />
            Preview
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
    <div className="h-full min-h-screen p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setViewMode("edit")}
          className="flex items-center"
          title="Back to editor"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Editor
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={copyPreviewToClipboard}
            title="Copy preview content"
          >
            <Copy className="h-4 w-4 mr-1" />
            Copy
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Download
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
        </div>
      </div>
      <div 
        className={`flex-1 p-6 overflow-auto transition-colors duration-300 rounded-md ${backgroundColorMap[backgroundColor]} ${fontFamilyMap[fontFamily]} w-full max-w-full`}
        ref={previewRef}
      >
        <div className="w-full mx-auto animate-fade-in" ref={markdownContainerRef}>
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
    <div className={`flex flex-col h-[calc(100vh-65px)] ${backgroundColorMap[backgroundColor]}`}>
      {viewMode === "edit" ? renderEditMode() : renderPreviewMode()}
    </div>
  );
};
