import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type createProjectPageType = "create-template" | "create-Ai" | "create-scratch";

type CreateProjectStore = {
  page: createProjectPageType;
  setPage: (page: createProjectPageType) => void;
};

const useCreateProjectPage = create<CreateProjectStore>()(
  devtools(
    persist(
      (set) => ({
        page: "create-scratch",
        setPage: (page: createProjectPageType) =>
          set({
            page,
          }),
      }),
      {
        name: "createProject",
      }
    )
  )
);

export default useCreateProjectPage;
