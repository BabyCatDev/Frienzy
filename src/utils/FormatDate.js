export const formatDate = (date) => {
    const options = { month: 'short', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    return date.toLocaleDateString('en-US', options);
  };
