"use client";

import { useEffect, useState } from "react";

interface ClockTime {
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeInZone(timezone: string): ClockTime {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  });

  const parts = formatter.formatToParts(now);
  const get = (type: string) =>
    parseInt(parts.find((p) => p.type === type)?.value ?? "0", 10);

  return { hours: get("hour") % 12, minutes: get("minute"), seconds: get("second") };
}

function getDigitalTime(timezone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(new Date());
}

function getDateLabel(timezone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date());
}

interface Props {
  timezone: string;
  label: string;
  abbreviation: string;
  isLocal?: boolean;
  accent: string;
}

const HOUR_MARKS = Array.from({ length: 12 }, (_, i) => i);
const MINUTE_MARKS = Array.from({ length: 60 }, (_, i) => i);

export default function AnalogClock({ timezone, label, abbreviation, isLocal, accent }: Props) {
  const [time, setTime] = useState<ClockTime>(() => getTimeInZone(timezone));
  const [digital, setDigital] = useState(() => getDigitalTime(timezone));
  const [dateLabel, setDateLabel] = useState(() => getDateLabel(timezone));

  useEffect(() => {
    const update = () => {
      setTime(getTimeInZone(timezone));
      setDigital(getDigitalTime(timezone));
      setDateLabel(getDateLabel(timezone));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [timezone]);

  const cx = 100;
  const cy = 100;
  const r = 88;

  const hourDeg = (time.hours / 12) * 360 + (time.minutes / 60) * 30;
  const minuteDeg = (time.minutes / 60) * 360 + (time.seconds / 60) * 6;
  const secondDeg = (time.seconds / 60) * 360;

  const toRad = (deg: number) => (deg - 90) * (Math.PI / 180);

  const handEnd = (deg: number, length: number) => ({
    x: cx + length * Math.cos(toRad(deg)),
    y: cy + length * Math.sin(toRad(deg)),
  });

  const hourEnd = handEnd(hourDeg, 48);
  const minuteEnd = handEnd(minuteDeg, 64);
  const secondEnd = handEnd(secondDeg, 70);
  const secondTail = handEnd(secondDeg + 180, 16);

  return (
    <div
      className={`flex flex-col items-center gap-3 p-6 rounded-3xl transition-all duration-300 ${
        isLocal
          ? "bg-gradient-to-b from-slate-800 to-slate-900 ring-2 ring-blue-400/60"
          : "bg-gradient-to-b from-zinc-800 to-zinc-900 ring-1 ring-white/10"
      }`}
    >
      {/* Badge */}
      <div className="flex items-center gap-2">
        {isLocal && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
            LOCAL
          </span>
        )}
        <span className="text-sm font-bold tracking-widest uppercase" style={{ color: accent }}>
          {abbreviation}
        </span>
      </div>

      {/* Watch SVG */}
      <svg
        viewBox="0 0 200 200"
        width="200"
        height="200"
        className={`watch-face${isLocal ? " local" : ""}`}
      >
        {/* Watch strap top */}
        <rect x="78" y="2" width="44" height="18" rx="6" fill="#1a1a24" />
        {/* Watch strap bottom */}
        <rect x="78" y="180" width="44" height="18" rx="6" fill="#1a1a24" />

        {/* Watch case outer */}
        <circle cx={cx} cy={cy} r={r + 6} fill="#1a1a24" />
        {/* Watch case bezel */}
        <circle
          cx={cx}
          cy={cy}
          r={r + 4}
          fill="none"
          stroke={accent}
          strokeWidth="1.5"
          opacity="0.6"
        />
        {/* Crown */}
        <rect x="190" y="94" width="8" height="12" rx="3" fill="#2a2a36" stroke={accent} strokeWidth="0.8" opacity="0.7" />

        {/* Dial background */}
        <circle cx={cx} cy={cy} r={r} fill="#12121a" />

        {/* Minute tick marks */}
        {MINUTE_MARKS.map((i) => {
          const deg = (i / 60) * 360 - 90;
          const rad = deg * (Math.PI / 180);
          const isHour = i % 5 === 0;
          const innerR = isHour ? r - 10 : r - 6;
          const x1 = cx + r * Math.cos(rad);
          const y1 = cy + r * Math.sin(rad);
          const x2 = cx + innerR * Math.cos(rad);
          const y2 = cy + innerR * Math.sin(rad);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={isHour ? accent : "#ffffff30"}
              strokeWidth={isHour ? 2 : 0.8}
            />
          );
        })}

        {/* Hour numbers */}
        {HOUR_MARKS.map((i) => {
          if (i === 0) return null;
          const deg = (i / 12) * 360 - 90;
          const rad = deg * (Math.PI / 180);
          const numR = r - 22;
          const x = cx + numR * Math.cos(rad);
          const y = cy + numR * Math.sin(rad);
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="10"
              fontWeight="600"
              fill="#ffffff90"
              fontFamily="system-ui"
            >
              {i}
            </text>
          );
        })}

        {/* Subdial date window at 3 o'clock */}
        <rect x="148" y="94" width="24" height="12" rx="2" fill="#0a0a14" stroke={accent} strokeWidth="0.5" opacity="0.7" />

        {/* Center decorative ring */}
        <circle cx={cx} cy={cy} r="20" fill="none" stroke="#ffffff10" strokeWidth="0.5" />

        {/* Hour hand */}
        <line
          x1={cx}
          y1={cy}
          x2={hourEnd.x}
          y2={hourEnd.y}
          stroke="#ffffff"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Minute hand */}
        <line
          x1={cx}
          y1={cy}
          x2={minuteEnd.x}
          y2={minuteEnd.y}
          stroke="#e0e0e8"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Second hand */}
        <line
          x1={secondTail.x}
          y1={secondTail.y}
          x2={secondEnd.x}
          y2={secondEnd.y}
          stroke={accent}
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Center cap */}
        <circle cx={cx} cy={cy} r="5" fill={accent} />
        <circle cx={cx} cy={cy} r="2.5" fill="#12121a" />

        {/* Lume dots on hands */}
        <circle cx={hourEnd.x} cy={hourEnd.y} r="3" fill={accent} opacity="0.5" />
        <circle cx={minuteEnd.x} cy={minuteEnd.y} r="2" fill="#ffffff" opacity="0.4" />
      </svg>

      {/* Digital readout */}
      <div
        className="font-mono text-xl font-bold tracking-wider"
        style={{ color: accent }}
      >
        {digital}
      </div>

      {/* Date */}
      <div className="text-xs text-white/50 font-medium">{dateLabel}</div>

      {/* Label */}
      <div className="text-center">
        <div className="text-sm font-semibold text-white/80">{label}</div>
        <div className="text-xs text-white/40 mt-0.5">{timezone}</div>
      </div>
    </div>
  );
}
