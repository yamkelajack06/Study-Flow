const validateEntryAdd_Update = (entries, entry) => {
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

export default validateEntryAdd_Update;
