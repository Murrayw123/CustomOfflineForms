import { IconSource } from 'react-native-paper/src/components/Icon';
import { Subject } from 'rxjs';

interface Route {
    key: string;
    title?: string;
    icon?: IconSource;
    badge?: string | number | boolean;
    color?: string;
    accessibilityLabel?: string;
    testID?: string;
}

export class NavigationService {
    private _currentPage: string;
    private _routes: Route[] = [];
    private _onComponentChange: Subject<number>;
    private _onAvailableRoutesChange: Subject<Route[]>;
    private _history: string[] = [];

    constructor(routes: Route[]) {
        this._routes = routes;
        this._currentPage = routes[0].key;

        this._onComponentChange = new Subject<number>();
        this._onAvailableRoutesChange = new Subject<Route[]>();
    }

    public addRoute(route: Route) {
        this._routes.push(route);
        this._onAvailableRoutesChange.next(this._routes);
    }

    public goBack(): number {
        if (this._history.length > 0) {
            this._history.pop();
            const previousIndex = this._routes.findIndex(
                route => route.key === this._history[this._history.length - 1]
            );
            if (previousIndex !== -1) {
                this.currentIndex = previousIndex;
            } else {
                this._currentPage = this._routes[0].key;
                this._onComponentChange.next(0);
            }
            return this._history.length;
        } else {
            return -1;
        }
    }

    public get routes(): Route[] {
        return this._routes;
    }

    public set currentIndex(index: number) {
        const currentPage = this._routes[index].key;
        this._currentPage = currentPage;
        const lastPageInHistory = this._history[this._history.length - 1];
        if (lastPageInHistory !== currentPage) {
            this._history.push(currentPage);
        }
        this._onComponentChange.next(index);
    }

    public get currentIndex(): number {
        return this._routes.findIndex(route => route.key === this._currentPage);
    }

    public subscribeToComponentChange(onNext: (index: number) => void): void {
        this._onComponentChange.subscribe(onNext);
    }

    public subscribeToAvailableRoutesChange(onNext: (routes: Route[]) => void): void {
        this._onAvailableRoutesChange.subscribe(onNext);
    }
}
