import { type FC, type ReactNode } from "react";

const Empty = () => (
  <p className=" flex min-h-[120px] items-center justify-center bg-white font-semibold">
    No data.
  </p>
);

const Loading = () => (
  <p className="flex min-h-[120px] items-center justify-center">
    <span className="loading loading-ring loading-lg" />
  </p>
);

export const DataContainer: FC<{
  loading: boolean;
  empty: boolean;
  children: ReactNode;
}> = ({ loading, empty, children }) => {
  if (loading) {
    return <Loading />;
  }

  if (empty) {
    return <Empty />;
  }

  return children;
};
