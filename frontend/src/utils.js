export function displayDate(dateString) {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return null; // or throw an error, depending on how you want to handle invalid dates
    }
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() returns 0-11
    const year = date.getFullYear();
    
    return `${day}.${month}.${year}`;
}