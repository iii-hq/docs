"use client";
import type { Folder } from "fumadocs-core/page-tree";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { SidebarItem } from "./SidebarItem";

const isPathActive = (pathname: string, url: string): boolean =>
  pathname === url || (url !== "/" && pathname.startsWith(`${url}/`));

const hasActivePath = (pathname: string, folder: Folder): boolean => {
  if (folder.index && isPathActive(pathname, folder.index.url)) return true;
  return folder.children.some((child) => {
    if (child.type === "page") return isPathActive(pathname, child.url);
    if (child.type === "folder") return hasActivePath(pathname, child);
    return false;
  });
};

export const SidebarFolder: React.FC<{ item: Folder; depth?: number }> = ({
  item,
  depth = 0,
}) => {
  const pathname = usePathname();
  const isSectionActive = useMemo(
    () => hasActivePath(pathname, item),
    [pathname, item],
  );
  const defaultOpen = item.defaultOpen ?? isSectionActive;
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);

  useEffect(() => {
    if (isSectionActive) {
      setIsOpen(true);
    }
  }, [isSectionActive]);

  const indentation = depth > 0 ? "pl-4" : "";

  return (
    <div className={`mt-5 flex w-full flex-col items-start ${indentation}`}>
      <div className="flex w-full items-center gap-1">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          className={[
            "inline-flex h-8 w-8 items-center justify-center rounded-md text-xs transition-colors",
            isSectionActive
              ? "bg-muted-background text-foreground"
              : "text-muted-foreground hover:bg-muted-background/50 hover:text-foreground",
          ].join(" ")}
        >
          {isOpen ? "−" : "+"}
        </button>
        {item.index ? (
          <Link
            href={item.index.url}
            className={[
              "w-full rounded-md px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] transition-colors",
              isSectionActive
                ? "bg-primary/10 text-foreground"
                : "text-foreground/85 hover:bg-muted-background/50 hover:text-foreground",
            ].join(" ")}
            aria-current={isSectionActive ? "true" : undefined}
          >
            {item.name}
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className={[
              "w-full rounded-md px-2 py-1 text-left text-[11px] font-semibold uppercase tracking-[0.08em] transition-colors",
              isSectionActive
                ? "bg-primary/10 text-foreground"
                : "text-foreground/85 hover:bg-muted-background/50 hover:text-foreground",
            ].join(" ")}
          >
            {item.name}
          </button>
        )}
      </div>
      {isOpen ? (
        <div className="mt-2 flex w-full flex-col items-start gap-1 border-l border-border/60 pl-2">
          {item.children.map((child) => {
            if (child.type === "page") {
              return <SidebarItem key={child.$id} item={child} depth={depth + 1} />;
            }

            if (child.type === "folder") {
              return (
                <SidebarFolder key={child.$id} item={child} depth={depth + 1} />
              );
            }

            return null;
          })}
        </div>
      ) : null}
    </div>
  );
};
