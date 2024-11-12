export default function getShortTimeType(type) {
  switch (type) {
    case 'minute':
      return 'min';
    case 'hour':
      return 'h';
    default:
      return 'min';
  }
}
