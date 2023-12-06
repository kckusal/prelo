"use client";

import cx from "classnames";
import { useState, type FC, type ReactNode } from "react";
import { api } from "~/trpc/react";
import { DataContainer } from "../_components/data-components";
import { type PlannerService } from "~/server/services/PlannerService";
import { UpdateScheduleDrawer } from "./UpdateScheduleDrawer";
import { FaEdit } from "react-icons/fa";
import { useDrawer } from "../_store/drawer";

const Column: FC<{
  title: ReactNode;
  description: ReactNode;
  containerClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  children: ReactNode;
}> = ({
  title,
  description,
  containerClassName,
  titleClassName,
  descriptionClassName,
  children,
}) => {
  return (
    <div
      className={cx(
        "h-full w-full min-w-[200px] max-w-[600px] flex-1 rounded-md border p-4",
        containerClassName,
      )}
    >
      <div
        className={cx(
          " h-[36px] text-center text-xl font-extrabold capitalize lg:text-2xl",
          titleClassName,
        )}
      >
        {title}
      </div>
      <div
        className={cx(
          " text-center text-xs text-gray-800",
          descriptionClassName,
        )}
      >
        {description}
      </div>

      <div className=" my-4 grid max-h-[calc(100%-70px)] grid-cols-1 gap-4 overflow-y-auto px-3 py-2 text-sm">
        {children}
      </div>
    </div>
  );
};

type GetSchedulesType = Awaited<
  ReturnType<typeof PlannerService.getSchedulesByStatus>
>;

const ScheduleCard: FC<{
  schedule: GetSchedulesType[number];
  onEditClick?: () => void;
}> = ({ schedule, onEditClick }) => {
  return (
    <div
      key={schedule.id}
      className="card z-[1] grid h-[100px] cursor-pointer grid-cols-1 gap-1 overflow-visible rounded-md border border-gray-300 bg-slate-50 px-3 py-2 hover:border-blue-600 hover:shadow-sm hover:outline-1"
    >
      <div className=" inline-flex items-center justify-between font-bold">
        {schedule.document.title}

        {onEditClick && (
          <button
            className=" btn btn-xs tooltip tooltip-bottom tooltip-secondary"
            onClick={onEditClick}
            data-tip="Update"
          >
            <FaEdit />
          </button>
        )}
      </div>

      <p className=" truncate overflow-ellipsis text-xs text-gray-500">
        Pages:{" "}
        <span className=" font-bold text-black">
          {schedule.document.numOfPages ?? " - "},{" "}
        </span>
        {(schedule.status === "READING_PLANNED" ||
          schedule.status === "READING_COMPLETED") && (
          <>
            Author:{" "}
            <span className=" font-bold text-black">
              {schedule.document.author}
            </span>
          </>
        )}
        {schedule.status === "READING_IN_PROGRESS" && (
          <>
            Read:{" "}
            <span className=" font-bold text-black">
              {schedule.numOfPagesRead}
            </span>
          </>
        )}
      </p>

      <div className=" mt-1 text-xs text-gray-500">
        Added:{" "}
        <span className="  text-black">
          {new Date(schedule.createdAt).toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default () => {
  const { openDrawer } = useDrawer();
  const [editingSchedule, setEditingSchedule] = useState<
    GetSchedulesType[number] | null
  >(null);
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
      {editingSchedule && (
        <UpdateScheduleDrawer
          schedule={editingSchedule}
          onUpdated={async () => {
            await Promise.all([
              plannedToRead.refetch(),
              currentlyReading.refetch(),
              recentlyRead.refetch(),
            ]);
          }}
        />
      )}

      <Column
        title="Reading Planned"
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
            <ScheduleCard
              key={plan.id}
              schedule={plan}
              onEditClick={() => {
                setEditingSchedule(plan);
                openDrawer("UpdateScheduleDrawer");
              }}
            />
          ))}
          {/* {plannedToRead.data?.map((plan) => (
            <ScheduleCard key={plan.id} schedule={plan} />
          ))}
          {plannedToRead.data?.map((plan) => (
            <ScheduleCard key={plan.id} schedule={plan} />
          ))}
          {plannedToRead.data?.map((plan) => (
            <ScheduleCard key={plan.id} schedule={plan} />
          ))}
          {plannedToRead.data?.map((plan) => (
            <ScheduleCard key={plan.id} schedule={plan} />
          ))}
          {plannedToRead.data?.map((plan) => (
            <ScheduleCard key={plan.id} schedule={plan} />
          ))}
          {plannedToRead.data?.map((plan) => (
            <ScheduleCard key={plan.id} schedule={plan} />
          ))}
          {plannedToRead.data?.map((plan) => (
            <ScheduleCard key={plan.id} schedule={plan} />
          ))} */}
        </DataContainer>
      </Column>

      <Column title="Reading" description="Items you are reading.">
        <DataContainer
          loading={
            currentlyReading.isLoading ||
            currentlyReading.isFetching ||
            currentlyReading.isRefetching
          }
          empty={(currentlyReading.data ?? []).length === 0}
        >
          {currentlyReading.data?.map((plan) => (
            <ScheduleCard
              key={plan.id}
              schedule={plan}
              onEditClick={() => {
                setEditingSchedule(plan);
                openDrawer("UpdateScheduleDrawer");
              }}
            />
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
            <ScheduleCard key={plan.id} schedule={plan} />
          ))}
        </DataContainer>
      </Column>
    </div>
  );
};
