"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ui } from '@/lib/ui';

type TooltipProps = {
  label: string;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
};

export default function Tooltip({ label, children, side = "top" }: TooltipProps) {
  const id = useId();
  const ref = useRef<HTMLSpanElement | null>(null);
  const [canHover, setCanHover] = useState(false);
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    const mql = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanHover(mql.matches);
    update();

    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", update);
      return () => mql.removeEventListener("change", update);
    }

    mql.addListener(update);
    return () => mql.removeListener(update);
  }, []);

  const updatePosition = () => {
    const trigger = ref.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const padding = 8;

    switch (side) {
      case "top":
        setPosition({ top: rect.top - padding, left: rect.left + rect.width / 2 });
        break;
      case "bottom":
        setPosition({ top: rect.bottom + padding, left: rect.left + rect.width / 2 });
        break;
      case "left":
        setPosition({ top: rect.top + rect.height / 2, left: rect.left - padding });
        break;
      case "right":
      default:
        setPosition({ top: rect.top + rect.height / 2, left: rect.right + padding });
        break;
    }
  };

  useEffect(() => {
    if (!visible) return;
    updatePosition();

    const onScroll = () => updatePosition();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
  }, [visible, side]);

  if (!canHover) return <>{children}</>;

  const tooltip = position ? (
    <span
      id={id}
      role="tooltip"
      className={
        `${ui.radius.sm} px-2 py-1 text-xs whitespace-nowrap ${ui.shadow.lg} ` +
        `bg-[color:var(--card-bg)] border border-[color:var(--glass-border)] text-[color:var(--foreground)] backdrop-blur-md`
      }
      style={{
        position: "fixed",
        top: position.top,
        left: position.left,
        transform:
          side === "top"
            ? "translate(-50%, -100%)"
            : side === "bottom"
            ? "translate(-50%, 0)"
            : side === "left"
            ? "translate(-100%, -50%)"
            : "translate(0, -50%)",
        zIndex: 9999,
        opacity: visible ? 1 : 0,
        transition: "opacity 150ms ease",
        pointerEvents: "none",
      }}
    >
      {label}
    </span>
  ) : null;

  return (
    <span
      ref={ref}
      className="relative inline-flex"
      onMouseEnter={() => {
        setVisible(true);
        updatePosition();
      }}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => {
        setVisible(true);
        updatePosition();
      }}
      onBlur={() => setVisible(false)}
    >
      <span aria-describedby={id} className="inline-flex">
        {children}
      </span>
      {visible && typeof document !== "undefined"
        ? createPortal(tooltip, document.body)
        : null}
    </span>
  );
}
