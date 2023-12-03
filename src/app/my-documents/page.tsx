"use client";

import { api } from "~/trpc/react";
import { AddDocumentDrawer } from "./AddDocumentDrawer";

const MyDocuments = () => {
  const { data: documents } = api.document.getMyDocuments.useQuery();

  return (
    <div className=" bg-sl px-3 py-6">
      <div className=" flex items-center justify-between">
        <h1 className=" text-2xl font-extrabold">My Documents</h1>

        <AddDocumentDrawer />
      </div>

      <table className=" table">
        {documents?.length === 0 && <>No records found!</>}

        {JSON.stringify(documents)}
      </table>
    </div>
  );
};

export default MyDocuments;
