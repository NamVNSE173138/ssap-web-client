export const formatNaturalDate = (dateString: string) => {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);

    const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
      dateStyle: "long",
    });
    const formattedDate = dateTimeFormatter.format(date);

    return formattedDate;
  } catch (error) {
    return "N/A";
  }
};

export const calculateAge = (birthDate: string) => {
  if (!birthDate) return "N/A";

  try {
    const birth = new Date(birthDate); // Parse the input date
    const today = new Date(); // Get the current date

    let age = today.getFullYear() - birth.getFullYear(); // Initial age calculation
    const hasHadBirthdayThisYear =
      today.getMonth() > birth.getMonth() ||
      (today.getMonth() === birth.getMonth() &&
        today.getDate() >= birth.getDate());

    // Adjust age if the birthday has not yet occurred this year
    if (!hasHadBirthdayThisYear) age--;

    return age >= 0 ? age : "N/A"; // Return age or handle future dates
  } catch (error) {
    return "N/A";
  }
};
