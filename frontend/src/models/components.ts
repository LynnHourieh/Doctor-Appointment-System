import type { ChangeEventHandler, CSSProperties, MouseEventHandler, ReactElement, ReactNode } from "react";
export type SizeLevel = "sm" | "md" | "lg";

export interface InputFieldProps {
  containerID?: string;
  name?: string;
  type?: string;
  label?: string;
  placeholder?: string;
  isRow?: boolean;
  value: string | number;
  onChange: (name: string, value: string) => void;
  errorMessage?: string;
  description?: string | ReactNode;
  concatenatedString?: string;
  disabled?: boolean;
  onBlur?: () => void;
  onFocus?: () => void;
}

export interface TooltipProps {
  text?: string | ReactNode;
  width?: string;
  gap?: number;
  children?: ReactNode;
}
export interface InfoBadgeProps {
  text?: string;
  icon?: any;
  style?: CSSProperties;
  tooltip?: TooltipProps;
}

export interface ButtonProps {
  id?: string;
  onClickHandler?: MouseEventHandler<HTMLButtonElement>;
  text?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  variant?: "tertiary" | "secondary" | "ghost" | "text";
  isDestructive?: boolean;
  isLoading?: boolean;
  icon?: ReactNode;
  iconPosition?: "start" | "end";
  shape?: "boxy" | "rounded" | "circular";
  style?: CSSProperties;
  size?: "md" | "lg";
  collapse?: boolean;
  flagIcon?: ReactNode;
  onMouseDownHandler?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface RadioProps {
  name?: string;
  containerID?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  value?: string;
  checked?: boolean;
  label?: string;
  size?: SizeLevel;
  icons?: {
    checkedIcon?: ReactNode;
    uncheckedIcon?: ReactNode;
  };
  rightIcon?: ReactNode;
}

export interface SelectOption {
  text: string;
  value: string;
  icon?: ReactNode;
}

export interface SelectProps {
  id?: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  value: string | null;
  onChange?: (name: string, value: string) => void;
  disabled?: boolean;
  label?: string;
  options?: SelectOption[];
  multiple?: boolean;
  onClear?: () => void;
  externalShowOptions?: boolean;
  handleSelectAll?: () => void;
  errorMessage?: string;
}

export interface OptionProps {
  id?: string;
  value: any;
  text: string;
  onClick: (value: any) => void;
  selected?: boolean;
  hasCheckbox?: boolean;
  icon?: ReactNode;
  meta?: string;
  action?: {
    text: string;
    url: string;
  };
  isDestructive?: boolean;
  iconPosition?: "start" | "end";
  secondIcon?: ReactNode;
}

export interface CheckboxProps {
  name?: string;
  id?: string;
  onChange: () => void;
  checked: boolean;
  indeterminate?: boolean;
  label?: string | ReactElement;
  errorMessage?: string;
  disabled?: boolean;
}


export interface SidebarProps {
  navItems?: {
    label: string;
    url?: string;
    action?: string
  }[];
  isMobileMenuOpen: boolean;
  isMobile: boolean;
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onLogout?: () => void; 
};

export interface AvatarProps {
  alt?: string;
  classes?: string[];
  src?: string;
  size?: "sm" | "md" | "lg";
  placeholderIcon?: ReactElement;
}

export interface CardProps {
  fullName: string;
  email: string;
  id: string;
  created_at?: string;
  specialty?: string;
  actionButtons?: ButtonProps[];
  profileUrl?: string;
  gender: string
};

export interface EmptyStateProps {
  icon?: ReactNode;
  title?: string;
  subtitle?: string | ReactNode;
  children?: ReactNode;
}

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  modalActions: ButtonProps[];
};

export interface TagInputProps {
  label: string;
  selectedTags: string[];
  onChange: (tags: string[]) => void;
}
export interface InfiniteScrollItem {
  id: any;
  [key: string]: any;
}

export interface InfiniteScrollProps {
  items: Array<InfiniteScrollItem>;
  itemsToShow: number;
  renderItem: (item: InfiniteScrollItem) => React.ReactNode;
}


export interface TimeSlotChipProps {
  label?: string;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export interface NumberInputProps {
  id?: string;
  name: string;
  label?: string;
  disabled?: boolean;
  value: string | number | null;
  min?: number;
  max?: number;
  onChange: (name: string, value: number | null) => void;
  placeholder?: string;
  onClear?: () => void;
  errorMessage?: string;
}