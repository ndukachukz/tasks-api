export default {
  resolve: {
    alias: {
      "@": Bun.resolveSync("/src", import.meta.dir),
    },
  },
};
