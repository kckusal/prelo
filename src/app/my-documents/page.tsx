"use client";

import { api } from "~/trpc/react";
import { AddDocumentDrawer } from "./AddDocumentDrawer";
import { RiDeleteBin6Line } from "react-icons/ri";
import { SiReadthedocs } from "react-icons/si";
import { FaRegCalendarCheck } from "react-icons/fa";
import toast from "react-hot-toast";

const MyDocuments = () => {
  const {
    data: documents,
    refetch,
    isFetching,
  } = api.document.getMyDocuments.useQuery();

  const addPlannedToRead = api.planner.addPlannedToRead.useMutation({
    onSuccess: () => {
      toast.success("Marked as planned to read!", { duration: 5000 });
    },
    onError: () => {
      toast.error("Failed to mark as planned to read!", { duration: 5000 });
    },
  });

  return (
    <div className=" bg-sl mx-auto max-w-[900px] px-3 py-6">
      <div className=" flex items-center justify-between">
        <h1 className=" text-2xl font-extrabold">My Documents</h1>

        <AddDocumentDrawer onDocAdded={() => refetch()} />
      </div>

      <table className=" table table-sm mt-6">
        <thead>
          <tr>
            <th className=" w-[20px]"></th>
            <th className=" w-[40px]">Type</th>
            <th>Title</th>
            <th>Description</th>
            <th>Pages #</th>
            <th>Author</th>
            <th>Published</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {!isFetching &&
            documents?.map((d) => {
              const scheduleStatus = d.schedules[0]?.status;

              return (
                <tr key={d.id}>
                  <th>{d.id}</th>
                  <td>{d.type}</td>
                  <td>{d.title}</td>
                  <td>{d.description}</td>
                  <td>{d.numOfPages}</td>
                  <td>{d.author}</td>
                  <td>{d.publishedDate.toLocaleDateString()}</td>
                  <td className=" text-center">
                    <div className=" inline-flex h-full items-center justify-center gap-x-2">
                      <div
                        data-tip={
                          scheduleStatus === undefined
                            ? "Planning to read?"
                            : scheduleStatus === "READING_PLANNED"
                              ? "Reading planned"
                              : ""
                        }
                        className="tooltip tooltip-primary"
                      >
                        <button
                          className=" btn btn-circle btn-outline btn-primary btn-xs"
                          title="Delete"
                          onClick={() =>
                            addPlannedToRead.mutate({ docId: d.id })
                          }
                          disabled={!!scheduleStatus}
                        >
                          {!scheduleStatus && <SiReadthedocs />}
                          {scheduleStatus === "READING_PLANNED" && (
                            <FaRegCalendarCheck />
                          )}
                        </button>
                      </div>

                      <div
                        className=" tooltip tooltip-error"
                        data-tip="Delete document?"
                      >
                        <button className=" btn btn-circle btn-outline btn-error btn-xs ">
                          <RiDeleteBin6Line />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}

          {isFetching && (
            <tr className=" h-[200px] bg-slate-50 text-center">
              <td colSpan={8}>
                <span className=" loading loading-ring loading-lg" />
              </td>
            </tr>
          )}

          {!isFetching && !documents?.length && (
            <tr className=" h-[200px] bg-slate-200 text-center">
              <td colSpan={8}>No items available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MyDocuments;
