import * as React from 'react';
import { render } from 'react-dom';

import Error from './components/Error';
import Canvas from './components/Canvas';

const App = () => {
    return (
        <div>
            <Error>
                <Canvas />
            </Error>
        </div>
    );
};

render(<App />, document.getElementById('app'));
