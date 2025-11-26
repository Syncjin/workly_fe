"use client";

import { MustReadHeader } from "./MustReadHeader";
import { MustReadList } from "./MustReadList";
import { MustReadListBoundary } from "./MustReadListBoundary";
import { MustReadToolbar } from "./MustReadToolbar";
import * as styles from "./mustReadList.css";

export const MustReadListContainer = () => {
  return (
    <div className={styles.container}>
      <MustReadHeader />
      <MustReadToolbar />
      <MustReadListBoundary>
        <MustReadList />
      </MustReadListBoundary>
    </div>
  );
};

MustReadListContainer.displayName = "MustReadListContainer";
