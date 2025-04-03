import { Group, GroupStats, Manga } from "@/types/types";
import axiosInstance from "../axios";
import { MangaParser } from "./manga";

export function GroupParser(data: any): Group {
  const id = data.id;
  const attributes = data.attributes;

  if (!attributes) {
    return {
      id: id,
      name: "Unknown Group",
      description: "",
      website: "",
      discord: "",
      email: "",
      twitter: "",
      language: [],
      leader: null,
    };
  }
  const name = attributes.name;
  const description = attributes.description;
  const website = attributes.website;
  const discord = attributes.discord;
  const email = attributes.contactEmail;
  const twitter = attributes.twitter;
  const leader = data.relationships
    ? data.relationships.find((item: any) => item.type === "leader")
    : null;
  const language = attributes.focusedLanguages;

  const group: Group = {
    id,
    name,
    description,
    website,
    discord,
    email,
    twitter,
    language,
    leader: leader
      ? { id: leader.id, username: leader.attributes.username }
      : null,
  };
  return group;
}

export async function getGroup(id: string): Promise<Group> {
  const { data } = await axiosInstance.get(`/group/${id}?`, {
    params: {
      includes: ["leader"],
    },
  });
  return GroupParser(data.data);
}

export async function getGroupStats(id: string): Promise<GroupStats> {
  try {
    const [statsResponse, uploadedResponse] = await Promise.all([
      axiosInstance.get(`/statistics/group/${id}`),
      axiosInstance.get(`/chapter?`, {
        params: {
          limit: 0,
          groups: [id],
          contentRating: ["safe", "suggestive", "erotica", "pornographic"],
        },
      }),
    ]);

    const totalReplied =
      statsResponse.data?.statistics?.[id]?.comments?.repliesCount || 0;
    const totalUploaded = uploadedResponse.data?.total || 0;

    return { repliesCount: totalReplied, totalUploaded };
  } catch (error) {
    console.error("Error fetching group stats:", error);
    return { repliesCount: 0, totalUploaded: 0 };
  }
}

export async function getGroupTitles(
  id: string,
  limit: number,
  offset: number
): Promise<{
  mangas: Manga[];
  total: number;
}> {
  const max_total = 10000;

  if (limit + offset > max_total) {
    limit = max_total - offset;
  }
  const { data } = await axiosInstance.get(`/manga?`, {
    params: {
      limit,
      offset,
      group: id,
      contentRating: ["safe", "suggestive", "erotica", "pornographic"],
      includes: ["cover_art", "author", "artist"],
    },
  });
  const total = data.total > max_total ? max_total : data.total;

  return {
    mangas: data.data.map((item: any) => MangaParser(item)),
    total: total,
  };
}

export async function searchGroups(
  query: string,
  limit: number,
  offset: number
): Promise<{
  groups: Group[];
  total: number;
}> {
  const max_total = 10000;

  if (limit + offset > max_total) {
    limit = max_total - offset;
  }
  const params: any = {
    limit: limit,
    offset: offset,
    includes: ["leader"],
  };

  if (query) {
    params.name = query;
  }

  const { data } = await axiosInstance.get(`/group?`, { params });
  const total = data.total > max_total ? max_total : data.total;

  return {
    groups: data.data.map((item: any) => GroupParser(item)),
    total: total,
  };
}
