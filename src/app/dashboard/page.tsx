"use client";

import { type FC, type ReactNode } from "react";
import { api } from "~/trpc/react";
import { DataContainer } from "../_components/data-components";

const Column: FC<{
  title: ReactNode;
  description: ReactNode;
  children: ReactNode;
}> = ({ title, description, children }) => {
  return (
    <div className="h-full w-full min-w-[200px] max-w-[600px] flex-1 border bg-slate-50 p-4">
      <div className="  h-[36px] text-center text-xl font-extrabold capitalize lg:text-2xl">
        {title}
      </div>
      <div className=" text-center text-xs text-gray-400">{description}</div>

      <div className=" my-4 text-sm">{children}</div>
    </div>
  );
};

export default () => {
  const plannedToRead = api.planner.getSchedulesByStatus.useQuery({
    status: "READING_PLANNED",
  });

  const currentlyReading = api.planner.getSchedulesByStatus.useQuery({
    status: "READING_IN_PROGRESS",
  });

  const recentlyRead = api.planner.getSchedulesByStatus.useQuery({
    status: "READING_COMPLETED",
  });

  return (
    <div className=" flex h-full w-full flex-col items-stretch gap-4 px-8 py-8 md:flex-row md:gap-x-8 lg:gap-x-24">
      <Column
        title="Planned to read"
        description="Items you have planned to read."
      >
        <DataContainer
          loading={
            plannedToRead.isLoading ||
            plannedToRead.isFetching ||
            plannedToRead.isRefetching
          }
          empty={(plannedToRead.data ?? []).length === 0}
        >
          {plannedToRead.data?.map((plan) => (
            <p key={plan.id} className="border bg-white p-2 shadow-sm">
              {plan.document.title}
            </p>
          ))}
        </DataContainer>
      </Column>

      <Column title="Currently Reading" description="Items you are reading.">
        <DataContainer
          loading={
            currentlyReading.isLoading ||
            currentlyReading.isFetching ||
            currentlyReading.isRefetching
          }
          empty={(currentlyReading.data ?? []).length === 0}
        >
          {currentlyReading.data?.map((plan) => (
            <p key={plan.id} className="border bg-white p-2 shadow-sm">
              {plan.document.title}
            </p>
          ))}
        </DataContainer>
      </Column>

      <Column
        title="Recently Read"
        description="Items you read in the last 7 days."
      >
        <DataContainer
          loading={
            recentlyRead.isLoading ||
            recentlyRead.isFetching ||
            recentlyRead.isRefetching
          }
          empty={(recentlyRead.data ?? []).length === 0}
        >
          {recentlyRead.data?.map((plan) => (
            <p key={plan.id} className="border bg-white p-2 shadow-sm">
              {plan.document.title}
            </p>
          ))}
        </DataContainer>
      </Column>
    </div>
  );
};
