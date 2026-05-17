import {
  MapPinIcon,
  SquareCheckBig,
  TicketIcon,
  ChevronRightIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export type EventStatus = "upcoming" | "ongoing" | "completed" | "cancelled";

export type EventCardData = {
  id: string | number;
  title: string;
  datetime: {
    dateLabel: string;
    timeLabel: string;
  };
  location: {
    label: string;
  };
  status: EventStatus;
  stats?: {
    tasksCount?: number;
    rsvpsCount?: number;
  };
};

export const EVENT_STATUS_BADGE: Record<
  EventStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  upcoming:  "secondary",
  ongoing:   "default",
  completed: "outline",
  cancelled: "destructive",
};

interface EventCardProps {
  event: EventCardData;
  onClick?: () => void;
}

export function EventCard({ event, onClick }: EventCardProps) {
  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-md"
      onClick={onClick}
    >
      <CardHeader>
        <CardDescription>
          {event.datetime.dateLabel} · {event.datetime.timeLabel}
        </CardDescription>
        <CardTitle>{event.title}</CardTitle>
      </CardHeader>

      <CardContent>
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPinIcon className="h-4 w-4" />
          {event.location.label}
        </p>
        <Badge className="mt-4" variant={EVENT_STATUS_BADGE[event.status]}>
          {event.status}
        </Badge>
      </CardContent>

      <CardFooter className="justify-between">
        <div className="flex gap-4">
          {event.stats?.tasksCount !== undefined && (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <SquareCheckBig className="h-4 w-4" />
              {event.stats.tasksCount} tasks
            </p>
          )}
          {event.stats?.rsvpsCount !== undefined && (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <TicketIcon className="h-4 w-4" />
              {event.stats.rsvpsCount} RSVPs
            </p>
          )}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={(e) => { e.stopPropagation(); onClick?.(); }}
        >
          <ChevronRightIcon />
        </Button>
      </CardFooter>
    </Card>
  );
}
