"use client";

import { useState } from "react";
import { Check, Copy, Hash, Instagram, Linkedin, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalysisResult } from "@/types/analysis";

interface ContentSectionProps {
  title: string;
  description: string;
  content: string;
  icon: React.ReactNode;
}

function ContentSection({ title, description, content, icon }: ContentSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            {icon}
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <Button variant="ghost" size="sm" onClick={handleCopy}>
          {copied ? (
            <Check className="h-4 w-4 text-emerald-400" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-300">
        {content}
      </div>
    </Card>
  );
}

interface ContentSectionsProps {
  analysis: AnalysisResult;
}

export function ContentSections({ analysis }: ContentSectionsProps) {
  return (
    <div className="space-y-6">
      <ContentSection
        title="AI Summary"
        description="Executive brief from Reddit research"
        content={analysis.summary}
        icon={<FileText className="h-5 w-5 text-indigo-400" />}
      />
      <ContentSection
        title="LinkedIn Post"
        description="Ready-to-publish professional post"
        content={analysis.linkedinPost}
        icon={<Linkedin className="h-5 w-5 text-blue-400" />}
      />
      <ContentSection
        title="Instagram Caption"
        description="Engaging caption for social media"
        content={analysis.instagramCaption}
        icon={<Instagram className="h-5 w-5 text-pink-400" />}
      />
      <ContentSection
        title="Suggested Hashtags"
        description="Optimized hashtags for reach"
        content={analysis.hashtags}
        icon={<Hash className="h-5 w-5 text-violet-400" />}
      />
    </div>
  );
}
