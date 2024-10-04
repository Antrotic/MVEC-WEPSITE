import { useRouter } from "next/router";

export default function useQueryParams() {
  const router = useRouter();

  const changeQueryParams = (newQueryParams = {}) => {
    router.push(
      {
        pathname: router.pathname, // Keep the same pathname
        query: {
          ...router.query, // Keep other query parameters unchanged
          ...newQueryParams, // Update the value of params
        },
      },
      undefined,
      { scroll: false }
    );
  };

  const removeQueryParams = (paramsList = []) => {
    const queryParams = router.query;
    paramsList.forEach((item) => delete queryParams[item]);
    router.push(
      {
        pathname: router.pathname, // Keep the same pathname
        query: {
          ...queryParams,
        },
      },
      undefined,
      { scroll: false }
    );
  };

  return { query: router.query, changeQueryParams, removeQueryParams };
}
