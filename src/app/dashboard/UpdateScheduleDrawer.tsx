"use client";

import { type FC } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { type Schedule, ReadingStatus } from "@prisma/client";
import { Formik } from "formik";

import Form from "../_components/form-items";
import { Drawer } from "../_components/drawer";
import { api } from "~/trpc/react";
import toast from "react-hot-toast";
import { useDrawer } from "../_store/drawer";
import { type PlannerService } from "~/server/services/PlannerService";

type UpdateScheduleFields = Pick<Schedule, "numOfPagesRead" | "status">;

const updateScheduleToastKey = "updateScheduleToast";

interface Props {
  schedule: Awaited<
    ReturnType<typeof PlannerService.getSchedulesByStatus>
  >[number];
  onUpdated?: (record: Schedule) => void;
}

export const UpdateScheduleDrawer: FC<Props> = ({ onUpdated, schedule }) => {
  const {
    drawer: { UpdateScheduleDrawer },
    closeDrawer,
  } = useDrawer();

  const updateRecord = api.planner.updatePlan.useMutation({
    onSuccess: (data) => {
      toast.success("Scheduled updated!", {
        id: updateScheduleToastKey,
        duration: 4000,
      });
      closeDrawer("UpdateScheduleDrawer");
      onUpdated?.(data);
    },
    onError: (err) => {
      const zodFieldErrors = Object.entries(
        err.data?.zodError?.fieldErrors ?? {},
      ).map(([field, errs]) => (
        <p className="w-full">
          <strong>{field}</strong>: {errs?.join("; ")}
        </p>
      ));

      const errorMsg =
        zodFieldErrors.length > 0 ? (
          <div className=" flex flex-col gap-y-2">
            <div className=" underline underline-offset-4">Field Errors: </div>
            {zodFieldErrors}
          </div>
        ) : (
          err.message
        );
      toast.error(errorMsg, { id: updateScheduleToastKey, duration: 10000 });
    },
  });

  return (
    <>
      <Drawer
        portalKey="update-schedule-drawer"
        isOpen={UpdateScheduleDrawer.isOpen}
        close={() => closeDrawer("UpdateScheduleDrawer")}
        onOverlayClick={() => closeDrawer("UpdateScheduleDrawer")}
        containerClass=" right-0 px-4 py-2"
        Header={
          <div className=" flex items-center justify-between">
            <h2 className=" text-xl font-bold">Plan #{schedule.id}</h2>
            <IoCloseOutline
              onClick={() => closeDrawer("UpdateScheduleDrawer")}
              className="cursor-pointer text-xl"
            />
          </div>
        }
        Footer={null}
      >
        <div className=" py-4">
          <h2 className=" text-md mb-2 font-bold underline underline-offset-4">
            Document:
          </h2>

          <div className=" grid grid-cols-1 gap-2 px-2 text-sm">
            {[
              { label: "Type", value: schedule.document.type },
              { label: "Title", value: schedule.document.title },
              { label: "Description", value: schedule.document.description },
              { label: "Author", value: schedule.document.author },
              { label: "Pages", value: schedule.document.numOfPages },
              {
                label: "Published: ",
                value: new Date(
                  schedule.document.publishedDate,
                ).toLocaleString(),
              },
            ].map((item) => (
              <div
                key={item.label}
                className=" inline-flex flex-wrap items-center gap-2"
              >
                <span className=" text-gray-500">{item.label}:</span>
                <span>{item.value || "-"}</span>
              </div>
            ))}
          </div>
        </div>

        <h2 className=" text-md mt-4 font-bold underline underline-offset-4">
          Plan details:
        </h2>
        <Formik<UpdateScheduleFields>
          initialValues={{
            numOfPagesRead: schedule.numOfPagesRead,
            status: schedule.status,
          }}
          validate={() => {
            return {};
          }}
          onSubmit={(values) => {
            updateRecord.mutate({ ...values, id: schedule.id });
          }}
        >
          {({ handleSubmit, handleChange }) => (
            <form
              className=" my-3 flex flex-col gap-y-4"
              onSubmit={handleSubmit}
            >
              <Form.Item
                Label={
                  <Form.Label requiredMark htmlFor="numOfPagesRead">
                    Pages read
                  </Form.Label>
                }
              >
                <Form.Input
                  type="number"
                  name="numOfPagesRead"
                  onChange={handleChange}
                  required
                  defaultValue={schedule.numOfPagesRead}
                />
              </Form.Item>

              <Form.Item
                Label={
                  <Form.Label requiredMark htmlFor="status">
                    Status
                  </Form.Label>
                }
              >
                <Form.Select
                  name="status"
                  onChange={handleChange}
                  required
                  placeholder="A Game of Thrones"
                  defaultValue={schedule.status}
                >
                  <option value="">Select status</option>
                  {[
                    ReadingStatus.READING_PLANNED,
                    ReadingStatus.READING_IN_PROGRESS,
                    ReadingStatus.READING_COMPLETED,
                  ].map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </Form.Select>
              </Form.Item>

              <Form.Button
                type="submit"
                className=" btn btn-sm mt-3 self-center"
                disabled={updateRecord.isLoading}
              >
                {updateRecord.isLoading && (
                  <span className="loading loading-spinner" />
                )}
                Update
              </Form.Button>
            </form>
          )}
        </Formik>
      </Drawer>
    </>
  );
};
