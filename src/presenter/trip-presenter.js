import FiltersView from '../view/filters.js';
import SortingView from '../view/sorting.js';
import PointMenuView from '../view/path-creating.js';
import EditPointView from '../view/path-editing.js';
import PointView from '../view/path-pointing.js';
import { render } from '../render.js';

export default class DefaultMarkupPresenter {
  constructor() {
    this.filters = new FiltersView();
    this.sortingButtons = new SortingView();
    this.pointMenu = new PointMenuView();
    this.editMenu = new EditPointView();
    this.tripPoint = new PointView();
    this.filtersWrapper = document.querySelector('.trip-controls__filters');
    this.tripPointsSection = document.querySelector('.trip-events');
    this.pointsList = document.createElement('ul');
  }

  createToolsMarkup() {
    render(this.filters.getElement(), this.filtersWrapper);
    render(this.sortingButtons.getElement(), this.tripPointsSection);
  }

  createPointsMarkup() {
    this.pointsList.classList.add('.trip-events__list');
    render(this.pointsList, this.tripPointsSection);
    render(this.editMenu.getElement(), this.pointsList);
    render(this.pointMenu.getElement(), this.pointsList);
    for (let i = 0; i < 3; i++) { //Пока что магические числа, вскоре исправлю
      render(this.tripPoint.getElement(), this.pointsList);
    }
  }
}
