"use client";

import { cn } from "@/lib/utils";

export default function ActionButton({ href, onClick, children, className = "", ...rest }) {
  const Tag = href ? "a" : "button";

  return (
    <Tag
      href={href}
      onClick={onClick}
      className={cn("action-btn", className)}
      {...rest}
    >
      <span className="action-btn-label">{children}</span>
    </Tag>
  );
}
