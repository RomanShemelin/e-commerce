module.exports = (api) => {
  api.cache.using(() => process.env.NODE_ENV);

  const presets = [
    "@babel/preset-env",
    "@babel/preset-typescript",
    [
      "@babel/preset-react",
      {
        runtime: "automatic",
      },
    ],
  ];

  const plugins = [
    ["@babel/plugin-proposal-decorators", { version: "legacy" }],
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-optional-chaining",
    process.env.NODE_ENV === "development" && "react-refresh/babel",
  ].filter(Boolean);

  return {
    presets,
    plugins,
  };
};
