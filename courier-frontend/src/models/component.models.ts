import { ApiRequest } from "./axios.models";
import { AuthState, BaseEntity, Page } from "./base.models";

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning";
}

export const ROLES = {
  ADMIN: "ROLE_ADMIN",
  COURIER: "ROLE_COURIER",
  CLIENT: "ROLE_CLIENT",
};

export const ENTITIES = {
  USER: "User",
  CONTACT: "Contact",
  ROLE: "Role",
  ORDER: "Order",
  OFFICE: "Office",
  BRANCH: "Branch",
  STATUS: "Status",
} as const;

export type EntityType = (typeof ENTITIES)[keyof typeof ENTITIES];

export interface Actions {
  create: string[];
  update: string[];
  delete: string[];
  [key: string]: string[] | undefined;
}

export interface RouteConfig {
  path: string;
  label: string;
  allowedRoles: string[];
}

export interface PublicRouteConfig extends RouteConfig {
  element: React.ReactNode;
}

export interface PrivateRouteConfig extends RouteConfig {
  element: React.ReactNode | ((actions?: Actions) => React.ReactElement);
  actions?: Actions;
}

export interface FormProps {
  id: string | number | null;
  onSubmit: (item: any) => void;
  onClose?: () => void;
}

export interface PageProps {
  allowedActions?: Actions;
}

export interface ValueColumn<T extends BaseEntity> {
  key: string;
  label: string;
  sortable?: boolean;
  sortedValue?: (item: T) => any;
}

export interface ItemsHeaderProps {
  title: string;
  placeholder: string;
  buttonName: string;
  setQuery: (query: string) => void;
  canCreate: boolean;
  onCreate: () => void;
  advancedOptions?: {
    onChange: (filters: any) => void;
    isAdvancedSearch: boolean;
    toggleAdvancedSearch: (expanded?: boolean) => void;
    advancedSearchContent: (
      onChange: (filters: any) => void,
      isOpen: boolean,
    ) => React.ReactNode;
  };
}

export interface ItemsContainerProps<T extends BaseEntity> {
  auth: AuthState;
  header: {
    title: string;
    placeholder: string;
    buttonName: string;
  };
  actions: {
    getItems: (page: number, size: number) => ApiRequest;
    createItem: (item: any) => ApiRequest;
    updateItem: (id: string | number, item: any) => ApiRequest;
    deleteItem: (id: string | number) => ApiRequest;
    searchItem: (query: string, page: number, size: number) => ApiRequest;
    searchItemsByFilters?: (
      filters: any,
      page: number,
      size: number,
    ) => ApiRequest;
  };
  adapters: {
    itemAdapter: (data: any) => T;
    listAdapter: <U>(data: any, adapter: (item: any) => U) => U[] | Page<U>;
  };
  list: {
    columns: ValueColumn<T>[];
    mapItemRow: (item: T) => { key: string; content: React.ReactNode }[];
    itemForm: (
      id: string | number | null,
      onSubmit: (item: any) => void,
      onClose?: () => void,
    ) => React.ReactNode;
  };
  allowedActions: Actions;
  formatMessage: (item: T) => string;

  rowExpandable?: (item: T) => boolean;
  expandContent?: (id: string | number) => React.ReactNode;
  advancedSearchContent?: (
    onChange: (filters: any) => void,
    isOpen: boolean,
  ) => React.ReactNode;
}

export interface ItemInlineFormProps {
  id: string | number | null;
  itemForm: (
    id: string | number | null,
    onSubmit: (item: any) => void,
    onClose?: () => void,
  ) => React.ReactNode;
  onClose: () => void;
  onSubmit: (item: any) => void;
}

export interface ItemsTableProps<T extends BaseEntity> {
  items: T[];
  columns: ValueColumn<T>[];
  mapItemRow: (item: T) => { key: string; content: React.ReactNode }[];
  actions?: {
    display: boolean;
    onEdit: (id: string | number) => void;
    onDelete: (id: string | number) => void;
    canDelete: (item: T) => boolean;
  };

  expansion?: {
    isExpandable?: (item: T) => boolean;
    isOpen: (id: string | number) => boolean;
    expandContent?: (id: string | number) => React.ReactNode;
    onRowClick: (item: T) => void;
    displayForm: boolean;
  };

  formInline?: ItemInlineFormProps;
  size?: "small" | "medium";
}

export interface AdvancedSearchProps {
  onChange: (filters: any) => void;
  isOpen: boolean;
}
