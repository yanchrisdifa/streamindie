interface ChildrenItems {
  state: string;
  name: string;
  type?: string;
  icon?: string;
  permissions?: string;
}

export interface Menu {
  state: string;
  name: string;
  type?: string;
  icon?: string;
  children?: ChildrenItems[];
  permissions?: string;
}
