export function getInitialName(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .substring(0, 2);
}
