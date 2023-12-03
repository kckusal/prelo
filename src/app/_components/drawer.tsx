"use client";

import React, { type FC, type ReactNode } from "react";
import { createPortal } from "react-dom";
import cx from "classnames";

interface Props {
  wrapperClass?: string;
  overlayClass?: string;
  containerClass?: string;

  Header?: ReactNode;
  children: ReactNode;
  Footer?: ReactNode;

  isOpen: boolean;
  close: () => void;
  onOverlayClick?: () => void;
  portalKey: string;
}

export const Drawer: FC<Props> = ({
  portalKey,
  wrapperClass,
  overlayClass,
  containerClass,
  isOpen,
  close,
  onOverlayClick,
  Header,
  Footer,
  children,
}) => {
  if (!isOpen || !document.body) return null;

  return createPortal(
    <div className={cx("fixed z-10 h-full w-full", wrapperClass)}>
      <div
        className={cx(
          " fixed  bottom-0 left-0 right-0 top-0 z-10 bg-slate-700 opacity-40",
          overlayClass,
        )}
        onClick={onOverlayClick}
      />

      <div
        className={cx(
          " fixed bottom-0 top-0 z-20 flex h-full w-[360px] flex-col bg-white",
          containerClass,
        )}
      >
        {Header}
        <div className=" h-full overflow-y-auto">{children}</div>
        {Footer}
      </div>
    </div>,
    document.body,
    portalKey,
  );
};
