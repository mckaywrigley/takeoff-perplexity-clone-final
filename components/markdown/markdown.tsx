import { cn } from "@/lib/utils"
import React, { FC, HTMLAttributes } from "react"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import { MarkdownCodeBlock } from "./markdown-codeblock"
import { MarkdownMemoized } from "./markdown-memoized"

interface MarkdownProps extends HTMLAttributes<HTMLDivElement> {
  content: string
}

export const Markdown: FC<MarkdownProps> = ({ content, ...props }) => {
  return (
    <MarkdownMemoized
      className={cn(
        "prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 text-primary min-w-full break-words",
        props.className
      )}
      remarkPlugins={[remarkGfm, remarkMath]}
      components={{
        p({ children }) {
          return <p className="mb-2 last:mb-0">{children}</p>
        },
        img({ node, ...props }) {
          return <img className="max-w-[67%]" {...props} />
        },
        code({ node, className, children, ...props }) {
          const childArray = React.Children.toArray(children)
          const firstChild = childArray[0] as React.ReactElement
          const firstChildAsString = React.isValidElement(firstChild)
            ? (firstChild as React.ReactElement).props.children
            : firstChild

          if (firstChildAsString === "▍") {
            return <span className="mt-1 animate-pulse cursor-default">▍</span>
          }

          if (typeof firstChildAsString === "string") {
            childArray[0] = firstChildAsString.replace("`▍`", "▍")
          }

          const match = /language-(\w+)/.exec(className || "")

          if (
            typeof firstChildAsString === "string" &&
            !firstChildAsString.includes("\n")
          ) {
            return (
              <code className={className} {...props}>
                {childArray}
              </code>
            )
          }

          return (
            <MarkdownCodeBlock
              key={Math.random()}
              language={(match && match[1]) || ""}
              value={String(childArray).replace(/\n$/, "")}
              {...props}
            />
          )
        }
      }}
    >
      {content}
    </MarkdownMemoized>
  )
}
