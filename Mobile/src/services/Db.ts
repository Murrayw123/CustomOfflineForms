import { App, User } from 'realm';

export class Database {
    private _app: App;
    private _user: User | undefined;

    constructor(realmId: string) {
        this._app = new App({ id: realmId });
        this._user = undefined;
    }

    public async login(realmCredentials: Realm.Credentials): Promise<User> {
        this._user = await this._app.logIn(realmCredentials);
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
