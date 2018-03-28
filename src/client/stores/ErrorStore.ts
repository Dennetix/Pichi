import { observable, transaction } from 'mobx';
import autobind from 'autobind-decorator';

export class ErrorStore {
    @observable hasError: boolean = false;
    @observable error: any = null;

    @autobind
    public setError(error: any): void {
        console.error(error);

        transaction(() => {
            this.hasError = true;
            this.error = error;
        });
    }

    @autobind
    public clearError(): void {
        transaction(() => {
            this.hasError = false;
            this.error = null;
        });
    }
}

export default new ErrorStore();
