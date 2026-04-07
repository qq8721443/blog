const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  year: "numeric",
});

export function formatDate(date: Date | string) {
  return dateFormatter.format(new Date(date));
}

export function formatArchiveDate(date: Date | string) {
  return formatDate(date).toUpperCase();
}
