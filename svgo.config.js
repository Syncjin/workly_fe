module.exports = {
  plugins: [
    { name: "removeDimensions" }, // width/height 제거
    {
      name: "removeAttrs",
      params: {
        attrs: ["fill", "stroke", "color"], // 제거하고 싶은 속성
      },
    },
  ],
};
