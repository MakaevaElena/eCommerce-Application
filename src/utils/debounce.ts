export default function debounce(fn: () => void, delay: number) {
  let timerId;
  if (timerId) {
    clearTimeout(timerId);
  }
  return function delayedFunction() {
    timerId = setTimeout(() => fn(), delay);
  };
}
