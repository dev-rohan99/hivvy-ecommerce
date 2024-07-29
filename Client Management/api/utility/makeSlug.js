

export const makeSlug = (text) => {
    if (!text) {
        return '';
    }
    const cleanedTitle = text.replace(/[^\w\s]/gi, "");
    const slug = cleanedTitle.replace(/\s+/g, "-").toLowerCase();
    return slug;
}

