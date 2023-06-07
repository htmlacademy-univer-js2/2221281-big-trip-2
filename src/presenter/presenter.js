import CreateFormView from "../view/trip-event-add-view";
import EditFormView from "../view/trip-event-edit-view";
import EventsView from "../view/trip-events-list-view";
import RoutePointView from "../view/route-point-view";
import SortView from "../view/sort-view";
import { render } from "../render";

export default class EventsPresenter {
    #eventsList = null;
    #container = null;
    #pointsModel = null;
    #boardPoints = null;
    #destinations = null;
    #offers = null;

    constructor(container) {
        this.#eventsList = new EventsView();
        this.#container = container;
    }

    init(pointsModel) {
        this.#pointsModel = pointsModel;
        this.#boardPoints = [...this.#pointsModel.points];
        this.#destinations = [...this.#pointsModel.destinations];
        this.#offers = [...this.#pointsModel.offers];
        render(new SortView(), this.#container);
        render(this.#eventsList, this.#container);
        for (const point of this.#boardPoints) {
            this.#renderPoint(point)
        }
    }

    #renderPoint = (point) => {
        const pointComponent = new RoutePointView(point, this.#destinations, this.#offers)
        const formEditComponent = new EditFormView(point, this.#destinations, this.#offers);
        const replacePointToEditForm = () => {
            this.#eventsList.element.replaceChild(formEditComponent.element, pointComponent.element);
        };
        const replaceEditFormToPoint = () => {
            this.#eventsList.element.replaceChild(pointComponent.element, formEditComponent.element);
        };
        const onEscKeyDown = (evt) => {
            if (evt.key === 'Escape' || evt.key === 'Esc') {
                evt.preventDefault();
                replaceEditFormToPoint();
                document.removeEventListener('keydown', onEscKeyDown);
            }
        };
        pointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
            replacePointToEditForm();
            document.addEventListener('keydown', onEscKeyDown);
        });
        formEditComponent.element.querySelector('.event__rollup-btn').addEventListener('click', (evt) => {
            evt.preventDefault();
            replaceEditFormToPoint();
            document.removeEventListener('keydown', onEscKeyDown);
        });
        formEditComponent.element.querySelector('form').addEventListener('submit', (evt) => {
            evt.preventDefault();
            replaceEditFormToPoint();
            document.removeEventListener('keydown', onEscKeyDown);
        });
        render(pointComponent, this.#eventsList.element);
    }
}
