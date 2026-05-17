import { ReactNode } from "react";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChevronRight } from "lucide-react";

type DescriptionItem = {
  label: string;
  icon?: ReactNode;
};

type Item = {
  id: string | number;
  icon?: ReactNode | string;
  title: string;
  description?: string | DescriptionItem[];
  badgeContent?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
  href?: string;
};

type TableProps = {
  title?: string;
  viewAllPath?: string;
  items?: Item[];
  maxItems?: number;
  className?: string;
};

function ItemIcon({ icon }: { icon?: ReactNode | string }) {
  if (!icon) return null;
  if (typeof icon === "string") {
    return (
      <span
        className="h-2.5 w-2.5 shrink-0 rounded-full"
        style={{ backgroundColor: icon }}
      />
    );
  }
  return <span className="shrink-0 text-muted-foreground [&>svg]:h-4 [&>svg]:w-4">{icon}</span>;
}

function ItemDescription({ items }: { items?: string | DescriptionItem[] }) {
  if (!items || (Array.isArray(items) && items.length === 0)) return null;
  return (
    <div className="mt-0.5 flex flex-wrap items-center gap-1">
      {Array.isArray(items) ? (
        items.map((item, index) => (
          <span key={index} className="flex items-center gap-1">
            {index > 0 && (
              <span className="text-muted-foreground/40 text-xs">·</span>
            )}
            {item.icon && (
              <span className="text-muted-foreground/60 [&>svg]:h-3 [&>svg]:w-3">
                {item.icon}
              </span>
            )}
            <span className="text-muted-foreground text-xs">{item.label}</span>
          </span>
        ))
      ) : (
        <span className="text-muted-foreground text-xs">{items}</span>
      )}
    </div>
  );
}

export function Table({
  title,
  viewAllPath,
  items = [],
  maxItems,
  className,
}: TableProps) {
  const displayedItems = maxItems ? items.slice(0, maxItems) : items;

  return (
    <Card className={`pb-0 ${className ?? ""}`}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        {viewAllPath && (
          <Link
            href={viewAllPath}
            className="flex items-center text-sm font-medium text-foreground hover:text-foreground/80 transition-colors"
          >
            View all <ChevronRight className="ml-0.5 h-4 w-4" />
          </Link>
        )}
      </CardHeader>

      <CardContent className="px-0">
        {displayedItems.map((item, index) => {
          const inner = (
            <div className="flex cursor-pointer items-center justify-between px-5 py-4 transition-colors hover:bg-muted/50">
              <div className="flex items-center gap-3">
                <ItemIcon icon={item.icon} />
                <div>
                  <p className="text-sm font-semibold leading-snug">{item.title}</p>
                  <ItemDescription items={item.description} />
                </div>
              </div>
              {item.badgeContent && (
                <Badge
                  variant={item.badgeVariant ?? "secondary"}
                  className="ml-3 shrink-0"
                >
                  {item.badgeContent}
                </Badge>
              )}
            </div>
          );

          return (
            <div key={item.id}>
              {index > 0 && <Separator className="mx-5" />}
              {item.href ? (
                <Link href={item.href} className="block">
                  {inner}
                </Link>
              ) : (
                inner
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
