"use client";

import { useConfig } from "@/hooks/use-config";
import { getStaffPickMangas } from "@/lib/mangadex/manga";
import Link from "next/link";
import useSWR from "swr";
import { Skeleton } from "@/components/ui/skeleton";
import RecentlyCard from "../Recently/recently-card";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronsDown, ChevronsUp } from "lucide-react";

export default function StaffPick() {
  const [config] = useConfig();
  const [expanded, setExpanded] = useState(false);
  const [fullHeight, setFullHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const updateFullHeight = useCallback(() => {
    if (contentRef.current) {
      setFullHeight(contentRef.current.scrollHeight || 0);
    }
  }, []);

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      updateFullHeight();
    });

    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    const handleResize = () => {
      updateFullHeight();
    };

    window.addEventListener("resize", handleResize);
    const timer = setTimeout(updateFullHeight, 100);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, [expanded, updateFullHeight]);

  const toggleExpanded = () => setExpanded((prev) => !prev);

  const { data, error, isLoading } = useSWR(
    ["staffpick", config.r18],
    ([, r18]) => getStaffPickMangas(r18),
    {
      refreshInterval: 1000 * 60 * 10,
    }
  );

  if (isLoading)
    return (
      <div className="flex flex-col">
        <hr className="w-9 h-1 bg-primary border-none" />
        <h1 className="text-2xl font-black uppercase">Truyện mới</h1>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
          {[...Array(8)].map((_, index) => (
            <Skeleton
              key={index}
              className="w-full h-[300px] rounded-sm bg-gray-500"
            />
          ))}
        </div>
      </div>
    );

  if (error || !data) return null;

  return (
    <div className="flex flex-col">
      <div>
        <hr className="w-9 h-1 bg-primary border-none" />
        <h1 className="text-2xl font-black uppercase">Truyện đề cử</h1>
      </div>

      <div
        ref={contentRef}
        className={cn(
          "mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3",
          "overflow-hidden transition-all duration-500"
        )}
        style={{
          maxHeight: expanded ? fullHeight : "700px",
          // opacity: expanded ? 1 : 0.95,
          WebkitMaskImage: expanded
            ? "none"
            : "linear-gradient(to bottom, black 0%, black 60%, transparent 100%)",
        }}
      >
        {data.map((manga) => (
          <Link key={manga.id} href={`/manga/${manga.id}`}>
            <RecentlyCard manga={manga} />
          </Link>
        ))}
      </div>

      <div
        className={cn("flex justify-center w-full h-full", expanded && "mt-2")}
      >
        <Button
          size="sm"
          className="h-4 px-1 rounded-sm"
          onClick={toggleExpanded}
          variant={expanded ? "secondary" : "default"}
        >
          {expanded ? (
            <>
              <ChevronsUp />
              thu gọn
              <ChevronsUp />
            </>
          ) : (
            <>
              <ChevronsDown />
              xem thêm
              <ChevronsDown />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
