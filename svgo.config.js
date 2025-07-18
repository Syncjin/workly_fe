module.exports = {
  plugins: [
    {
      name: "removeDimensions", // width, height 제거
      active: true,
    },
    {
      name: "preset-default",
      params: {
        overrides: {
          // 추가 설정
        },
      },
    },
  ],
};
