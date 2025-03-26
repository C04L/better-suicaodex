import { Group } from "@/types/types";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import { Users } from "lucide-react";

interface GroupCardsProps {
  groups: Group[];
}

export default function GroupCards({ groups }: GroupCardsProps) {
  if (groups.length === 0) {
    return (
      <Card className="mt-4 rounded-sm justify-center items-center flex h-16 w-full">
        Không có kết quả!
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {groups.map((group) => (
        <Button
          asChild
          key={group.id}
          className="rounded-sm justify-start hover:bg-primary/20 px-4"
          variant="secondary"
          size="lg"
        >
          <Link href={`/group/${group.id}`}>
            <Users />
            <span className="line-clamp-1 break-all">{group.name}</span>
          </Link>
        </Button>
      ))}
    </div>
  );
}
