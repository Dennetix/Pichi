import { ErrorStore } from 'client/stores/ErrorStore';

describe('ErrorStore', () => {
    test('Sets the error', () => {
        const errorMsg = 'This is an error!';

        const store = new ErrorStore();
        store.setError(errorMsg);

        expect(store.hasError).toBe(true);
        expect(store.error).toBe(errorMsg);
    });

    test('Clears the error', () => {
        const store = new ErrorStore();
        store.setError('This is an error!');
        store.clearError();

        expect(store.hasError).toBe(false);
        expect(store.error).toBe(null);
    });
});
