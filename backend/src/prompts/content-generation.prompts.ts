export const CONTENT_SYSTEM_PROMPT = `You are an expert content strategist and social media copywriter.
You analyze community discussions and turn insights into engaging, platform-appropriate content.
Be factual, concise, and avoid making claims not supported by the source material.
Never invent statistics or quotes that are not present in the research context.`;

export function formatSourceContentForPrompt(redditContent: string): string {
  try {
    const parsed: unknown = JSON.parse(redditContent);

    if (Array.isArray(parsed)) {
      return parsed
        .map((article, index) => {
          const item = article as Record<string, unknown>;

          const title = String(item.title ?? "Untitled");
          const source = String(item.source ?? "Unknown");
          const selftext = String(item.selftext ?? "").trim();
          const url = String(item.url ?? "");

          return [
            `Article ${index + 1}:`,
            `Title: ${title}`,
            `Source: ${source}`,
            `Content: ${selftext || "No content available"}`,
            `URL: ${url}`,
          ].join("\n");
        })
        .join("\n\n");
    }
  } catch {
    // fallback
  }

  return redditContent.trim();
}

export function buildResearchContext(topic: string, redditContent: string): string {
  const formattedPosts = formatSourceContentForPrompt(redditContent);

  return `Research Topic: ${topic}

Reddit Community Insights:
${formattedPosts}`;
}

export function buildSummaryInstruction(): string {
  return `Write a clear, insightful summary (150-250 words) that:
- Captures the main themes and sentiment from the Reddit discussions
- Highlights key pain points, trends, or opinions
- Is written in professional third-person tone
- Is suitable as an executive brief for a content team`;
}

export function buildLinkedInPostInstruction(): string {
  return `Write a LinkedIn post (200-300 words) that:
- Opens with a strong hook related to the topic
- Shares 2-3 actionable insights from the research
- Uses short paragraphs and line breaks for readability
- Ends with a thought-provoking question to drive engagement
- Maintains a professional yet conversational tone
- Includes 2-3 relevant emojis where appropriate`;
}

export function buildInstagramCaptionInstruction(): string {
  return `Write an Instagram caption (100-150 words) that:
- Uses an engaging, casual tone
- Leads with a scroll-stopping first line
- Summarizes the most interesting finding in simple language
- Includes a clear call-to-action (e.g., "Save this post", "Share your thoughts")
- Is optimized for mobile reading with short sentences`;
}

export function buildHashtagsInstruction(): string {
  return `Suggest 10-15 relevant hashtags that:
- Mix popular hashtags (high reach) and niche hashtags (targeted audience)
- Relate directly to the topic and selftext themes
- Are formatted as a single space-separated string (e.g., "#marketing #contentstrategy")
- Do not include hashtags that are unrelated or banned/spammy`;
}

export function buildCombinedGenerationPrompt(
  topic: string,
  redditContent: string
): string {
  const context = buildResearchContext(topic, redditContent);

  return `${context}

Based on the research above, generate all of the following content pieces.

## Summary
${buildSummaryInstruction()}

## LinkedIn Post
${buildLinkedInPostInstruction()}

## Instagram Caption
${buildInstagramCaptionInstruction()}

## Hashtags
${buildHashtagsInstruction()}

Respond with valid JSON only, using this exact structure:
{
  "summary": "string",
  "linkedinPost": "string",
  "instagramCaption": "string",
  "hashtags": "string"
}`;
}

export function buildSummaryPrompt(topic: string, redditContent: string): string {
  return `${buildResearchContext(topic, redditContent)}

${buildSummaryInstruction()}

Respond with only the summary text.`;
}

export function buildLinkedInPostPrompt(
  topic: string,
  redditContent: string
): string {
  return `${buildResearchContext(topic, redditContent)}

${buildLinkedInPostInstruction()}

Respond with only the LinkedIn post text.`;
}

export function buildInstagramCaptionPrompt(
  topic: string,
  redditContent: string
): string {
  return `${buildResearchContext(topic, redditContent)}

${buildInstagramCaptionInstruction()}

Respond with only the Instagram caption text.`;
}

export function buildHashtagsPrompt(topic: string, redditContent: string): string {
  return `${buildResearchContext(topic, redditContent)}

${buildHashtagsInstruction()}

Respond with only the hashtag string.`;
}
