"use client";

import useSWR from "swr";
import CommentCard from "./comment-card";
import { forwardRef, useImperativeHandle, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Loader2 } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const LIMIT = 10; // Limit for pagination

interface CommentListProps {
  id: string;
  type: "manga" | "chapter";
}

// Use forwardRef to allow parent components to access the mutate function
const CommentList = forwardRef(({ id, type }: CommentListProps, ref) => {
  const [page, setPage] = useState(1);
  const offset = (page - 1) * LIMIT; // Calculate offset based on page number
  const { data, mutate, isLoading, error } = useSWR(
    `/api/comments/${type}/${id}?offset=${offset}&limit=${LIMIT}`,
    fetcher
  );

  // Expose the mutate function to the parent component
  useImperativeHandle(ref, () => ({
    mutate,
  }));

  if (isLoading || !data)
    return (
      <Alert className="rounded-sm border-none">
        <AlertDescription className="flex justify-center">
          <Loader2 className="animate-spin" />
        </AlertDescription>
      </Alert>
    );
  if (data.comments.length === 0)
    return (
      <Alert className="rounded-sm bg-secondary">
        <AlertTitle className="flex justify-center text-center">
          Chưa có bình luận nào!
        </AlertTitle>
        <AlertDescription className="flex justify-center text-center">
          Hãy bóc tem em nó ngay thôi! 😍
        </AlertDescription>
      </Alert>
    );

  if (error)
    return (
      <Alert className="rounded-sm bg-secondary">
        <AlertDescription className="flex justify-center">
          Lỗi mất rồi 😭
        </AlertDescription>
      </Alert>
    );

  const totalPages = Math.ceil((data.meta.totalCount || 0) / LIMIT); // Calculate total pages based on total comments and limit
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="space-y-4 mt-4">
      {data.comments.map((comment: any) => (
        <CommentCard key={comment.id} comment={comment} />
      ))}

      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationPrevious
              className="w-8 h-8"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            />

            {totalPages <= 7 ? (
              // Show all pages if total is 7 or less
              Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink
                    className="w-8 h-8"
                    isActive={i + 1 === page}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))
            ) : page <= 4 ? (
              // Near start: show 1, 2, 3, 4, 5, ..., lastPage
              <>
                {[1, 2, 3, 4, 5].map((num) => (
                  <PaginationItem key={num}>
                    <PaginationLink
                      className="w-8 h-8"
                      isActive={num === page}
                      onClick={() => handlePageChange(num)}
                    >
                      {num}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationEllipsis />
                <PaginationItem>
                  <PaginationLink
                    className="w-8 h-8"
                    onClick={() => handlePageChange(totalPages)}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            ) : page >= totalPages - 3 ? (
              // Near end: show 1, ..., lastPage-4, lastPage-3, lastPage-2, lastPage-1, lastPage
              <>
                <PaginationItem>
                  <PaginationLink
                    className="w-8 h-8"
                    onClick={() => handlePageChange(1)}
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationEllipsis />
                {[
                  totalPages - 4,
                  totalPages - 3,
                  totalPages - 2,
                  totalPages - 1,
                  totalPages,
                ].map((num) => (
                  <PaginationItem key={num}>
                    <PaginationLink
                      className="w-8 h-8"
                      isActive={num === page}
                      onClick={() => handlePageChange(num)}
                    >
                      {num}
                    </PaginationLink>
                  </PaginationItem>
                ))}
              </>
            ) : (
              // Middle: show 1, ..., page-1, page, page+1, ..., lastPage
              <>
                <PaginationItem>
                  <PaginationLink
                    className="w-8 h-8"
                    onClick={() => handlePageChange(1)}
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationEllipsis />
                {[page - 1, page, page + 1].map((num) => (
                  <PaginationItem key={num}>
                    <PaginationLink
                      className="w-8 h-8"
                      isActive={num === page}
                      onClick={() => handlePageChange(num)}
                    >
                      {num}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationEllipsis />
                <PaginationItem>
                  <PaginationLink
                    className="w-8 h-8"
                    onClick={() => handlePageChange(totalPages)}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}

            <PaginationNext
              className="w-8 h-8"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
            />
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
});

// Add a display name for the component
CommentList.displayName = "CommentList";

export default CommentList;
