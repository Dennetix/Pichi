import * as React from 'react';
import { observer } from 'mobx-react';

import * as styles from './Error.css';

import ErrorStore from '../stores/ErrorStore';

const Error = observer((props) => {
    if (ErrorStore.hasError) {
        return (
            <div className={styles.wrapper}>
                <span className={styles.error}>An Error occured. (See console for more information)</span>
            </div>
        );
    }
    
    return props.children;
});

export default Error;
