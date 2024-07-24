export const calculatePaginationData = (totalItems, perPage, currentPage) => {
    const totalPages = Math.ceil(totalItems / perPage);
    return {
      page: currentPage,
      perPage: perPage,
      totalItems: totalItems,
      totalPages: totalPages,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    };
  };
