import { Tag } from "@/types/types";
import StatusChip from "./status-tag";
import ContentRatingChip from "./content-rating-tag";
import NormalTag from "./normal-tag";

interface TagsProps {
  tags: Tag[];
  contentRating: string;
  status: string;
}

export default function Tags({ tags, contentRating, status }: TagsProps) {
  return (
    <>
      <StatusChip status={status} isLink />
      <ContentRatingChip rating={contentRating} />
      {tags.map((tag) => (
        <NormalTag key={tag.id} className="uppercase">
          <a
            href={`/advanced-search?include=${tag.id}`}
            className="hover:underline text-gray-700 dark:text-white"
          >
            {tag.name}
          </a>
        </NormalTag>
      ))}
    </>
  );
}
