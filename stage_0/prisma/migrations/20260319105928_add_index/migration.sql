-- CreateIndex
CREATE INDEX "Column_boardId_idx" ON "Column"("boardId");

-- CreateIndex
CREATE INDEX "Comment_cardId_idx" ON "Comment"("cardId");

-- CreateIndex
CREATE INDEX "Comment_parentId_idx" ON "Comment"("parentId");
