const WORDS_PER_MINUTE = 220;

const stripMarkdown = (content: string) =>
    content
        .replace(/```[\s\S]*?```/g, " ")
        .replace(/`[^`]*`/g, " ")
        .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
        .replace(/\[[^\]]*\]\([^)]+\)/g, " ")
        .replace(/^>\s?/gm, " ")
        .replace(/^#{1,6}\s+/gm, "")
        .replace(/[*_~]/g, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();

export const getReadMinutes = (content: string) => {
    const plainText = stripMarkdown(content);

    if (!plainText) {
        return 1;
    }

    const wordCount = plainText.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
};
