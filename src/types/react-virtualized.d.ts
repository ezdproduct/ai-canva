declare module "react-virtualized" {
  import * as React from "react";

  export type ListRowRenderer = (props: {
    index: number;
    key: string;
    style: React.CSSProperties;
    parent?: unknown;
    isScrolling?: boolean;
    isVisible?: boolean;
  }) => React.ReactNode;

  export interface ListProps {
    width: number;
    height: number;
    rowHeight: number;
    rowCount: number;
    rowRenderer: ListRowRenderer;
    overscanRowCount?: number;
    className?: string;
    autoHeight?: boolean;
    autoWidth?: boolean;
  }

  export class List extends React.Component<ListProps> {}
}
