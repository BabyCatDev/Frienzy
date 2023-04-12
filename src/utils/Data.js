export const getTime = (orderDate) => {
  let date = new Date(orderDate);
  let h = date.getUTCHours();
  let m = date.getUTCMinutes();

  return `${h}:${m < 10 ? "0" + m : m}`;
};

export const getDate = (orderDate) => {
  let date = new Date(orderDate);
  let d = date.getUTCDate();
  let m = date.getUTCMonth();
  let y = date.getUTCFullYear();

  return `${d}.${m < 10 ? "0" + (m + 1) : m + 1}.${y}`;
};
