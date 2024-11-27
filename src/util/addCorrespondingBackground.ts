export const addCorrespondingBackground = (columnId: columnId) => {
  switch(columnId) {
    case 'todo':
      return '#56B1E5';
    case 'inProgress':
      return '#E86B79';
    case 'done':
      return '#4B5F74';
    default:
      return '#fff'
  }
}