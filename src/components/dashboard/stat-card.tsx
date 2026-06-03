import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type StatCardVariant = "default" | "destructive" | "warning" | "success";

const TITLE_CLASSES: Record<StatCardVariant, string> = {
  default: "",
  destructive: "text-destructive",
  warning: "text-amber-500 dark:text-amber-400",
  success: "text-emerald-600 dark:text-emerald-400",
};

interface StatCardProps {
  description?: string;
  title?: string | number;
  variant?: StatCardVariant;

  badgeIcon?: ReactNode;
  badgeLabel?: string;

  footerTitle?: string;
  footerIcon?: ReactNode;
  footerDescription?: string;

  className?: string;
}

export function StatCard({
  description,
  title,
  variant = "default",
  badgeIcon,
  badgeLabel,
  footerTitle,
  footerIcon,
  footerDescription,
  className,
}: StatCardProps) {
  return (
    <Card className={`@container/card ${className ?? ""}`}>
      <CardHeader>
        {description && <CardDescription>{description}</CardDescription>}

        {title !== undefined && (
          <CardTitle
            className={cn(
              "text-2xl font-semibold tabular-nums @[250px]/card:text-3xl",
              TITLE_CLASSES[variant],
            )}
          >
            {title}
          </CardTitle>
        )}

        {(badgeIcon || badgeLabel) && (
          <CardAction>
            <Badge variant="outline">
              {badgeIcon}
              {badgeLabel}
            </Badge>
          </CardAction>
        )}
      </CardHeader>

      {(footerTitle || footerDescription) && (
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          {footerTitle && (
            <div className="line-clamp-1 flex gap-2 font-medium">
              {footerTitle}
              {footerIcon}
            </div>
          )}
          {footerDescription && (
            <div className="text-muted-foreground">{footerDescription}</div>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
