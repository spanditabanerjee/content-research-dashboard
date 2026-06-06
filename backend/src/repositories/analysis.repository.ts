import { Analysis } from "@prisma/client";
import { prisma } from "../prisma/client";
import { PaginatedResult, PaginationParams } from "../types";

export type CreateAnalysisData = {
  topic: string;
  userId: string;
  sourceContent?: string;
  summary?: string;
  linkedinPost?: string;
  instagramCaption?: string;
  hashtags?: string;
};

export type UpdateAnalysisData = Partial<
  Pick<
    Analysis,
    | "topic"
    | "sourceContent"
    | "summary"
    | "linkedinPost"
    | "instagramCaption"
    | "hashtags"
  >
>;

export class AnalysisRepository {
  async create(data: CreateAnalysisData): Promise<Analysis> {
    return prisma.analysis.create({
      data: {
        topic: data.topic,
        userId: data.userId,
        sourceContent: data.sourceContent,
        summary: data.summary,
        linkedinPost: data.linkedinPost,
        instagramCaption: data.instagramCaption,
        hashtags: data.hashtags,
      },
    });
  }

  async findById(id: string): Promise<Analysis | null> {
    return prisma.analysis.findUnique({ where: { id } });
  }

  async findByIdAndUserId(id: string, userId: string): Promise<Analysis | null> {
    return prisma.analysis.findFirst({
      where: { id, userId },
    });
  }

  async findByUserId(
    userId: string,
    pagination: PaginationParams
  ): Promise<PaginatedResult<Analysis>> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const [items, total] = await prisma.$transaction([
      prisma.analysis.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.analysis.count({ where: { userId } }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async update(id: string, data: UpdateAnalysisData): Promise<Analysis> {
    return prisma.analysis.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Analysis> {
    return prisma.analysis.delete({ where: { id } });
  }

  async deleteByIdAndUserId(id: string, userId: string): Promise<Analysis | null> {
    const analysis = await this.findByIdAndUserId(id, userId);

    if (!analysis) {
      return null;
    }

    return prisma.analysis.delete({ where: { id } });
  }
}

export const analysisRepository = new AnalysisRepository();
