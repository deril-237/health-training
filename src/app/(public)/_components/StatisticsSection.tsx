"use client";

import { useCounterIncrement } from "@/hooks/useCounter";
import {
  Award,
  GraduationCap,
  Handshake,
  Percent,
  LucideIcon,
} from "lucide-react";

export type StatisticsElementProps = {
  limit: number;
  icon: LucideIcon;
  title: string;
  suffix?: string;
  duration?: number;
};

const statisticsElements: StatisticsElementProps[] = [
  {
    limit: 15,
    icon: Award,
    title: "Experts formés",
    suffix: "+",
    duration: 100,
  },

  {
    limit: 100,
    icon: GraduationCap,
    title: "Diplômés",
    suffix: "+",
    duration: 30,
  },

  {
    limit: 20,
    icon: Handshake,
    title: "Partenaires",
    suffix: "+",
    duration: 100,
  },

  {
    limit: 95,
    icon: Percent,
    title: "Insertion professionnelle",
    suffix: "%",
    duration: 30,
  },
];

export function StatisticsElement({
  limit,
  icon: Icon,
  title,
  suffix = "",
  duration = 100,
}: StatisticsElementProps) {
  const count = useCounterIncrement(0, limit, duration, 1);

  return (
    <div className="group flex flex-col items-center gap-2 text-center">
      {/* Icon */}

      <div className="flex size-14 items-center justify-center rounded-full bg-base-100/10  transition">
        <Icon size={28} className="text-secondary" />
      </div>

      {/* Number */}

      <div className="flex items-center text-4xl font-black text-secondary">
        {count}

        <span>{suffix}</span>
      </div>

      {/* Label */}

      <p className="max-w-37.5 text-sm font-medium text-base-100/80">{title}</p>
    </div>
  );
}

export function StatisticsSection() {
  return (
    <section className="bg-primary py-12">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-6 md:grid-cols-4">
        {statisticsElements.map((stat, index) => (
          <StatisticsElement {...stat} key={index} />
        ))}
      </div>
    </section>
  );
}
