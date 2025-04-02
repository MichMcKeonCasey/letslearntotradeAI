// /home/project/agents/seoOptimizer.ts
// Placeholder for SEOptimizerAgent implementation

import { AIAgent } from './types';
import { ContentPiece } from './types'; // Import ContentPiece type if needed for context

// Define specific Input/Output types
interface SEOInput {
    contentDraft: string;
    title: string;
    keywords: string[];
    contentType: ContentPiece['type'];
    currentSlug?: string; // Optional: if optimizing existing content
}

interface SEOOutput {
    optimizedTitle: string;
    metaDescription: string;
    slug: string;
    keywordSuggestions?: string[]; // Additional keywords identified
    internalLinkSuggestions?: { text: string; targetSlug: string }[];
    schemaMarkup?: object; // JSON-LD schema
    seoScoreImprovement?: number; // Estimated improvement
}

// Helper function for slug generation (basic example)
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special chars except space/hyphen
        .trim()
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-'); // Replace multiple hyphens with single
}


export class SEOptimizerAgent implements AIAgent<SEOInput, SEOOutput> {
    name = 'SEOptimizerAgent';
    description = 'Optimizes content elements like titles, meta descriptions, slugs, and potentially suggests keywords and internal links for better search engine visibility.';

    async process(input: SEOInput): Promise<SEOOutput> {
        console.log(`SEOptimizer processing title: "${input.title}"`);

        // --- Mock Implementation ---
        // Basic optimization logic
        let optimizedTitle = input.title;
        if (!/\(\d{4}\)/.test(optimizedTitle)) { // Add year if not present
            optimizedTitle += ` (${new Date().getFullYear()})`;
        }
        // Ensure primary keyword is prominent (very basic check)
        if (input.keywords.length > 0 && !optimizedTitle.toLowerCase().includes(input.keywords[0].toLowerCase())) {
             optimizedTitle = `${input.keywords[0]}: ${optimizedTitle}`;
        }
        // Title length check (aim for ~60 chars)
        if (optimizedTitle.length > 65) {
            // Basic truncation (needs smarter logic)
            // optimizedTitle = optimizedTitle.substring(0, 62) + '...';
             console.warn("SEO Title might be too long:", optimizedTitle);
        }


        // Meta Description Generation (very basic)
        let metaDescription = `Learn about ${input.keywords.join(', ')}. This ${input.contentType} covers key concepts. Discover more!`;
        if (input.contentDraft.length > 160) {
            // Try to extract first ~155 chars, ending on a whole word
            const snippet = input.contentDraft.substring(0, 160);
            metaDescription = snippet.substring(0, snippet.lastIndexOf(' ')) + '...';
        }
         // Ensure primary keyword is in meta description
         if (input.keywords.length > 0 && !metaDescription.toLowerCase().includes(input.keywords[0].toLowerCase())) {
             metaDescription = `Learn ${input.keywords[0]}. ${metaDescription}`;
         }
         if (metaDescription.length > 160) {
             metaDescription = metaDescription.substring(0, 157) + '...';
         }


        const slug = input.currentSlug || generateSlug(input.title); // Use existing or generate new

        // --- End Mock Implementation ---

        const output: SEOOutput = {
            optimizedTitle,
            metaDescription,
            slug,
            // keywordSuggestions: ['advanced trading techniques'], // Example
            // internalLinkSuggestions: [{ text: 'our glossary', targetSlug: '/glossary' }], // Example
            seoScoreImprovement: 10, // Mock value
        };

        console.log(`SEOptimizer generated new title: "${optimizedTitle}"`);
        return output;
    }
}
