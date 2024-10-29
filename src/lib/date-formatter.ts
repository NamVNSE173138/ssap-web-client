export const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
}

export const formatOnlyDate = (date: string) => {
    return new Date(date).toLocaleDateString();
}
