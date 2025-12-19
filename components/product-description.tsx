import { cn } from "@/lib/utils"

interface ProductDescriptionProps {
  content: string
  className?: string
}

// Server component for SSR - renders HTML description with proper styling
export function ProductDescription({ content, className }: ProductDescriptionProps) {
  if (!content) return null

  return (
    <div
      className={cn(
        "prose prose-invert prose-zinc max-w-none",
        // Headings
        "prose-headings:text-white",
        "prose-h1:text-2xl prose-h1:font-bold prose-h1:mb-4 prose-h1:mt-6 prose-h1:first:mt-0",
        "prose-h2:text-xl prose-h2:font-semibold prose-h2:mb-3 prose-h2:mt-5",
        "prose-h3:text-lg prose-h3:font-medium prose-h3:mb-2 prose-h3:mt-4",
        // Paragraphs
        "prose-p:text-zinc-300 prose-p:leading-relaxed prose-p:mb-4",
        // Text formatting
        "prose-strong:text-white prose-strong:font-semibold",
        "prose-em:text-zinc-300",
        // Lists
        "prose-ul:text-zinc-300 prose-ul:my-4 prose-ul:pl-6",
        "prose-ol:text-zinc-300 prose-ol:my-4 prose-ol:pl-6",
        "prose-li:text-zinc-300 prose-li:mb-1",
        "prose-li:marker:text-orange-500",
        // Blockquotes
        "prose-blockquote:border-l-4 prose-blockquote:border-orange-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-zinc-400 prose-blockquote:my-4",
        // Code
        "prose-code:text-orange-400 prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm",
        // Horizontal rule
        "prose-hr:border-zinc-700 prose-hr:my-6",
        // Price table styles
        "[&_.price-table]:my-6 [&_.price-table]:overflow-x-auto",
        "[&_.price-table_table]:w-full [&_.price-table_table]:border-collapse [&_.price-table_table]:rounded-lg [&_.price-table_table]:overflow-hidden",
        "[&_.price-table_thead]:bg-gradient-to-r [&_.price-table_thead]:from-orange-600/20 [&_.price-table_thead]:to-orange-500/10",
        "[&_.price-table_th]:text-white [&_.price-table_th]:font-semibold [&_.price-table_th]:px-4 [&_.price-table_th]:py-3 [&_.price-table_th]:text-left [&_.price-table_th]:border-b [&_.price-table_th]:border-zinc-700",
        "[&_.price-table_td]:px-4 [&_.price-table_td]:py-3 [&_.price-table_td]:text-zinc-300 [&_.price-table_td]:border-b [&_.price-table_td]:border-zinc-800",
        "[&_.price-table_tr:last-child_td]:border-b-0",
        "[&_.price-table_tr:hover_td]:bg-zinc-800/50 [&_.price-table_tr:hover_td]:transition-colors",
        "[&_.price-table_tbody_tr:nth-child(even)_td]:bg-zinc-900/50",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
