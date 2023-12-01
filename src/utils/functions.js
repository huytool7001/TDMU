const merge = (o1, o2) => {
  return {
    ...o2,
    ...Object.keys(o1).reduce(
      (r, c) => ({
        ...r,
        [c]: o2.hasOwnProperty(c)
          ? [...(Array.isArray(o1[c]) ? o1[c] : [o1[c]]), ...(Array.isArray(o2[c]) ? o2[c] : [o2[c]])]
          : o1[c],
      }),
      {},
    ),
  };
};

export { merge };
