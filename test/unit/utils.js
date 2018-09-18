exports.shouldTest = shouldTest;
function shouldTest(feature) {
  const features = process.env.TEST_ONLY;
  if (!features) {
    return true;
  } else {
    return features
      .trim()
      .split(",")
      .map(x => x.trim().toLowerCase())
      .includes(feature.toLowerCase());
  }
}
