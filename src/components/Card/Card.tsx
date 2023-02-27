import { FC } from "react";

import cls from "./Card.module.scss";

export type CardProps = {
  id?: number;
  image: string;
  category?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  content?: React.ReactNode;
  onClick?: React.MouseEventHandler;
};
export const Card: FC<CardProps> = ({
  id,
  image,
  category,
  title,
  subtitle,
  content,
  onClick,
}) => (
  <div className={cls.card} onClick={onClick}>
    <img className={cls.image} src={image} alt={title as string} />
    <div className={cls.category}>{category}</div>
    <div className={cls.title}>{title}</div>
    <div className={cls.subtitle}>{subtitle}</div>
    <div className={cls.content}>${content}</div>
  </div>
);
