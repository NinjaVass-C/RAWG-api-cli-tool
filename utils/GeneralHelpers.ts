// removes html tags from string, needed for formatting due to how
// descriptions are stored on the database for the api.
export function stripHtml(html: string): string {
    return html
        .replace(/<[^>]*>/g, "") // remove tags
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">");
}