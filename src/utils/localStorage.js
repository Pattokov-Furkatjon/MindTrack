export const getMindTrackData = () => {
  try {
    const raw = localStorage.getItem('mindtrack_data');
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    console.error('Error reading mindtrack_data', error);
    return {};
  }
};

export const setMindTrackData = (data) => {
  try {
    localStorage.setItem('mindtrack_data', JSON.stringify(data));
  } catch (error) {
    console.error('Error writing mindtrack_data', error);
  }
};
