import { Chapter, Manga } from "@/types/types";
import axiosInstance from "../axios";
import { ChaptersParser } from "./chapter";
import { MangaParser } from "./manga";

export async function getLatestChapters(
  max: number,
  language: ("vi" | "en")[],
  r18: boolean
): Promise<Chapter[]> {
  const limitPerRequest = 100;
  let offset = 0;
  const mangaMap = new Map<string, Chapter>();

  while (mangaMap.size < max) {
    const remaining = max - mangaMap.size;
    const { data: chaptersData } = await axiosInstance.get("/chapter?", {
      params: {
        limit: limitPerRequest,
        offset: offset,
        includes: ["scanlation_group"],
        contentRating: r18
          ? ["safe", "suggestive", "erotica", "pornographic"]
          : ["safe", "suggestive", "erotica"],
        translatedLanguage: language,
        order: {
          readableAt: "desc",
        },
      },
    });
    const chapters = ChaptersParser(chaptersData.data);
    const mangaIDs = chapters.map((chapter) => chapter.manga?.id);

    //filter out the chapters that have same manga id, only keep the latest one
    let uniqueMangaIDs = Array.from(new Set(mangaIDs));
    if (uniqueMangaIDs.length > remaining) {
      uniqueMangaIDs = uniqueMangaIDs.slice(0, remaining);
    }

    const latestChapters = uniqueMangaIDs
      .map((mangaID) =>
        chapters.find((chapter) => chapter.manga?.id === mangaID)
      )
      .filter((chapter): chapter is Chapter => chapter !== undefined);

    const { data: mangasData } = await axiosInstance.get("/manga?", {
      params: {
        limit: 20,
        ids: uniqueMangaIDs,
        includes: ["cover_art", "author", "artist"],
        contentRating: r18
          ? ["safe", "suggestive", "erotica", "pornographic"]
          : ["safe", "suggestive", "erotica"],
      },
    });

    const mangas = mangasData.data.map((m: any) => MangaParser(m));
    // console.log(mangas);
    //add title and cover to the latest chapters
    latestChapters.forEach((chapter) => {
      const ma = mangas.find((m: Manga) => m.id === chapter.manga?.id);
      // console.log(ma);
      if (ma && chapter.manga) {
        chapter.manga.title = ma.title;
        chapter.manga.cover = ma.cover;
      }
      if (chapter.manga?.id && !mangaMap.has(chapter.manga.id)) {
        mangaMap.set(chapter.manga.id, chapter);
      }
    });

    offset += limitPerRequest;
  }
  return Array.from(mangaMap.values()).slice(0, max);
}

export async function getLatestManga(
  limit: number,
  offset: number,
  language: ("vi" | "en")[],
  r18: boolean
): Promise<{ chapters: Chapter[]; total: number }> {
  const total = 10000;
  // Ensure limit is within bounds
  if (limit + offset > total) {
    limit = total - offset;
  }

  // Content rating options - defined once to avoid duplication
  const contentRating = r18
    ? ["safe", "suggestive", "erotica", "pornographic"]
    : ["safe", "suggestive", "erotica"];

  // Fetch chapters
  const { data: chaptersData } = await axiosInstance.get("/chapter?", {
    params: {
      limit,
      offset,
      includes: ["scanlation_group"],
      contentRating,
      translatedLanguage: language,
      order: {
        readableAt: "desc",
      },
    },
  });

  const chapters = ChaptersParser(chaptersData.data);

  // Extract and filter manga IDs efficiently
  const mangaIDs = chapters
    .map((chapter) => chapter.manga?.id)
    .filter((id): id is string => !!id);

  const uniqueMangaIDs = Array.from(new Set(mangaIDs));

  if (uniqueMangaIDs.length === 0) {
    return { chapters: [], total };
  }

  // Fetch manga details
  const { data: mangasData } = await axiosInstance.get("/manga?", {
    params: {
      limit: 32,
      ids: uniqueMangaIDs,
      includes: ["cover_art", "author", "artist"],
      contentRating,
    },
  });

  const mangas = mangasData.data.map((m: any) => MangaParser(m));

  // Create manga lookup map for O(1) access
  const mangaMap = new Map<string, Manga>();
  mangas.forEach((manga: Manga) => {
    if (manga.id) {
      mangaMap.set(manga.id, manga);
    }
  });

  // Add title and cover to each chapter's manga property using the map
  chapters.forEach((chapter) => {
    if (chapter.manga?.id) {
      const manga = mangaMap.get(chapter.manga.id);
      if (manga && chapter.manga) {
        chapter.manga.title = manga.title;
        chapter.manga.cover = manga.cover;
      }
    }
  });

  return {
    chapters,
    total,
  };
}
