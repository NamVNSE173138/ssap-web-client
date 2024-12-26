export function getFullName(firstName: string, lastName: string): string {
  const checkedFirstName = firstName ?? "";
  const checkedLastName = lastName ?? "";

  const fullName = checkedFirstName + " " + checkedLastName;

  if (fullName.trim() === "") {
    return "Your Full Name";
  }

  return fullName;
}
