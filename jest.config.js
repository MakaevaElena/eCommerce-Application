module.exports = {
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|html)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(scss|css|less)$': '<rootDir>/__mocks__/styleMock.js',
  },
  //roots: ['<rootDir>/src/'],
};
