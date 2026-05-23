"use client";

import React, { useEffect, useId, useState } from "react";

type TooltipProps = {
  label: string;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
};

export default function Tooltip({ label, children, side = "top" }: TooltipProps) {
  const id = useId();
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanHover(mql.matches);
    update();

    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", update);
      return () => mql.removeEventListener("change", update);
    } else {
      mql.addListener(update);
      return () => mql.removeListener(update);
    }
  }, []);

  type Side = NonNullable<TooltipProps["side"]>;
  const pos: Record<Side, string> = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  // ✅ Touch devices: no tooltip at all
  if (!canHover) return <>{children}</>;

  return (
    <span className="relative inline-flex group">
      <span aria-describedby={id} className="inline-flex">
        {children}
      </span>

      <span
        id={id}
        role="tooltip"
        className={`
          ${pos[side]}
          absolute z-50
          pointer-events-none
          opacity-0 group-hover:opacity-100
          transition-opacity duration-150
          rounded-md px-2 py-1 text-xs whitespace-nowrap shadow-lg
          bg-[color:var(--card-bg)]
          border border-[color:var(--glass-border)]
          text-[color:var(--foreground)]
          backdrop-blur-md
        `}
      >
        {label}
      </span>
    </span>
  );
}
