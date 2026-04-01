"use client";

import { useEffect, useState } from "react";

interface Props {
  localTimezone: string;
  targetTimezone: string;
}

function getOffsetHours(local: string, target: string): number {
  const now = new Date();

  const localOffset = getTimezoneOffset(now, local);
  const targetOffset = getTimezoneOffset(now, target);

  return (targetOffset - localOffset) / 60;
}

function getTimezoneOffset(date: Date, timezone: string): number {
  const utc = date.getTime();
  const localDate = new Date(
    date.toLocaleString("en-US", { timeZone: timezone })
  );
  return (localDate.getTime() - utc) / 1000;
}

export default function OffsetBadge({ localTimezone, targetTimezone }: Props) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const update = () => setOffset(getOffsetHours(localTimezone, targetTimezone));
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, [localTimezone, targetTimezone]);

  if (localTimezone === targetTimezone) return null;

  const sign = offset >= 0 ? "+" : "";
  const color =
    offset === 0
      ? "text-white/50"
      : offset > 0
      ? "text-emerald-400"
      : "text-rose-400";

  return (
    <div className={`text-xs font-mono font-bold ${color}`}>
      {sign}{offset}h from you
    </div>
  );
}
