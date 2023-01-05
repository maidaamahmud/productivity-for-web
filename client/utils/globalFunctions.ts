import { NextRouter } from "next/router";

export const refreshData = (router: NextRouter) => {
  // refetches data (projects)
  router.replace(router.asPath);
};
