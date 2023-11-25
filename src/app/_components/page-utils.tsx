import NextLink, { type LinkProps as NextLinkProps } from "next/link";
import { type FC, type ReactNode } from "react";
import cx from "classnames";

interface PageHeadingProps {
  Subtitle?: ReactNode;
  children: ReactNode;
}

export const PageHeading: FC<PageHeadingProps> = ({ children, Subtitle }) => {
  return (
    <div className=" mb-8 mt-2 flex flex-col gap-y-1">
      <h1 className="  text-2xl font-extrabold">{children}</h1>
      {Subtitle && (
        <section className=" text-sm text-slate-500">{Subtitle}</section>
      )}
    </div>
  );
};

interface LinkProps extends NextLinkProps {
  className?: string;
  children: ReactNode;
}
export const Link: FC<LinkProps> = ({ children, className, ...restProps }) => {
  return (
    <NextLink
      className={cx(
        " text-blue-500 underline-offset-4 hover:text-blue-700 hover:underline active:opacity-70",
        className,
      )}
      {...restProps}
    >
      {children}
    </NextLink>
  );
};
