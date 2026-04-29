import type { Config } from "jest";

const config: Config = {
    testEnvironment: "jsdom",
    roots: ["<rootDir>/test"],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
    transform: {
        "^.+\\.tsx?$": ["ts-jest", { tsconfig: "tsconfig.json", useESM: true }],
    },
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
        "^@slid/schema$": "<rootDir>/../slid-schema/src/index.ts",
        "^(\\.{1,2}/.*)\\.js$": "$1",
    },
    extensionsToTreatAsEsm: [".ts", ".tsx"],
    collectCoverage: true,
    collectCoverageFrom: [
        "src/stores/**/*.ts",
        "src/design/**/*.ts",
        "src/components/**/*.{ts,vue}",
        "src/views/**/*.{ts,vue}",
        "src/ai/**/*.ts",
        "src/router/**/*.ts",
    ],
    coverageReporters: ["text", "lcov"],
};

export default config;
