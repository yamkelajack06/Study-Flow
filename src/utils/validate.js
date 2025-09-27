const validateEntryAdd = (entries, entry) => {
  let alreadyExists = false;
  entries.forEach((Entry) => {
    if (entry.day === Entry.day && Entry.startTime === entry.startTime) {
      Entry.id === entry.id;
      alreadyExists = true;
      return;
    }
  });

  return alreadyExists;
};

const validateEntryUpdate = (entries, entry) => {
  let alreadyExists = false;
  entries.forEach((Entry) => {
    if (
      entry.day === Entry.day &&
      Entry.startTime === entry.startTime &&
      entry.id != Entry.id
    ) {
      Entry.id === entry.id;
      alreadyExists = true;
      return;
    }
  });

  return alreadyExists;
};

export default validateEntryAdd;
export { validateEntryUpdate };
