"use client";
import { useState } from "react";
import WeeklyStubForm from "./WeeklyStubForm";
import RewardStubForm from "./RewardStubForm";

export default function IssueTabs() {
  const [tab, setTab] = useState<"weekly" | "reward">("weekly");

  return (
    <div className="card">
      <div className="tab-row">
        <button onClick={() => setTab("weekly")}>Weekly</button>

        <button onClick={() => setTab("reward")}>Reward</button>
      </div>

      {tab === "weekly" ? <WeeklyStubForm /> : <RewardStubForm />}
    </div>
  );
}
