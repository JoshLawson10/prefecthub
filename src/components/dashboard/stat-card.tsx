import { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface StatCardProps {
  description?: string;
  title?: string | number;

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
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
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
