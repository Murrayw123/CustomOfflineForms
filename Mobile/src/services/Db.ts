import { App, Credentials, User } from 'realm';

export class Database {
    private _app: App;
    private _user: User | undefined;
    private _credentials: Credentials;

    constructor(realmId: string, credentials: Credentials) {
        this._app = new App({ id: realmId });
        this._user = undefined;
        this._credentials = credentials;
    }

    public async login(): Promise<User> {
        this._user = await this._app.logIn(this._credentials);
        return this._user;
    }

    public get user(): User {
        if (this._user) {
            return this._user;
        } else {
            throw new Error('database not initialised!');
        }
    }

    public async logout(): Promise<void> {
        if (this._user) {
            await this._user.logOut();
            this._user = undefined;
        }
    }
}
