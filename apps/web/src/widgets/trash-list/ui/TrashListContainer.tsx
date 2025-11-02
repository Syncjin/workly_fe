"use client";

import { SelectionStoreProvider } from "@/widgets/post-list";
import { TrashHeader } from "./TrashHeader";
import { TrashList } from "./TrashList";
import * as styles from "./trashList.css";
import { TrashListBoundary } from "./TrashListBoundary";
import { TrashToolbar } from "./TrashToolbar";

export const TrashListContainer = () => {
  return (
    <div className={styles.container}>
      <TrashHeader />
      <SelectionStoreProvider scopeKey="trash" resetOnScopeChange={true}>
        <TrashToolbar />
        <TrashListBoundary>
          <TrashList />
        </TrashListBoundary>
      </SelectionStoreProvider>
    </div>
  );
};

TrashListContainer.displayName = "TrashListContainer";
