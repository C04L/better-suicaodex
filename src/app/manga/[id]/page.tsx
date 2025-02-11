import MangaNotFound from "@/components/Manga/manga-notfound";
import MangaDetails from "@/components/Pages/manga-details";
import { siteConfig } from "@/config/site";
import { fetchMangaDetail } from "@/lib/mangadex/manga";
import { Manga } from "@/types/types";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const { status, manga } = await getMangaData(id);

  if (status === 404) {
    return { title: "Không tìm thấy trang yêu cầu" };
  } else if (status === 503) {
    return { title: "Đang bảo trì..." };
  } else if (status !== 200 || !manga) {
    return { title: "Lỗi mất rồi :(" };
  }

  const description =
    manga.description.content || `Đọc truyện ${manga.title} - SuicaoDex`;

  return {
    title: `${manga.title} - SuicaoDex`,
    description,
    keywords: [`Manga`, manga.title, "SuicaoDex", manga.altTitle || ""],
    openGraph: {
      title: `${manga.title} - SuicaoDex`,
      siteName: "SuicaoDex",
      description,
      images: `${siteConfig.mangadexAPI.ogURL}/manga/${manga.id}`,
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const { status, manga } = await getMangaData(id);

  if (status === 404) {
    return <MangaNotFound />;
  } else if (status === 503) {
    return <div>Đang bảo trì...</div>;
  } else if (status !== 200 || !manga) {
    return <div>Lỗi mất rồi :(</div>;
  }

  return <MangaDetails manga={manga} />;
}

async function getMangaData(
  id: string
): Promise<{ status: number; manga: Manga | null }> {
  try {
    const mangaData = await fetchMangaDetail(id);
    return { status: 200, manga: mangaData };
  } catch (error: any) {
    return { status: error.status || 500, manga: null };
  }
}
