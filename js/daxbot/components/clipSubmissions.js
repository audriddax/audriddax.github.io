const ClipSubmissions = (submitters) => {
  const submittersList = Array.from(new Set(submitters.map(({ username }) => username)));

  let submitString = "";

  if (submitters.length === 1) {
    submitString = `Submitted by ${submittersList[0]}`
  } else if (submittersList.length === 1) {
    submitString = `Submitted ${submitters.length} times by ${submittersList[0]}`;
  } else if (submittersList.length === 1) {
    submitString = `Submitted ${submitters.length} times by ${submittersList[0]} and ${submittersList[1]}`;
  } else {
    submitString = `Submitted ${submitters.length} times by ${submittersList[0]} and ${submittersList.length} others`;
  }
};

export default ClipSubmissions;
