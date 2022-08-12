export default {
  EXCHANGE: {
    requestFailed: (code: number, msg: string): string => {
      return `Request failed with Exchange status ${code}. ${msg}`
    },
  },
  REDBENX: {
    requestFailed: (code: number, msg: string): string => {
      return `Request failed with RedBenx status ${code}. ${msg}`
    },
  },
}
