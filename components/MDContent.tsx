import React from "react";
import ReactMarkdown from "react-markdown";

interface MDContentProps {
  children: string;
}

const MDContent: React.FC<MDContentProps> = ({ children }) => {
  return (
    <div className="markdown-content">
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  );
};

export default MDContent;
