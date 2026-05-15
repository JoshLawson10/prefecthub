import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { ReactNode } from "react";

type DescriptionItem = {
  label: string;
  icon?: ReactNode;
};

type Event = {
  id: string | number;
  icon?: ReactNode | string;
  title: string;
  description?: DescriptionItem[];
  badgeContent?: string;
};

type EventListProps = {
  title?: string;
  onViewAll?: () => void;
  events?: Event[];
};

function EventIcon({ icon }: { icon?: ReactNode | string }) {
  if (!icon) return null;

  if (typeof icon === "string") {
    return (
      <span
        className="w-2.5 h-2.5 rounded-full shrink-0"
        style={{ backgroundColor: icon }}
      />
    );
  }

  return <span className="shrink-0 text-muted-foreground">{icon}</span>;
}

function EventDescription({ items }: { items?: DescriptionItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="flex items-center gap-1 mt-0.5 flex-wrap">
      {items.map((item: DescriptionItem, index: number) => (
        <span key={index} className="flex items-center gap-1">
          {index > 0 && (
            <span className="text-xs text-muted-foreground/40">·</span>
          )}
          {item.icon && (
            <span className="text-muted-foreground/60 [&>svg]:w-3 [&>svg]:h-3">
              {item.icon}
            </span>
          )}
          <span className="text-xs text-muted-foreground">{item.label}</span>
        </span>
      ))}
    </div>
  );
}

export function Table({
  title = "Upcoming Events",
  onViewAll,
  events = [],
}: EventListProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        {onViewAll && (
          <Button variant="ghost" size="sm" onClick={onViewAll}>
            View all <ChevronRight className="w-4 h-4 ml-0.5" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="px-0 pb-2">
        {events.map((event: Event, index: number) => (
          <div key={event.id}>
            {index > 0 && <Separator className="mx-5" />}
            <div className="flex items-center justify-between px-5 py-4 hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <EventIcon icon={event.icon} />
                <div>
                  <p className="text-sm font-semibold leading-snug">
                    {event.title}
                  </p>
                  <EventDescription items={event.description} />
                </div>
              </div>
              {event.badgeContent && (
                <Badge variant="secondary" className="shrink-0 ml-3">
                  {event.badgeContent}
                </Badge>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
