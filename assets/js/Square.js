export default function Square(table, position){
  const STARTING_MARK = '';
  let mark = STARTING_MARK;
  
  const squareElement = document.createElement('td');
  squareElement.dataset.pos = position;
  squareElement.classList.add('square');
  table.append(squareElement);

  const highlight = () => squareElement.classList.add('highlight');
  const isChecked = () => !!mark;
  const getMark = () => mark;

  const makeMarkerElement = (marker) => {
    const markerElement = document.createElement('span');
    markerElement.textContent = marker;
    markerElement.classList.add('marker');
    return markerElement;
  }

  const check = (givenMark) => {
    squareElement.append(makeMarkerElement(givenMark));
    mark = givenMark;
  }

  const uncheck = () => {
    squareElement.textContent = STARTING_MARK;
    squareElement.classList.remove('highlight');
    mark = '';
  }

  return {
    check,
    uncheck,
    isChecked,
    getMark,
    highlight,
    position
  }
}