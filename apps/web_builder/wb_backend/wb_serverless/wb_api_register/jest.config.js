module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	transformIgnorePatterns: [
	  "/node_modules/(?!@kis/common|@kis/wb-data)"
	]
  };