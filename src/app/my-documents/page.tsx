"use client";

import { api } from "~/trpc/react";
import { AddDocumentDrawer } from "./AddDocumentDrawer";
import { RiDeleteBin6Line } from "react-icons/ri";
import { SiReadthedocs } from "react-icons/si";

const MyDocuments = () => {
  const {
    data: documents,
    refetch,
    isFetching,
  } = api.document.getMyDocuments.useQuery();

  return (
    <div className=" bg-sl mx-auto max-w-[900px] px-3 py-6">
      <div className=" flex items-center justify-between">
        <h1 className=" text-2xl font-extrabold">My Documents</h1>

        <AddDocumentDrawer onDocAdded={() => refetch()} />
      </div>

      <table className=" table-sm mt-6 table">
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
            documents?.map((d) => (
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
                      data-tip="Planning to read?"
                      className="tooltip tooltip-primary"
                    >
                      <button
                        className=" btn btn-primary btn-outline btn-circle btn-xs"
                        title="Delete"
                      >
                        <SiReadthedocs />
                      </button>
                    </div>

                    <div
                      className=" tooltip tooltip-error"
                      data-tip="Delete document?"
                    >
                      <button className=" btn btn-error btn-circle btn-outline btn-xs ">
                        <RiDeleteBin6Line />
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}

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
