"use client";

import React, { useRef, useState } from "react";
import { Eye, Trash2 } from "lucide-react";
import { ui } from '@/lib/ui';

const MAX = 80;
const START_THRESHOLD = 12;
const OPEN_THRESHOLD = 40;

export default function SwipeCard({
  children,
  onView,
  onDelete,
}: {
  children: React.ReactNode;
  onView?: () => void;
  onDelete?: () => void;
}) {
  const startX = useRef(0);
  const startY = useRef(0);
  const pointerId = useRef<number | null>(null);

  const [offset, setOffset] = useState(0);
  const [locked, setLocked] = useState<"none" | "horizontal" | "vertical">("none");

  const close = () => setOffset(0);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "touch") return;

    pointerId.current = e.pointerId;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    startX.current = e.clientX;
    startY.current = e.clientY;
    setLocked("none");
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "touch") return;
    if (pointerId.current !== e.pointerId) return;

    const dx = e.clientX - startX.current;
    const dy = e.clientY - startY.current;

    if (locked === "none") {
      if (Math.abs(dx) < START_THRESHOLD && Math.abs(dy) < START_THRESHOLD) return;

      // ✅ vertical scroll wins
      if (Math.abs(dy) > Math.abs(dx)) {
        setLocked("vertical");
        return;
      }

      setLocked("horizontal");
    }

    if (locked !== "horizontal") return;

    const next = Math.max(-MAX, Math.min(MAX, dx));
    setOffset(next);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (e.pointerType !== "touch") return;
    if (pointerId.current !== e.pointerId) return;

    pointerId.current = null;

    if (locked === "vertical" || locked === "none") {
      setOffset(0);
      return;
    }

    // ✅ reveal only (no auto action)
    if (offset > OPEN_THRESHOLD) setOffset(MAX);
    else if (offset < -OPEN_THRESHOLD) setOffset(-MAX);
    else setOffset(0);

    setLocked("none");
  };

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* DELETE */}
      <button
        type="button"
        onClick={() => {
          onDelete?.();
          close();
        }}
        className="
          absolute inset-y-0 left-0 w-20
          flex items-center justify-center
          text-[color:var(--danger)]
          bg-[color:var(--danger-soft)]
          backdrop-blur-md
        "
        aria-label="Delete"
      >
        <Trash2 size={20} />
      </button>

      {/* VIEW */}
      <button
        type="button"
        onClick={() => {
          onView?.();
          close();
        }}
        className="
          absolute inset-y-0 right-0 w-20
          flex items-center justify-center
          text-[color:var(--primary)]
          bg-[color:var(--primary-soft)]
          backdrop-blur-md
        "
        aria-label="View"
      >
        <Eye size={20} />
      </button>

      {/* CARD */}
      <div
        className={`
          glass-soft ${ui.radius.md} ${ui.shadow.sm}
          transition-transform duration-200
          active:scale-[0.98]
          touch-pan-y
        `}
        style={{ transform: `translateX(${offset}px)` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {children}
      </div>
    </div>
  );
}
