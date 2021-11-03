import { toParams, toQuery } from './util';

class PopupWindow {
    id: string;
    url: string;
    _iid: any;
    options: any;
    window: any;
    promise: any;
    constructor(id: string, url: string, options = {}) {
        this.id = id;
        this.url = url;
        this.options = options;
    }

    open() {
        const { url, id, options } = this;

        this.window = window.open(url, id, toQuery(options, ','));
    }

    close() {
        this.cancel();
        this.window.close();
    }

    poll() {
        this.promise = new Promise((resolve, reject) => {
            this._iid = window.setInterval(() => {
                try {
                    const popup = this.window;

                    if (!popup || popup.closed !== false) {
                        this.close();

                        reject(new Error('The popup was closed'));

                        return;
                    }

                    if (popup.location.href === this.url || popup.location.pathname === 'blank') {
                        return;
                    }

                    const params = toParams(popup.location.search.replace(/^\?/, ''));

                    resolve(params);

                    this.close();
                } catch (error) {
                    /*
                     * Ignore DOMException: Blocked a frame with origin from accessing a
                     * cross-origin frame.
                     */
                }
            }, 500);
        });
    }

    cancel() {
        if (this._iid) {
            window.clearInterval(this._iid);
            this._iid = undefined;
        }
    }

    then(...args: any[]) {
        return this.promise.then(...args);
    }

    catch(...args: any[]) {
        return this.promise.then(...args);
    }

    static open(...args: any[]) {
        // @ts-ignore
        const popup = new this(...args);

        popup.open();
        popup.poll();

        return popup;
    }
}

export default PopupWindow;
