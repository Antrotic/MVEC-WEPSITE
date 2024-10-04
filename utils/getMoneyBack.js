export function calculateChangeOptions(productPrice) {
  if (!productPrice) return [];
  const actualPrice = productPrice;
  productPrice = Math.ceil(productPrice);
  const dimensionNum = 10 ** (productPrice?.toString().length - 1);
  const a = productPrice % dimensionNum;
  const b = productPrice - a;
  const result = [];

  if (dimensionNum <= 10) {
    if (actualPrice < dimensionNum * 5) {
      result.push(dimensionNum * 5);
    }
    if (Math.ceil(productPrice / dimensionNum) * dimensionNum !== productPrice)
      result.push(Math.ceil(productPrice / dimensionNum) * dimensionNum);
    result.push(dimensionNum * 10);
    result.push(dimensionNum * 10 + dimensionNum * 5);
    result.push(dimensionNum * 20);
  } else {
    const firstPrediction =
      b +
      Math.ceil(a / 10 ** Math.ceil(dimensionNum.toString().length / 3)) *
        10 ** Math.ceil(dimensionNum.toString().length / 3);
    if (firstPrediction !== actualPrice) result.push(firstPrediction);
    if (a < dimensionNum / 2 && result[0] !== b + dimensionNum / 2)
      result.push(b + dimensionNum / 2);
    result.push(b + dimensionNum);
  }

  return Array.from(new Set(result.sort((a, b) => a - b)));
}
