"use client";

import { BookmarkToolbar } from "@/widgets/bookmarks-list/ui/BookmarkToolbar";
import { BookmarksHeader } from "./BookmarksHeader";
import { BookmarksList } from "./BookmarksList";
import { BookmarksListBoundary } from "./BookmarksListBoundary";
import * as styles from "./bookmarksList.css";

export const BookmarksListContainer = () => {
  return (
    <div className={styles.container}>
      <BookmarksHeader />
      <BookmarkToolbar />
      <BookmarksListBoundary>
        <BookmarksList />
      </BookmarksListBoundary>
    </div>
  );
};

BookmarksListContainer.displayName = "BookmarksListContainer";
