module.exports = {
  preset: 'ts-jest',
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testEnvironment: "jsdom",
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif)$': '<rootDir>/src/__mocks__/fileMock.ts',
    '\\.css$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  transformIgnorePatterns: [
    "/node_modules/",
    "^.+\\.png$",
    "^.+\\.jpg$",
    "^.+\\.jpeg$",
    "^.+\\.gif$",
  ],
};
