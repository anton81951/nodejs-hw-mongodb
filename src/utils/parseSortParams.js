import { SORT_ORDER } from '../constants/index.js';

const parseSortOrder = (sortOrder) => {

    if ([SORT_ORDER.ASC, SORT_ORDER.DESC].includes(sortOrder)) {
        return sortOrder;
      }

      return SORT_ORDER.ASC;
};

const parseSortBy = (sortBy) => {
    const validKeys = [
        '_id',
        'name',
        'phoneNumber',
        'email',
        'isFavourite',
        'contactType',
        'createdAt'
    ];

    if (validKeys.includes(sortBy)) {
        return sortBy;
      }

      return '_id';
};

export const parseSortParams = (query) => {
    const { sortOrder, sortBy } = query;

    const parsedSortBy = parseSortBy(sortBy);
  const parsedSortOrder = parseSortOrder(sortOrder);

    return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  };
};
