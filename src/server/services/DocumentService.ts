import { type Document } from "@prisma/client";
import { db } from "../db";

export class DocumentService {
  static async addNew(doc: Omit<Document, "id">) {
    return db.document.create({
      data: doc,
    });
  }

  static async findDocumentsByUser(userId: number) {
    return db.document.findMany({
      where: { createdByUserId: userId },
    });
  }

  static findByDocId(docId: number) {
    return db.document.findFirst({
      where: { id: docId },
    });
  }
}
