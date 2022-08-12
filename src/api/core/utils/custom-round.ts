export const customRound = function (number: number, decimalPlaces: number): number {
  const digit = Math.pow(10, decimalPlaces)
  return Math.round(number * digit) / digit
}
