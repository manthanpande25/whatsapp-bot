import React from "react";

export type IconName =
  | "dashboard"
  | "inbox"
  | "bot"
  | "analytics"
  | "crm"
  | "billing"
  | "settings"
  | "send"
  | "plus"
  | "search"
  | "bell"
  | "check"
  | "x"
  | "arrow"
  | "calendar"
  | "book"
  | "zap"
  | "trending"
  | "users"
  | "eye"
  | "msg"
  | "tag"
  | "globe"
  | "upload"
  | "refresh"
  | "menu"
  | "chevron"
  | "sparkle"
  | "phone";

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
  className?: string;
}

export interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  bg?: string;
  style?: React.CSSProperties;
  className?: string;
}

export interface CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  hover?: boolean;
}

export interface BtnProps {
  children: React.ReactNode;
  variant?: "primary" | "ghost" | "outline" | "danger" | "amber";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  style?: React.CSSProperties;
  className?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

export interface InputProps {
  placeholder?: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  style?: React.CSSProperties;
  className?: string;
  prefix?: React.ReactNode;
  multiline?: boolean;
}
