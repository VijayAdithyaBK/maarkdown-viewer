
import React from "react";
import { FileText } from "lucide-react";

export const Header: React.FC = () => {
  return (
    <header className="py-4 px-6 border-b animate-fade-in flex items-center gap-2">
      <FileText className="h-5 w-5 text-primary" />
      <h1 className="text-xl font-medium">Markdown Viewer</h1>
    </header>
  );
};
