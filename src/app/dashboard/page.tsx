"use client";

import { type FC, type ReactNode } from "react";
import { api } from "~/trpc/react";

const Column: FC<{
  title: ReactNode;
  description: ReactNode;
  children: ReactNode;
}> = ({ title, description, children }) => {
  return (
    <div className="h-full w-full min-w-[200px] max-w-[600px] flex-1 border bg-slate-50 p-4">
      <div className="  text-center text-2xl font-extrabold capitalize">
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

  return (
    <div className=" flex h-full w-full items-stretch gap-x-4 px-8 py-8 md:gap-x-8 lg:gap-x-24">
      <Column
        title="Planning to read"
        description="Items you have planned to read."
      >
        {plannedToRead.data?.map((d) => (
          <p key={d.id} className="border bg-white p-2 shadow-sm">
            Hello World
          </p>
        ))}
      </Column>

      <Column title="Currently Reading" description="Items you are reading.">
        <p className="border bg-white p-2 shadow-sm"> Hello World</p>
      </Column>

      <Column
        title="Recently Read"
        description="Items you read in the last 7 days."
      >
        <p className="border bg-white p-2 shadow-sm"> Hello World</p>
      </Column>
    </div>
  );
};
