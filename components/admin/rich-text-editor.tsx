"use client"

import { useState, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Bold, Italic, Heading1, Heading2, List, ListOrdered, Table, Eye, Code, Quote, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  const [isPreview, setIsPreview] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const insertMarkdown = useCallback(
    (before: string, after = "", placeholder = "") => {
      const textarea = textareaRef.current
      if (!textarea) return

      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selectedText = value.substring(start, end) || placeholder

      const newValue = value.substring(0, start) + before + selectedText + after + value.substring(end)

      onChange(newValue)

      // Set cursor position after insertion
      setTimeout(() => {
        textarea.focus()
        const newPosition = start + before.length + selectedText.length
        textarea.setSelectionRange(newPosition, newPosition)
      }, 0)
    },
    [value, onChange],
  )

  const insertPriceTable = useCallback(() => {
    const table = `
<div class="price-table">
  <table>
    <thead>
      <tr>
        <th>Edition</th>
        <th>Features</th>
        <th>Price</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Standard</td>
        <td>Base game</td>
        <td>NPR 5,999</td>
      </tr>
      <tr>
        <td>Deluxe</td>
        <td>Base game + DLC</td>
        <td>NPR 7,999</td>
      </tr>
      <tr>
        <td>Ultimate</td>
        <td>All content</td>
        <td>NPR 9,999</td>
      </tr>
    </tbody>
  </table>
</div>
`
    onChange(value + table)
  }, [value, onChange])

  const toolbarButtons = [
    { icon: Heading1, action: () => insertMarkdown("<h1>", "</h1>", "Heading 1"), title: "Heading 1" },
    { icon: Heading2, action: () => insertMarkdown("<h2>", "</h2>", "Heading 2"), title: "Heading 2" },
    { icon: Bold, action: () => insertMarkdown("<strong>", "</strong>", "bold text"), title: "Bold" },
    { icon: Italic, action: () => insertMarkdown("<em>", "</em>", "italic text"), title: "Italic" },
    { icon: List, action: () => insertMarkdown("<ul>\n  <li>", "</li>\n</ul>", "List item"), title: "Bullet List" },
    {
      icon: ListOrdered,
      action: () => insertMarkdown("<ol>\n  <li>", "</li>\n</ol>", "List item"),
      title: "Numbered List",
    },
    { icon: Quote, action: () => insertMarkdown("<blockquote>", "</blockquote>", "Quote"), title: "Quote" },
    { icon: Code, action: () => insertMarkdown("<code>", "</code>", "code"), title: "Code" },
    { icon: Minus, action: () => insertMarkdown("<hr />\n", "", ""), title: "Horizontal Rule" },
    { icon: Table, action: insertPriceTable, title: "Insert Price Table" },
  ]

  return (
    <div className={cn("rounded-lg border border-zinc-700 overflow-hidden", className)}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 bg-zinc-800 border-b border-zinc-700 flex-wrap">
        {toolbarButtons.map((btn, i) => (
          <Button
            key={i}
            type="button"
            variant="ghost"
            size="sm"
            onClick={btn.action}
            title={btn.title}
            className="h-8 w-8 p-0 text-zinc-400 hover:text-white hover:bg-zinc-700"
          >
            <btn.icon className="h-4 w-4" />
          </Button>
        ))}
        <div className="flex-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsPreview(!isPreview)}
          className={cn(
            "h-8 px-3 text-zinc-400 hover:text-white hover:bg-zinc-700",
            isPreview && "bg-zinc-700 text-white",
          )}
        >
          <Eye className="h-4 w-4 mr-1.5" />
          Preview
        </Button>
      </div>

      {/* Editor / Preview */}
      {isPreview ? (
        <div
          className="p-4 min-h-[200px] bg-zinc-900 prose prose-invert prose-zinc max-w-none
            prose-headings:text-white prose-h1:text-2xl prose-h1:font-bold prose-h1:mb-4 prose-h1:mt-6
            prose-h2:text-xl prose-h2:font-semibold prose-h2:mb-3 prose-h2:mt-5
            prose-p:text-zinc-300 prose-p:leading-relaxed
            prose-strong:text-white prose-em:text-zinc-300
            prose-ul:text-zinc-300 prose-ol:text-zinc-300
            prose-li:marker:text-orange-500
            prose-blockquote:border-l-orange-500 prose-blockquote:text-zinc-400
            prose-code:text-orange-400 prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
            prose-hr:border-zinc-700
            [&_.price-table]:my-6 [&_.price-table_table]:w-full [&_.price-table_table]:border-collapse
            [&_.price-table_th]:bg-zinc-800 [&_.price-table_th]:text-white [&_.price-table_th]:font-semibold
            [&_.price-table_th]:px-4 [&_.price-table_th]:py-3 [&_.price-table_th]:text-left [&_.price-table_th]:border-b [&_.price-table_th]:border-zinc-700
            [&_.price-table_td]:px-4 [&_.price-table_td]:py-3 [&_.price-table_td]:text-zinc-300 [&_.price-table_td]:border-b [&_.price-table_td]:border-zinc-800
            [&_.price-table_tr:hover_td]:bg-zinc-800/50"
          dangerouslySetInnerHTML={{ __html: value || "<p class='text-zinc-500'>No content yet...</p>" }}
        />
      ) : (
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || "Write your description here... Use the toolbar to format text."}
          rows={10}
          className="border-0 rounded-none bg-zinc-900 text-white resize-none focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[200px] font-mono text-sm"
        />
      )}

      {/* Help text */}
      <div className="px-3 py-2 bg-zinc-800/50 border-t border-zinc-700 text-xs text-zinc-500">
        Supports HTML: &lt;h1&gt;, &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;ol&gt;,
        &lt;li&gt;, &lt;blockquote&gt;, &lt;code&gt;, &lt;hr&gt;, and price tables
      </div>
    </div>
  )
}
