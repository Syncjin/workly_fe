"use client";

import React from "react";

import { Button } from "../Button";
import Icon from "../Icon";

import { emptyStateContainer, emptyStateContent, emptyStateDescription, emptyStateIcon, emptyStateTitle } from "./emptyState.css";

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, icon, action, className }) => {
  const defaultIcon = <Icon name="file-list-line" size={{ width: 48, height: 48 }} color="gray-400" />;

  return (
    <div className={[emptyStateContainer, className].filter(Boolean).join(" ")}>
      <div className={emptyStateContent}>
        <div className={emptyStateIcon}>{icon || defaultIcon}</div>
        <h3 className={emptyStateTitle}>{title}</h3>
        {description && <p className={emptyStateDescription}>{description}</p>}
        {action && (
          <Button variant="solid" color="brand-600" size="md" onClick={action.onClick}>
            {action.label}
          </Button>
        )}
      </div>
    </div>
  );
};
