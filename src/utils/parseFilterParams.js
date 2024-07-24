const parseType = (type) => {
    const isString = typeof type === 'string';
    if (!isString) return;
    const isType = (type) => ['work', 'home', 'personal'].includes(type);

    if (isType(type)) return type;
};

const parseIsFavourite = (isFavourite) => {
    if (typeof isFavourite === 'boolean') {
        return isFavourite;
    }
    if (typeof isFavourite === 'string') {
        return isFavourite.toLowerCase() === 'true';
    }
    return false;
};

export const parseFilterParams = (query) => {
    const { type, isFavourite } = query;

    const parsedType = parseType(type);
    const parsedIsFavourite = parseIsFavourite(isFavourite);

    return { type: parsedType, isFavourite: parsedIsFavourite };
};
