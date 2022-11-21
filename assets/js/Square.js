export default function Square(position){
  const STARTING_MARK = '';
  let mark = STARTING_MARK;

  const _getByPos = () => document.querySelector(`[data-pos="${position}"]`);
  const highlight = () => _getByPos().classList.add('highlight');
  const isChecked = () => !!mark;
  const getMark = () => mark;

  const check = (givenMark) => {
    const DOMSquare = _getByPos();
    DOMSquare.textContent = givenMark;
    mark = givenMark;
  }

  const uncheck = () => {
    const DOMSquare = _getByPos();
    DOMSquare.textContent = STARTING_MARK;
    DOMSquare.classList.remove('highlight');
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