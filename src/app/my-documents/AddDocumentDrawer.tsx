"use client";

import { type FC, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { type Document } from "@prisma/client";
import { Formik } from "formik";

import Form from "../_components/form-items";
import { Drawer } from "../_components/drawer";
import { api } from "~/trpc/react";
import toast from "react-hot-toast";

type AddDocFields = Pick<
  Document,
  "type" | "title" | "description" | "numOfPages" | "author" | "publishedDate"
>;

const addDocToastKey = "addDocToast";

interface Props {
  onDocAdded?: (doc: Document) => void;
}

export const AddDocumentDrawer: FC<Props> = ({ onDocAdded }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const addDoc = api.document.addNew.useMutation({
    onSuccess: (data) => {
      toast.success("Document added successfully!", {
        id: addDocToastKey,
        duration: 4000,
      });
      setIsDrawerOpen(false);
      onDocAdded?.(data);
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
      toast.error(errorMsg, { id: addDocToastKey, duration: 10000 });
    },
  });

  return (
    <>
      <button
        className="btn btn-primary btn-sm  "
        onClick={() => setIsDrawerOpen(true)}
      >
        Add new
      </button>
      <Drawer
        portalKey="add-doc-drawer"
        isOpen={isDrawerOpen}
        close={() => setIsDrawerOpen(false)}
        onOverlayClick={() => setIsDrawerOpen(false)}
        containerClass=" right-0 px-4 py-2"
        Header={
          <div className=" flex items-center justify-between">
            <h2 className=" text-xl font-bold">New document</h2>
            <IoCloseOutline
              onClick={() => setIsDrawerOpen(false)}
              className="cursor-pointer text-xl"
            />
          </div>
        }
        Footer={null}
      >
        <Formik<AddDocFields>
          initialValues={{ type: "BOOK" } as AddDocFields}
          validate={() => {
            return {};
          }}
          onSubmit={(values) => {
            addDoc.mutate({
              ...values,
              publishedDate: new Date(values.publishedDate),
            });
          }}
        >
          {({ values, handleSubmit, handleChange }) => (
            <form
              className=" my-6 flex flex-col gap-y-4"
              onSubmit={handleSubmit}
            >
              <Form.Item
                Label={
                  <Form.Label requiredMark htmlFor="type">
                    Type
                  </Form.Label>
                }
              >
                <Form.Input
                  type="text"
                  name="type"
                  onChange={handleChange}
                  required
                  disabled
                  defaultValue={values.type}
                />
              </Form.Item>

              <Form.Item
                Label={
                  <Form.Label requiredMark htmlFor="title">
                    Title
                  </Form.Label>
                }
              >
                <Form.Input
                  type="text"
                  name="title"
                  onChange={handleChange}
                  required
                  placeholder="A Game of Thrones"
                  autoFocus
                />
              </Form.Item>

              <Form.Item
                Label={
                  <Form.Label htmlFor="description">Description</Form.Label>
                }
              >
                <Form.TextArea
                  name="description"
                  onChange={handleChange}
                  required
                  placeholder="A Game of Thrones is the first novel in A Song of Ice and Fire, a series of fantasy novels by American author George R. R. Martin."
                  rows={3}
                  className=" max-h-[400px] min-h-[120px]"
                />
              </Form.Item>

              <Form.Item
                Label={
                  <Form.Label htmlFor="numOfPages">Number of Pages</Form.Label>
                }
              >
                <Form.Input
                  type="number"
                  name="numOfPages"
                  onChange={handleChange}
                  min={1}
                />
              </Form.Item>

              <Form.Item
                Label={<Form.Label htmlFor="author">Author</Form.Label>}
              >
                <Form.Input
                  name="author"
                  onChange={handleChange}
                  placeholder="George R. R. Martin"
                />
              </Form.Item>

              <Form.Item
                Label={
                  <Form.Label htmlFor="publishedDate">
                    Published Date
                  </Form.Label>
                }
              >
                <Form.Input
                  type="date"
                  name="publishedDate"
                  onChange={handleChange}
                />
              </Form.Item>

              {/* <Form.Item Label={<Form.Label htmlFor="tags">Tags</Form.Label>}>
                <Form.TextArea
                  name="tags"
                  onChange={handleChange}
                  required
                  placeholder="fiction,george,"
                  rows={3}
                  className=" max-h-[400px] min-h-[120px]"
                />
              </Form.Item> */}

              <Form.Button type="submit" className=" max-w-[120px] self-end">
                Submit
              </Form.Button>
            </form>
          )}
        </Formik>
      </Drawer>
    </>
  );
};
