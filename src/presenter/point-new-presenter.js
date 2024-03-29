import { render, remove, RenderPosition } from '../framework/render.js';
import EditFormView from '../view/trip-event-edit-view.js';
import { UserAction, UpdateType } from '../utils/consts.js';

export default class PointNewPresenter {
  #pointListContainer = null;
  #formEditComponent = null;
  #changeData = null;
  #destroyCallback = null;
  #destinationsModel = null;
  #offersModel = null;
  #destinations = null;
  #offers = null;

  constructor({pointListContainer, changeData, destinationsModel, offersModel}) {
    this.#pointListContainer = pointListContainer;
    this.#changeData = changeData;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init = (callback) => {
    this.#destroyCallback = callback;
    if (this.#formEditComponent !== null) {
      return;
    }
    this.#destinations = [...this.#destinationsModel.destinations];
    this.#offers = [...this.#offersModel.offers];
    this.#formEditComponent = new EditFormView({
      destinations: this.#destinations,
      offers: this.#offers,
      isNewPoint: true
    });
    this.#formEditComponent.setSubmitClickHandler(this.#handleFormSubmit);
    this.#formEditComponent.setDeleteClickHandler(this.#handleDeleteClick);
    render(this.#formEditComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  destroy = () => {
    if (this.#formEditComponent === null) {
      return;
    }
    this.#destroyCallback?.();
    remove(this.#formEditComponent);
    this.#formEditComponent = null;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  setSaving = () => {
    this.#formEditComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  };

  setAborting = () => {
    this.#formEditComponent.shake(this.#resetFormState);
  };

  #resetFormState = () => {
    this.#formEditComponent.updateElement({
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    });
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point
    );
  };
}
