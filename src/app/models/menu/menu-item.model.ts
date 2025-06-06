export interface MenuItem {
  label: string;
  icon?: string;
  id?: string;
  action: () => void;
  children?: MenuItem[];
}
