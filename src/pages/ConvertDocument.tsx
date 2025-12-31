
import React, { useState, useRef, useEffect } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Download, Upload, Home, ArrowRight, Loader2, FileText, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import * as mammoth from "mammoth";
import TurndownService from "turndown";
import * as pdfjsLib from 'pdfjs-dist';
// @ts-ignore
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

// Set up PDF worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const ConvertDocument = () => {
  const [documentText, setDocumentText] = useState("");
  const [markdownText, setMarkdownText] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [isConverted, setIsConverted] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Initialize Turndown service
  const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced'
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsConverting(true);
    setDocumentText("");
    setMarkdownText("");
    setIsConverted(false);
    setFileName(file.name);

    try {
      if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        await convertDocx(file);
      } else if (file.type === 'application/pdf') {
        await convertPdf(file);
      } else {
        toast.error("Unsupported file type. Please upload a Word document (.docx) or PDF file.");
        setIsConverting(false);
      }
    } catch (error) {
      console.error("Error processing file:", error);
      toast.error("Error processing file. Please try again.");
      setIsConverting(false);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const convertDocx = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      const html = result.value;
      const markdown = turndownService.turndown(html);

      setDocumentText("Docx content converted successfully.");
      setMarkdownText(markdown);
      setIsConverted(true);
      toast.success("Word document converted to Markdown!");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to convert Docx: " + err.message);
    } finally {
      setIsConverting(false);
    }
  };

  const convertPdf = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;

      let fullText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageMarkdown = processPdfPage(textContent.items);
        fullText += `## Page ${i}\n\n${pageMarkdown}\n\n`;
      }

      setDocumentText("PDF content extracted with layout analysis.");
      setMarkdownText(fullText);
      setIsConverted(true);
      toast.success("PDF converted to Markdown!");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to convert PDF: " + err.message);
    } finally {
      setIsConverting(false);
    }
  };

  const processPdfPage = (items: any[]) => {
    if (!items || items.length === 0) return "";

    const processedItems = items.map(item => ({
      str: item.str,
      x: item.transform[4],
      y: item.transform[5],
      height: Math.abs(item.transform[3]),
      width: item.width
    }));

    processedItems.sort((a, b) => {
      const yDiff = Math.abs(a.y - b.y);
      if (yDiff < (Math.min(a.height, b.height) / 2)) {
        return a.x - b.x;
      }
      return b.y - a.y;
    });

    const heights = processedItems.map(item => item.height).sort((a, b) => a - b);
    const medianHeight = heights[Math.floor(heights.length / 2)] || 12;

    const lines: { text: string; height: number; y: number }[] = [];
    let currentLine: { text: string; height: number; y: number } | null = null;

    processedItems.forEach(item => {
      if (!currentLine) {
        currentLine = { text: item.str, height: item.height, y: item.y };
        return;
      }
      const yDiff = Math.abs(item.y - currentLine.y);
      if (yDiff < (Math.min(item.height, currentLine.height) / 2)) {
        if (item.str.trim()) {
          currentLine.text += (currentLine.text.endsWith("-") ? "" : " ") + item.str;
          currentLine.height = Math.max(currentLine.height, item.height);
        }
      } else {
        lines.push(currentLine);
        currentLine = { text: item.str, height: item.height, y: item.y };
      }
    });
    if (currentLine) lines.push(currentLine);

    let markdown = "";
    let prevY = lines.length > 0 ? lines[0].y : 0;

    lines.forEach((line, index) => {
      const verticalGap = prevY - line.y;
      if (index > 0 && verticalGap > (line.height * 1.5)) {
        markdown += "\n\n";
      } else if (index > 0) {
        markdown += "\n";
      }
      if (line.height > medianHeight * 1.4) {
        markdown += "## " + line.text;
      } else if (line.height > medianHeight * 1.15) {
        markdown += "### " + line.text;
      } else {
        markdown += line.text;
      }
      prevY = line.y;
    });

    return markdown;
  };

  const downloadMarkdown = () => {
    if (!markdownText) {
      toast.error("No markdown content to download");
      return;
    }
    const element = document.createElement("a");
    const file = new Blob([markdownText], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = fileName ? fileName.replace(/\.[^/.]+$/, "") + ".md" : "converted-document.md";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Markdown file downloaded");
  };

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-6">
      <ThemeProvider>
        {/* Floating Toolbar - Matches MarkdownViewer */}
        <div className="flex justify-between items-center mb-4 p-2 bg-muted/30 rounded-lg border flex-wrap gap-2">
          {/* LEFT: Home and Title */}
          <div className="flex gap-2 items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              title="Back to Home"
              className="h-8 w-8 px-0"
            >
              <Home className="h-4 w-4" />
            </Button>
            <div className="w-px h-6 bg-border mx-1" />

            <span className="text-sm font-semibold ml-1">Convert Document</span>
          </div>

          {/* CENTER: Placeholder for future controls or simple spacing */}
          <div className="flex items-center">
            {/* Could put a logo or step indicator here if needed */}
          </div>

          {/* RIGHT: Actions */}
          <div className="flex gap-1 items-center">
            {(isConverted || isConverting) && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  title="Upload New Document"
                  disabled={isConverting}
                  className="h-8 px-2"
                >
                  {isConverting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                  <span className="hidden sm:inline">{isConverting ? "Processing..." : "New Upload"}</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={downloadMarkdown}
                  disabled={!isConverted}
                  title="Download Markdown"
                  className="h-8 px-2"
                >
                  <Download className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Download</span>
                </Button>
              </>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".docx,.pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf"
              className="hidden"
            />
          </div>
        </div>

        <main className="flex-1 flex flex-col overflow-hidden">
          {!isConverted && !isConverting ? (
            /* Initial State: Hero / Instructions */
            <div className="flex-1 flex flex-col items-center justify-center p-4 animate-in fade-in zoom-in duration-500">
              <div className="max-w-2xl w-full text-center space-y-8">
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold tracking-tight">Convert Documents to Markdown</h2>
                  <p className="text-muted-foreground text-lg">
                    Transform your Word documents and PDFs into clean, formatted Markdown in seconds.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  <div className="p-6 bg-card rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="font-semibold mb-2 flex items-center">
                      <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-2 rounded-full mr-3 text-xs">DOCX</span>
                      Word Documents
                    </h3>
                    <p className="text-sm text-muted-foreground">Preserves formatting like headers, bold text, lists, and tables.</p>
                  </div>
                  <div className="p-6 bg-card rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="font-semibold mb-2 flex items-center">
                      <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-2 rounded-full mr-3 text-xs">PDF</span>
                      PDF Files
                    </h3>
                    <p className="text-sm text-muted-foreground">Intelligent layout analysis extracts text, lines, and paragraphs.</p>
                  </div>
                </div>

                <div className="pt-8">
                  <Button
                    size="lg"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-14 px-8 text-lg shadow-lg hover:shadow-xl transition-all"
                  >
                    <Upload className="mr-2 h-6 w-6" />
                    Select Document to Convert
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            /* Result State: Grid Layout (1:3 ratio) */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 h-full animate-in slide-in-from-bottom-5 duration-500">

              {/* Left Panel: Status & Actions (Compact, 1 col) */}
              <div className="flex flex-col h-fit lg:col-span-1 bg-card rounded-lg border shadow-sm p-5 relative">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Status</h2>

                {isConverting ? (
                  <div className="py-8 flex flex-col items-center justify-center text-muted-foreground">
                    <Loader2 className="h-10 w-10 animate-spin mb-3 text-primary" />
                    <p className="font-medium animate-pulse">Converting...</p>
                    <p className="text-xs mt-1 text-center max-w-[200px] truncate">{fileName}</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Success Card */}
                    <div className="p-4 bg-green-50/50 dark:bg-green-900/10 border border-green-200/60 dark:border-green-900/40 rounded-lg flex flex-col gap-2">
                      <div className="flex items-center text-green-700 dark:text-green-400">
                        <CheckCircle2 className="h-5 w-5 mr-2" />
                        <span className="font-semibold">Complete!</span>
                      </div>
                      <div className="flex items-center text-muted-foreground text-sm bg-background/50 p-2 rounded border border-border/50">
                        <FileText className="h-4 w-4 mr-2 opacity-70" />
                        <span className="truncate" title={fileName}>{fileName}</span>
                      </div>
                    </div>

                    {/* Actions List */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-foreground">Next Steps</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border bg-muted text-[10px] font-medium mr-2">1</span>
                          Review and edit markdown on the right
                        </li>
                        <li className="flex items-start">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border bg-muted text-[10px] font-medium mr-2">2</span>
                          Click <strong className="mx-1">Download</strong> to save
                        </li>
                      </ul>
                    </div>

                    {/* Primary Action */}
                    <div className="pt-2">
                      <Button
                        variant="outline"
                        onClick={() => { setIsConverted(false); setMarkdownText(""); }}
                        className="w-full"
                      >
                        Convert Another File
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Panel: Result (Expanded, 2 cols) */}
              <div className="flex flex-col h-full lg:col-span-2 bg-card rounded-lg border shadow-sm p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Markdown Result</h2>
                </div>

                <Textarea
                  value={markdownText}
                  onChange={(e) => setMarkdownText(e.target.value)}
                  className="flex-1 p-4 resize-none border-0 focus-visible:ring-0 bg-transparent font-mono text-sm leading-relaxed"
                  placeholder={isConverting ? "Waiting for conversion..." : "Converted markdown will appear here..."}
                  spellCheck={false}
                  readOnly={false}
                />
              </div>

            </div>
          )}
        </main>
      </ThemeProvider>
    </div>
  );
};

export default ConvertDocument;
