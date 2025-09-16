import React from "react";

export interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  path?: string;
  items?: MenuItem[];
  badge?: string | number;
}
